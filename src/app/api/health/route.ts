import { NextResponse } from 'next/server';
import { prisma } from '@/models/prisma/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function healthTimeoutMs() {
  const configured = Number(process.env.DATABASE_HEALTH_TIMEOUT_MS ?? 5_000);
  return Number.isFinite(configured) ? Math.min(Math.max(configured, 1_000), 15_000) : 5_000;
}

async function databaseIsReachable() {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('Database health check timed out.')), healthTimeoutMs());
      })
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function GET() {
  const startedAt = Date.now();
  const timestamp = new Date().toISOString();

  try {
    await databaseIsReachable();
    return NextResponse.json(
      {
        status: 'ok',
        database: 'connected',
        environment: process.env.NODE_ENV,
        responseTimeMs: Date.now() - startedAt,
        timestamp
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('[ACV health] Database connectivity failed.', error);
    return NextResponse.json(
      {
        status: 'degraded',
        database: 'unreachable',
        environment: process.env.NODE_ENV,
        responseTimeMs: Date.now() - startedAt,
        timestamp
      },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
