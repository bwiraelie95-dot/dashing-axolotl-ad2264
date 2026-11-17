import { createHash } from "node:crypto";
import { prisma } from "@/models/prisma/client";
import { getRequestIp } from "@/lib/http";
export class RateLimitError extends Error {}
export async function rateLimit(
  request: Request,
  scope: string,
  limit = 8,
  windowMs = 60000,
) {
  const now = Date.now(),
    bucket = Math.floor(now / windowMs);
  const key = createHash("sha256")
    .update(`${scope}:${getRequestIp(request) || "unknown"}:${bucket}`)
    .digest("hex");
  const row = await prisma.requestLimit.upsert({
    where: { key },
    create: { key, count: 1, expiresAt: new Date((bucket + 1) * windowMs) },
    update: { count: { increment: 1 } },
  });
  if (row.count > limit)
    throw new RateLimitError(
      "Trop de tentatives. Veuillez patienter puis réessayer.",
    );
  // Bound storage independently of in-memory serverless instances.
  if (Math.random() < 0.02)
    await prisma.requestLimit.deleteMany({
      where: { expiresAt: { lt: new Date(now) } },
    });
}
