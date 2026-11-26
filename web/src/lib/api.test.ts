import { describe, expect, it, vi } from "vitest";
import { api, ApiError, formatBytes } from "./api";

describe("api client", () => {
  it("sends JSON with same-origin credentials", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json" } }));
    await expect(api("/api/x", { method: "POST", json: { a: 1 } })).resolves.toEqual({ ok: true });
    const [, init] = fetchMock.mock.calls[0]!;
    expect(init?.credentials).toBe("same-origin");
    expect(new Headers(init?.headers).get("content-type")).toBe("application/json");
    expect(init?.body).toBe('{"a":1}');
  });

  it("raises typed errors from the API error envelope", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: { code: "rate_limited", message: "Slow down" } }), {
        status: 429,
        headers: { "content-type": "application/json" },
      }),
    );
    const err = await api("/api/x").catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toMatchObject({ status: 429, code: "rate_limited", message: "Slow down" });
  });

  it("formats sizes", () => {
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(2048)).toBe("2 KB");
    expect(formatBytes(3 * 1048576)).toBe("3.0 MB");
  });
});

describe("describeDevice", () => {
  it("summarises common user agents", async () => {
    const { describeDevice } = await import("./api");
    expect(describeDevice("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0 Safari/537.36")).toBe(
      "Chrome on Linux",
    );
    expect(
      describeDevice("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1"),
    ).toBe("Safari on iOS");
    expect(describeDevice(null)).toBe("Unknown device");
  });
});
