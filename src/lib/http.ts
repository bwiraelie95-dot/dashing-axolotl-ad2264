import { NextResponse } from "next/server";
import { RateLimitError } from "@/lib/rate-limit";
import { ZodError } from "zod";
import { ForbiddenError, UnauthorizedError } from "@/lib/auth";

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export class MethodNotAllowedError extends Error {
  constructor(
    message = "Cette opération n’est pas autorisée pour cette ressource.",
  ) {
    super(message);
    this.name = "MethodNotAllowedError";
  }
}

export function apiError(error: unknown) {
  if (error instanceof RateLimitError)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Données invalides : " +
          error.issues
            .map((i) => `${i.path.join(".")} ${i.message}`)
            .slice(0, 3)
            .join(" ; "),
        details: error.flatten(),
      },
      { status: 400 },
    );
  }
  if (error instanceof UnauthorizedError) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 401 },
    );
  }
  if (error instanceof ForbiddenError) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 403 },
    );
  }
  if (error instanceof ConflictError) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 409 },
    );
  }
  if (error instanceof MethodNotAllowedError) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 405 },
    );
  }
  if (error instanceof Error && "code" in error && error.code === "P2002") {
    return NextResponse.json(
      { success: false, error: "Cette valeur existe déjà." },
      { status: 409 },
    );
  }

  if (error instanceof Error && "code" in error && error.code === "P2025")
    return NextResponse.json(
      { success: false, error: "Contenu introuvable." },
      { status: 404 },
    );
  if (error instanceof Error && "code" in error && error.code === "P2034")
    return NextResponse.json(
      {
        success: false,
        error: "Modification concurrente. Veuillez réessayer.",
      },
      { status: 409 },
    );
  console.error("[ACV API]", error);
  return NextResponse.json(
    { success: false, error: "Une erreur interne est survenue." },
    { status: 500 },
  );
}

export function getRequestIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    undefined
  );
}
