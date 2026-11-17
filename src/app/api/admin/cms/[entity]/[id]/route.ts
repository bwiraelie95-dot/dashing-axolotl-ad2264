import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth";
import { apiError } from "@/lib/http";
import { adminEntitySchema, adminUserPatchSchema } from "@/lib/validation";
import { userModel } from "@/models/userModel";
import { prisma } from "@/models/prisma/client";
import { modules } from "@/lib/cms/modules";
import { MethodNotAllowedError } from "@/lib/http";
import { logAuditAction } from "@/models/auditModel";
import { saveCms } from "@/models/cmsModel";
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ entity: string; id: string }> },
) {
  try {
    const { entity: raw, id } = await params;
    const entity = adminEntitySchema.parse(raw);
    if (!modules[entity]) throw new MethodNotAllowedError();
    await requirePermission(request, entity, "read");
    if (entity === "users")
      return NextResponse.json({ success: true, data: [] });
    const data = await prisma.contentRevision.findMany({
      where: { entity, recordId: id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return apiError(error);
  }
}
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ entity: string; id: string }> },
) {
  try {
    const { entity: raw, id } = await params;
    const entity = adminEntitySchema.parse(raw);
    if (!modules[entity]) throw new MethodNotAllowedError();
    const actor = await requirePermission(request, entity, "update");
    const body = await request.json();
    const data =
      entity === "users"
        ? await userModel.update(id, adminUserPatchSchema.parse(body.payload))
        : await saveCms(
            entity,
            id,
            body.payload,
            actor.id,
            body.draft === true,
          );
    await logAuditAction(
      { userName: String(actor.email), userEmail: String(actor.email) },
      "update",
      entity,
      "Modification CMS",
      id,
    );
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return apiError(error);
  }
}
