import { rateLimit } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { apiError, getRequestIp } from '@/lib/http';
import { contactSchema, donationSchema } from '@/lib/validation';
import { publicContentModel, type PublicResource } from '@/models/publicContentModel';

export const runtime = 'nodejs';

const getResourceSchema = z.enum([
  'settings',
  'banners',
  'programs',
  'articles',
  'team',
  'founders',
  'field-staff',
  'governance',
  'partners',
  'testimonials',
  'stats',
  'policies',
  'field-notes'
]);
const postResourceSchema = z.enum(['contact', 'donate']);
const listQuerySchema = z.object({
  category: z.string().trim().max(100).optional(),
  search: z.string().trim().max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(24)
});

interface RouteContext {
  params: Promise<{ resource: string }>;
}

const publicCacheHeaders = {
  'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=900'
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { resource: rawResource } = await context.params;
    const resource = getResourceSchema.parse(rawResource);

    if (resource === 'settings') {
      return NextResponse.json(
        { success: true, data: await publicContentModel.getSettings() },
        { headers: publicCacheHeaders }
      );
    }
    if (resource === 'banners') {
      const pageRoute =
        request.nextUrl.searchParams.get('pageRoute') ??
        request.nextUrl.searchParams.get('page') ??
        request.nextUrl.searchParams.get('page_assignment') ??
        undefined;
      return NextResponse.json(
        { success: true, data: await publicContentModel.getBanners(pageRoute) },
        { headers: { 'Cache-Control': 'no-store, max-age=0' } }
      );
    }

    const query = listQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams));
    const result = await publicContentModel.list(resource as PublicResource, query);
    return NextResponse.json(
      {
        success: true,
        data: result.data,
        total: result.total,
        page: query.page,
        limit: query.limit,
        hasMore: query.page * query.limit < result.total
      },
      { headers: publicCacheHeaders }
    );
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { resource: rawResource } = await context.params;
    const resource = postResourceSchema.parse(rawResource);
    if (resource === 'contact') await rateLimit(request, 'contact', 5, 60000);
    if (Number(request.headers.get('content-length') || 0) > 65536) {
      return NextResponse.json({ success: false, error: 'Message trop volumineux.' }, { status: 413 });
    }
    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, 'utf8') > 65536) {
      return NextResponse.json({ success: false, error: 'Message trop volumineux.' }, { status: 413 });
    }
    let body: unknown;
    try { body = JSON.parse(rawBody); } catch {
      return NextResponse.json({ success: false, error: 'Formulaire invalide.' }, { status: 400 });
    }
    // Honeypot: normal visitors never fill this field.
    if (resource === 'contact' && body && typeof body === 'object' && 'website' in body && body.website) {
      return NextResponse.json({ success: true, data: { message: 'Merci pour votre message.' } }, { status: 201 });
    }
    const ipAddress = getRequestIp(request);

    const data =
      resource === 'contact'
        ? await publicContentModel.submitContact(contactSchema.parse(body), ipAddress)
        : await publicContentModel.submitDonation(donationSchema.parse(body), ipAddress);

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
