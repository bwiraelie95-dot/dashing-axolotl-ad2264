import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/models/prisma/client";
import { apiError } from "@/lib/http";
import { logAuditAction } from "@/models/auditModel";
export async function GET(request: Request) {
  try {
    const actor = await requirePermission(request, "donors", "export");
    const query = new URL(request.url).searchParams;
    const status = query.get("status");
    const rows = await prisma.donation.findMany({
      where: status ? { status } : undefined,
      orderBy: { donatedAt: "desc" },
      take: 10000,
    });
    const quote = (v: unknown) =>
      '"' +
      String(v ?? "")
        .replace(/^[=+@\-\t\r]/, "'")
        .replace(/"/g, '""') +
      '"';
    const csv = [
      [
        "Référence",
        "Date",
        "Montant",
        "Devise",
        "Statut",
        "Remboursement",
        "Session Stripe",
        "Payment Intent",
      ],
      ...rows.map((r) => [
        r.externalId,
        r.donatedAt.toISOString(),
        r.amount,
        r.currency,
        r.status,
        r.refundedAmount,
        r.stripeSessionId,
        r.stripePaymentIntentId,
      ]),
    ]
      .map((r) => r.map(quote).join(","))
      .join("\r\n");
    await logAuditAction(
      { userName: String(actor.email), userEmail: String(actor.email) },
      "export",
      "donors",
      `Export de ${rows.length} transactions (sans coordonnées personnelles).`,
    );
    return new NextResponse("\ufeff" + csv, {
      headers: {
        "Content-Type": "text/csv;charset=utf-8",
        "Content-Disposition": 'attachment; filename="acv-donations.csv"',
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return apiError(e);
  }
}
