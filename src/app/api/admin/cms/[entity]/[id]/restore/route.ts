import { NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/auth";
import { apiError } from "@/lib/http";
import { prisma } from "@/models/prisma/client";
import { contentModel } from "@/models/contentModel";
import { logAuditAction } from "@/models/auditModel";
export async function POST(
  request: Request,
  { params }: { params: Promise<{ entity: string; id: string }> },
) {
  try {
    const p = await params;
    const entity = z.enum(["articles", "programs", "team"]).parse(p.entity);
    const actor = await requirePermission(request, entity, "update");
    const data = await prisma.$transaction(async (tx) => {
      const item = await contentModel.restore(entity, p.id);
      await tx.contentRevision.create({
        data: {
          entity,
          recordId: p.id,
          payload: JSON.parse(JSON.stringify(item)),
          authorId: actor.id,
          action: "restore",
        },
      });
      await logAuditAction(
        { userEmail: actor.email, userName: actor.name },
        "update",
        entity,
        "Restauration hors publication",
        p.id,
      );
      return item;
    });
    return NextResponse.json({ success: true, data });
  } catch (e) {
    return apiError(e);
  }
}
