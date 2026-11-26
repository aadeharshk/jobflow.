import { describe, expect, it } from "vitest";
import { env } from "cloudflare:workers";
import { api, pdfBytes, signIn } from "./helpers";
import { sanitizeFilename } from "../src/modules/files/validation";

function upload(cookie: string, bytes: Uint8Array, name = "Harsh CV.pdf", type = "application/pdf") {
  const form = new FormData();
  form.append("file", new File([bytes], name, { type }));
  return api("/api/files/resumes", { method: "POST", cookie, body: form });
}

describe("résumé storage (R2)", () => {
  it("uploads, lists, downloads and deletes a PDF", async () => {
    const { cookie, user } = await signIn();
    const res = await upload(cookie, pdfBytes());
    expect(res.status).toBe(201);
    const { resume } = (await res.json()) as { resume: { id: string; filename: string; sizeBytes: number } };
    expect(resume.filename).toBe("Harsh CV.pdf");

    const object = await env.FILES.get(`users/${user.id}/resumes/${resume.id}.pdf`);
    expect(object).not.toBeNull();
    await object?.arrayBuffer();

    const list = (await (await api("/api/files/resumes", { cookie })).json()) as { resumes: { id: string }[] };
    expect(list.resumes.map((r) => r.id)).toContain(resume.id);

    const dl = await api(`/api/files/resumes/${resume.id}/download`, { cookie });
    expect(dl.status).toBe(200);
    expect(dl.headers.get("content-type")).toBe("application/pdf");
    expect(dl.headers.get("cache-control")).toContain("no-store");
    expect(new Uint8Array(await dl.arrayBuffer())).toEqual(pdfBytes());

    expect((await api(`/api/files/resumes/${resume.id}`, { method: "DELETE", cookie })).status).toBe(200);
    expect(await env.FILES.head(`users/${user.id}/resumes/${resume.id}.pdf`)).toBeNull();
  });

  it("rejects non-PDF content even if labelled as PDF", async () => {
    const { cookie } = await signIn();
    const res = await upload(cookie, new TextEncoder().encode("<script>alert(1)</script>"), "cv.pdf");
    expect(res.status).toBe(415);
  });

  it("rejects files above the size limit", async () => {
    const { cookie } = await signIn();
    const big = new Uint8Array(1_048_576 + 10);
    big.set(pdfBytes().subarray(0, 8));
    const res = await upload(cookie, big);
    expect(res.status).toBe(413);
  });

  it("isolates users: no access to another user's résumé", async () => {
    const alice = await signIn();
    const bob = await signIn();
    const { resume } = (await (await upload(alice.cookie, pdfBytes())).json()) as { resume: { id: string } };
    expect((await api(`/api/files/resumes/${resume.id}/download`, { cookie: bob.cookie })).status).toBe(404);
    expect((await api(`/api/files/resumes/${resume.id}`, { method: "DELETE", cookie: bob.cookie })).status).toBe(404);
    expect((await api(`/api/files/resumes/${resume.id}/download`, { cookie: alice.cookie })).status).toBe(200);
  });

  it("requires a session", async () => {
    expect((await api("/api/files/resumes")).status).toBe(401);
  });

  it("sanitises filenames", () => {
    expect(sanitizeFilename("../../etc/passwd")).toBe("passwd.pdf");
    expect(sanitizeFilename('my "cv"<x>.pdf')).toBe("my cvx.pdf");
    expect(sanitizeFilename("")).toBe("resume.pdf");
    expect(sanitizeFilename("cv\u0000\u001f\u007f.pdf")).toBe("cv.pdf");
  });
});
