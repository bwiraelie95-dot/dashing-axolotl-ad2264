export const SESSION_KEY = "acv.admin.token";
export class AdminApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
export interface AdminSession {
  id: string;
  name: string;
  email: string;
  role: string;
}
export interface ApiResult<T> {
  success: boolean;
  data: T;
  total?: number;
  token?: string;
  user?: AdminSession;
}
export async function adminRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResult<T>> {
  const headers = new Headers(options.headers);
  const token = sessionStorage.getItem(SESSION_KEY);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !(options.body instanceof FormData))
    headers.set("Content-Type", "application/json");
  let response: Response;
  try {
    response = await fetch(`/api/admin/${path}`, {
      ...options,
      headers,
      cache: "no-store",
      signal: options.signal ?? AbortSignal.timeout(20000),
    });
  } catch (error) {
    if (options.signal?.aborted) throw error;
    throw new AdminApiError(
      "Le serveur est inaccessible. Veuillez réessayer.",
      0,
    );
  }
  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.success)
    throw new AdminApiError(
      body?.error ?? "Réponse du serveur invalide.",
      response.status,
    );
  return body;
}
