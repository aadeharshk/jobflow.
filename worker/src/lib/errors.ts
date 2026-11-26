import type { ContentfulStatusCode } from "hono/utils/http-status";

/** Errors safe to show to API clients. Anything else becomes a generic 500. */
export class HttpError extends Error {
  constructor(
    public readonly status: ContentfulStatusCode,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export const unauthorized = () => new HttpError(401, "unauthorized", "Sign in required.");
export const forbidden = (msg = "Not allowed.") => new HttpError(403, "forbidden", msg);
export const notFound = (what = "Resource") => new HttpError(404, "not_found", `${what} not found.`);
export const badRequest = (msg: string, details?: unknown) => new HttpError(400, "bad_request", msg, details);
export const tooManyRequests = () => new HttpError(429, "rate_limited", "Too many requests. Please slow down.");
