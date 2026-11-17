import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth";
import { apiError } from "@/lib/http";
import {
  adminEntitySchema,
  adminQuerySchema,
  adminUserCreateSchema,
} from "@/lib/validation";
import { contentModel } from "@/models/contentModel";
import { userModel } from "@/models/userModel";
import { prisma } from "@/models/prisma/client";
import { modules } from "@/lib/cms/modules";
import { MethodNotAllowedError } from "@/lib/http";
import { logAuditAction } from "@/models/auditModel";
import { saveCms } from "@/models/cmsModel";
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ entity: string }> },
) {
  try {
    const { entity: raw } = await params;
    const entity = adminEntitySchema.parse(raw);
    if (!modules[entity]) throw new MethodNotAllowedError();
    await requirePermission(request, entity, "read");
    const query = adminQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams),
    );
    const allUsers =
      entity === "users"
        ? (await userModel.list()).filter(
            (u) =>
              !query.search ||
              `${u.name} ${u.email} ${u.role}`
                .toLowerCase()
                .includes(query.search.toLowerCase()),
          )
        : [];
    const result =
      entity === "users"
        ? {
            data: allUsers.slice(
              (query.page - 1) * (query.limit || 20),
              query.page * (query.limit || 20),
            ),
            total: allUsers.length,
          }
        : await contentModel.query(entity, query);
    const drafts =
      entity === "users"
        ? []
        : await prisma.contentDraft.findMany({
            where: { entity },
            orderBy: { updatedAt: "desc" },
          });
    const deleted = ["articles", "programs", "team"].includes(entity)
      ? await contentModel.listDeleted(
          entity as "articles" | "programs" | "team",
        )
      : [];
    return NextResponse.json({ success: true, ...result, drafts, deleted });
  } catch (error) {
    return apiError(error);
  }
}
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ entity: string }> },
) {
  try {
    const { entity: raw } = await params;
    const entity = adminEntitySchema.parse(raw);
    if (!modules[entity]) throw new MethodNotAllowedError();
    const actor = await requirePermission(request, entity, "create");
    const body = await request.json();
    const data =
      entity === "users"
        ? await userModel.create(adminUserCreateSchema.parse(body.payload))
        : await saveCms(
            entity,
            null,
            body.payload,
            actor.id,
            body.draft === true,
          );
    await logAuditAction(
      { userName: String(actor.email), userEmail: String(actor.email) },
      "update",
      entity,
      "Enregistrement CMS",
      String(data?.id || ""),
    );
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
