const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5050/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
  }
}

let csrfToken: string | null = null;

export function clearCsrfToken() {
  csrfToken = null;
}

async function getCsrfToken(): Promise<string | null> {
  if (csrfToken) return csrfToken;
  try {
    const res = await fetch(`${API_URL}/auth/csrf`, { credentials: "include" });
    if (!res.ok) return null;
    const data = (await res.json()) as { token?: string };
    csrfToken = data.token ?? null;
  } catch {
    csrfToken = null;
  }
  return csrfToken;
}

function safeParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

export async function apiRequest<T = void>(
  path: string,
  options: { method?: "GET" | "POST"; body?: unknown } = {},
): Promise<T> {
  const method = options.method ?? "GET";
  const headers: Record<string, string> = {};
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (method !== "GET") {
    const token = await getCsrfToken();
    if (token) headers["X-XSRF-TOKEN"] = token;
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      credentials: "include",
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError("Unable to reach the server. Please try again.", 0);
  }

  const text = await res.text();
  const data = text ? safeParse(text) : undefined;

  if (!res.ok) {
    const first = (data as { errors?: { code?: string; message?: string }[] } | undefined)?.errors?.[0];
    throw new ApiError(first?.message ?? "Something went wrong. Please try again.", res.status, first?.code);
  }
  return data as T;
}
