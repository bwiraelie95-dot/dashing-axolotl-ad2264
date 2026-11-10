import { NextRequest, NextResponse } from 'next/server';
import { ForbiddenError, requireAdmin, requireContentEditor, requireSuperAdmin } from '@/lib/auth';
import { apiError, getRequestIp, MethodNotAllowedError } from '@/lib/http';
import {
  adminEntitySchema,
  adminUserPatchSchema,
  bannerPatchSchema,
  contactSubmissionPatchSchema,
  entityPayloadSchema,
  idSchema,
  siteSettingsPatchSchema
} from '@/lib/validation';
import { contentModel } from '@/models/contentModel';
import { deleteStoredMedia } from '@/models/mediaModel';
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
    const actor = entity === 'users' || entity === 'siteSettings'
      ? await requireSuperAdmin(request)
      : await requireContentEditor(request);
    if (['auditLogs', 'media', 'donors'].includes(entity)) throw new MethodNotAllowedError();
    const body: unknown = await request.json();
    const payload: Record<string, unknown> = entity === 'users'
      ? adminUserPatchSchema.parse(body)
      : entity === 'banners'
        ? bannerPatchSchema.parse(body)
        : entity === 'contactSubmissions'
          ? contactSubmissionPatchSchema.parse(body)
          : entity === 'siteSettings'
            ? siteSettingsPatchSchema.parse(body)
            : entityPayloadSchema.parse(body);
    if (entity === 'users' && actor.id === id && payload.role && payload.role !== 'super-admin') {
      throw new ForbiddenError('Vous ne pouvez pas retirer votre propre rôle super-administrateur.');
    }
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
    const actor = ['users', 'siteSettings', 'donors', 'contactSubmissions'].includes(entity)
      ? await requireSuperAdmin(request)
      : await requireContentEditor(request);
    if (['auditLogs', 'siteSettings'].includes(entity)) throw new MethodNotAllowedError();
    if (entity === 'users') {
      if (actor.id === id) throw new ForbiddenError('Vous ne pouvez pas supprimer votre propre compte.');
      const target = await userModel.findById(id);
      if (target?.role === 'super-admin') {
        throw new ForbiddenError('Un compte super-administrateur ne peut pas être supprimé depuis cette interface.');
      }
    }
    const media = entity === 'media' ? await contentModel.findById<Record<string, unknown> & { id: string }>('media', id) : null;
    if (media) {
      const banners = await contentModel.list<Record<string, unknown> & { id: string }>('banners');
      const mediaUrl = media.url ?? media.fileUrl;
      const usedByBanner = banners.some((banner) => (banner.imageUrl ?? banner.image) === mediaUrl);
      if (usedByBanner) {
        return NextResponse.json(
          { success: false, error: 'Ce média est encore utilisé par une bannière.' },
          { status: 409 }
        );
      }
    }
    const deleted = entity === 'users' ? await userModel.delete(id) : await contentModel.delete(entity, id);
    if (!deleted) return NextResponse.json({ success: false, error: 'Élément introuvable.' }, { status: 404 });
    if (media) {
      await deleteStoredMedia(media.url ?? media.fileUrl).catch((error) => {
        console.error('[ACV media cleanup]', error);
      });
    }

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
