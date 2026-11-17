import { can } from '@/lib/permissions';
import { prisma } from '@/models/prisma/client';
import { jwtVerify, SignJWT } from 'jose';
import type { NextRequest } from 'next/server';
import { userModel, type SafeAdminUser } from '@/models/userModel';

export class UnauthorizedError extends Error {
  constructor(message = 'Authentification administrateur requise.') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Vous ne disposez pas des autorisations nécessaires.') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) {
    throw new Error('AUTH_SECRET must be configured in production.');
  }
  return new TextEncoder().encode(value);
}

export async function issueAuthToken(user: SafeAdminUser) {
  const record = await prisma.user.findUniqueOrThrow({ where: { externalId: user.id } });
  return new SignJWT({ role: user.role, email: user.email, version: record.sessionVersion })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(secret());
}

export async function verifyAuthToken(token: string) {
  const { payload } = await jwtVerify(token, secret());
  if (!payload.sub) throw new UnauthorizedError();
  return payload;
}

export async function requireAdmin(request: Request) {
  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) throw new UnauthorizedError();

  let payload;
  try {
    payload = await verifyAuthToken(authorization.slice(7));
  } catch (error) {
    if (error instanceof UnauthorizedError) throw error;
    throw new UnauthorizedError('Session expirée ou invalide.');
  }

  const user = await userModel.findById(String(payload.sub));
  if (!user || user.status !== 'active') throw new UnauthorizedError('Compte inactif ou session invalide.');
  const record = await prisma.user.findUniqueOrThrow({ where: { externalId: user.id } });
  if (payload.version !== record.sessionVersion) throw new UnauthorizedError('Session révoquée.');
  return user;
}

export async function requireSuperAdmin(request: Request) {
  const user = await requireAdmin(request);
  if (user.role !== 'super-admin') throw new ForbiddenError();
  return user;
}

export async function requireContentEditor(request: Request) {
  const user = await requireAdmin(request);
  if (!['super-admin', 'admin', 'editor'].includes(user.role)) throw new ForbiddenError();
  return user;
}

export async function requirePermission(request: Request, entity: string, action: string) {
 const user = await requireAdmin(request);
 if (!can(user.role, entity, action)) throw new ForbiddenError();
 return user;
}
