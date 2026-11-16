import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { apiError } from "@/lib/http";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    return NextResponse.json(
      { success: true, data: user },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return apiError(error);
  }
}
