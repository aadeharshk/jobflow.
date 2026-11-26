/** Typed same-origin API client. Cookies carry the session; no tokens in JS. */
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function api<T>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const headers = new Headers(init.headers);
  let body = init.body;
  if (init.json !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(init.json);
  }
  const res = await fetch(path, { ...init, body, headers, credentials: "same-origin" });
  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : null;
  if (!res.ok) {
    const err = (data as { error?: { code?: string; message?: string } } | null)?.error;
    throw new ApiError(res.status, err?.code ?? "http_error", err?.message ?? `Request failed (${res.status})`);
  }
  return data as T;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: "user" | "admin";
  country: string | null;
  timezone: string | null;
  createdAt: number;
}

export interface Resume {
  id: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
  createdAt: number;
}

export interface AutomationStatus {
  settings: { paused: boolean; followupsEnabled: boolean; dailyCap: number };
  sending: { paused: boolean; dailyCap: number; sentInWindow: number; remaining: number; nextSlotAt: number | null };
  platformDailyCap: number;
}

export interface SessionRow {
  id: string;
  current: boolean;
  createdAt: number;
  lastSeenAt: number;
  userAgent: string | null;
  country: string | null;
}

export const formatBytes = (n: number) =>
  n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(0)} KB` : `${(n / 1048576).toFixed(1)} MB`;
export const formatDate = (ms: number) => new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(ms);

/** Human-friendly device label from a User-Agent string (best effort, no external library). */
export function describeDevice(ua: string | null): string {
  if (!ua) return "Unknown device";
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /OPR\//.test(ua)
      ? "Opera"
      : /Firefox\//.test(ua)
        ? "Firefox"
        : /Chrome\//.test(ua)
          ? "Chrome"
          : /Safari\//.test(ua)
            ? "Safari"
            : "Browser";
  const os = /Android/.test(ua)
    ? "Android"
    : /iPhone|iPad/.test(ua)
      ? "iOS"
      : /Windows/.test(ua)
        ? "Windows"
        : /Mac OS X/.test(ua)
          ? "macOS"
          : /Linux/.test(ua)
            ? "Linux"
            : "Unknown OS";
  return `${browser} on ${os}`;
}
