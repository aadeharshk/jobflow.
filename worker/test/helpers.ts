import { exports } from "cloudflare:workers";

export const ORIGIN = "http://localhost";
let counter = 0;
export const uniqueEmail = (prefix = "user") => `${prefix}.${Date.now()}.${++counter}@example.com`;

type Init = RequestInit & { cookie?: string; json?: unknown; origin?: string | null };

export async function api(path: string, init: Init = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  if (init.origin !== null) headers.set("Origin", init.origin ?? ORIGIN);
  if (init.cookie) headers.set("Cookie", init.cookie);
  let body = init.body;
  if (init.json !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(init.json);
  }
  return (exports as unknown as { default: Fetcher }).default.fetch(
    new Request(`${ORIGIN}${path}`, { ...init, headers, body, redirect: "manual" }),
  );
}

export function cookieFrom(res: Response, name = "jobflow_session"): string | null {
  for (const header of res.headers.getSetCookie()) {
    const [pair] = header.split(";");
    if (pair?.startsWith(`${name}=`) && pair.length > name.length + 1) return pair;
  }
  return null;
}

export async function signIn(email = uniqueEmail(), name = "Test User"): Promise<{ cookie: string; user: { id: string; email: string } }> {
  const res = await api("/api/auth/dev-login", { method: "POST", json: { email, name } });
  if (res.status !== 200) throw new Error(`dev-login failed: ${res.status} ${await res.text()}`);
  const cookie = cookieFrom(res);
  if (!cookie) throw new Error("no session cookie");
  const { user } = (await res.json()) as { user: { id: string; email: string } };
  return { cookie, user };
}

export function pdfBytes(extra = "hello"): Uint8Array {
  return new TextEncoder().encode(`%PDF-1.7\n% test résumé\n${extra}\n%%EOF\n`);
}
