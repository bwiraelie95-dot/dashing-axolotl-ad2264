import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, requireSuperAdmin } from '@/lib/auth';
import { apiError, getRequestIp } from '@/lib/http';
import { adminEntitySchema, entityPayloadSchema, idSchema } from '@/lib/validation';
import { contentModel } from '@/models/contentModel';
import { userModel } from '@/models/userModel';
import { logAuditAction } from '@/models/auditModel';

export const runtime = 'nodejs';

interface RouteContext {
  params: Promise<{ entity: string; id: string }>;
}

async function routeParameters(context: RouteContext) {
  const params = await context.params;
  return { entity: adminEntitySchema.parse(params.entity), id: idSchema.parse(params.id) };
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { entity, id } = await routeParameters(context);
    if (entity === 'users') await requireSuperAdmin(request);
    else await requireAdmin(request);
    const item = entity === 'users' ? await userModel.findById(id) : await contentModel.findById(entity, id);
    if (!item) return NextResponse.json({ success: false, error: 'Élément introuvable.' }, { status: 404 });
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { entity, id } = await routeParameters(context);
    const actor = entity === 'users' ? await requireSuperAdmin(request) : await requireAdmin(request);
    const payload = entityPayloadSchema.parse(await request.json());
    const item = entity === 'users' ? await userModel.update(id, payload) : await contentModel.update(entity, id, payload);
    if (!item) return NextResponse.json({ success: false, error: 'Élément introuvable.' }, { status: 404 });

    await logAuditAction(
      { userName: String(actor.email), userEmail: String(actor.email) },
      'update',
      entity,
      `Mise à jour dans ${entity} : ${id}.`,
      id,
      getRequestIp(request)
    );
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { entity, id } = await routeParameters(context);
    const actor = entity === 'users' ? await requireSuperAdmin(request) : await requireAdmin(request);
    const deleted = entity === 'users' ? await userModel.delete(id) : await contentModel.delete(entity, id);
    if (!deleted) return NextResponse.json({ success: false, error: 'Élément introuvable.' }, { status: 404 });

    await logAuditAction(
      { userName: String(actor.email), userEmail: String(actor.email) },
      'delete',
      entity,
      `Suppression dans ${entity} : ${id}.`,
      id,
      getRequestIp(request)
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error);
  }
}
