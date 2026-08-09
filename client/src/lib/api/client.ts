import { clearTokens, getAccessToken, getRefreshToken, setAccessToken } from "@/lib/api/tokens";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3030/api/v1";

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
  formData?: FormData;
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })
      .then(async (res) => {
        if (!res.ok) return null;
        const json = await res.json();
        const accessToken = json?.data?.accessToken as string | undefined;
        if (accessToken) {
          setAccessToken(accessToken);
          return accessToken;
        }
        return null;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

async function parseResponse(res: Response) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function apiRequest<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true, formData } = options;

  async function doFetch(): Promise<Response> {
    const headers: Record<string, string> = {};
    if (!formData) headers["Content-Type"] = "application/json";

    // Attach the token whenever we have one, even on "public" endpoints —
    // several of them (feed/stories listings) personalize the response
    // (is_liked/is_saved) when the caller is authenticated.
    const token = getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;

    return fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: formData ?? (body !== undefined ? JSON.stringify(body) : undefined),
    });
  }

  let res = await doFetch();

  if (res.status === 401 && auth && getRefreshToken()) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      res = await doFetch();
    } else {
      clearTokens();
    }
  }

  const json = await parseResponse(res);

  if (!res.ok) {
    const message = json?.error?.message ?? json?.message ?? "Something went wrong. Please try again.";
    throw new ApiError(message, res.status, json?.error?.code);
  }

  return (json?.data ?? json) as T;
}

export async function apiGet<T = unknown>(path: string, auth = true): Promise<T> {
  return apiRequest<T>(path, { method: "GET", auth });
}

export async function apiPost<T = unknown>(path: string, body?: unknown, auth = true): Promise<T> {
  return apiRequest<T>(path, { method: "POST", body, auth });
}

export async function apiPut<T = unknown>(path: string, body?: unknown, auth = true): Promise<T> {
  return apiRequest<T>(path, { method: "PUT", body, auth });
}

export async function apiDelete<T = unknown>(path: string, auth = true): Promise<T> {
  return apiRequest<T>(path, { method: "DELETE", auth });
}

export async function apiUpload<T = unknown>(path: string, formData: FormData, auth = true): Promise<T> {
  return apiRequest<T>(path, { method: "POST", formData, auth });
}
