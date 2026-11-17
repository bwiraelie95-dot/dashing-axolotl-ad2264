import {readMedia} from '@/lib/media-storage';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface RouteContext {
  params: Promise<{ key: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { key } = await context.params;
  if (!key || key.length > 600 || key.includes('/') || key.includes('\\')) {
    return NextResponse.json({ success: false, error: 'Média invalide.' }, { status: 400 });
  }

  const entry = await readMedia(key);
  if (!entry) {
    return NextResponse.json({ success: false, error: 'Média introuvable.' }, { status: 404 });
  }

  const contentType = typeof entry.metadata.contentType === 'string'
    ? entry.metadata.contentType
    : entry.data.type || 'application/octet-stream';
  return new Response(entry.data.stream(), {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Type': contentType,
      'X-Content-Type-Options':'nosniff',
      'Content-Security-Policy':"default-src 'none'; sandbox",
      ...(entry.etag ? { ETag: entry.etag } : {})
    }
  });
}
