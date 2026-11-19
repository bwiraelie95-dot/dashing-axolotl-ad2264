import { saveCms } from '@/models/cmsModel';
import { modules } from '@/lib/cms/modules';
import { requirePermission } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, requireContentEditor, requireSuperAdmin } from '@/lib/auth';
import { apiError, getRequestIp, MethodNotAllowedError } from '@/lib/http';
import {
  adminEntitySchema,
  adminQuerySchema,
  adminUserCreateSchema,
  bannerPayloadSchema,
  entityPayloadSchema
} from '@/lib/validation';
import { contentModel } from '@/models/contentModel';
import { userModel } from '@/models/userModel';
import { logAuditAction } from '@/models/auditModel';

export const runtime = 'nodejs';

interface RouteContext {
  params: Promise<{ entity: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { entity: rawEntity } = await context.params;
    const entity = adminEntitySchema.parse(rawEntity);
    await requirePermission(request, entity, 'read');
    const query = adminQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams));

    if (entity === 'users') {
      let users = await userModel.list();
      if (query.search) {
        const needle = query.search.toLowerCase();
        users = users.filter((user) => `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(needle));
      }
      if (query.status && query.status !== 'all') users = users.filter((user) => user.status === query.status);
      const total = users.length;
      if (query.limit) users = users.slice((query.page - 1) * query.limit, query.page * query.limit);
      return NextResponse.json({ success: true, total, data: users });
    }

    const result = await contentModel.query(entity, query);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { entity: rawEntity } = await context.params;
    const entity = adminEntitySchema.parse(rawEntity);
    const actor = await requirePermission(request, entity, 'create');
    if (['auditLogs', 'media', 'donors', 'contactSubmissions', 'siteSettings'].includes(entity)) {
      throw new MethodNotAllowedError();
    }
    const body: unknown = await request.json();
    const payload = entity === 'users'
      ? adminUserCreateSchema.parse(body)
      : entity === 'banners'
        ? bannerPayloadSchema.parse(body)
        : entityPayloadSchema.parse(body);

    const item = entity === 'users' ? await userModel.create(payload) : modules[entity] ? await saveCms(entity,null,body,actor.id,false) : await contentModel.create(entity, payload);
    if(!item)throw new Error('Enregistrement introuvable.');
    await logAuditAction(
      { userName: String(actor.email), userEmail: String(actor.email) },
      'create',
      entity,
      `Création dans ${entity} : ${item.id}.`,
      item.id,
      getRequestIp(request)
    );
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
