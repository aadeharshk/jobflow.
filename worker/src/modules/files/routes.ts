import { Hono } from "hono";
import { and, desc, eq, count } from "drizzle-orm";
import type { AppEnv } from "../../types";
import { coreDb, core } from "../../db/client";
import { newId, sha256Hex } from "../../lib/crypto";
import { audit, trackEvent } from "../../lib/audit";
import { badRequest, notFound, HttpError } from "../../lib/errors";
import { looksLikePdf, sanitizeFilename } from "./validation";

export const MAX_RESUMES_PER_USER = 10;

const serialize = (f: typeof core.files.$inferSelect) => ({
  id: f.id,
  filename: f.filename,
  contentType: f.contentType,
  sizeBytes: f.sizeBytes,
  createdAt: f.createdAt,
});

export const fileRoutes = new Hono<AppEnv>()
  .get("/resumes", async (c) => {
    const user = c.get("user")!;
    const rows = await coreDb(c.env)
      .select()
      .from(core.files)
      .where(and(eq(core.files.userId, user.id), eq(core.files.kind, "resume")))
      .orderBy(desc(core.files.createdAt));
    return c.json({ resumes: rows.map(serialize) });
  })

  .post("/resumes", async (c) => {
    const user = c.get("user")!;
    const { maxResumeBytes } = c.get("config");
    const declared = Number(c.req.header("content-length") ?? 0);
    if (declared > maxResumeBytes + 64 * 1024) throw new HttpError(413, "too_large", `Résumé must be ≤ ${maxResumeBytes / 1048576} MB.`);

    const form = await c.req.formData().catch(() => null);
    const file = form?.get("file");
    if (!file || typeof file === "string") throw badRequest("Upload a PDF in the 'file' field.");
    if (file.size === 0) throw badRequest("The file is empty.");
    if (file.size > maxResumeBytes) throw new HttpError(413, "too_large", `Résumé must be ≤ ${maxResumeBytes / 1048576} MB.`);

    const bytes = new Uint8Array(await file.arrayBuffer());
    if (!looksLikePdf(bytes.subarray(0, 8))) throw new HttpError(415, "unsupported_type", "Only PDF résumés are supported.");

    const db = coreDb(c.env);
    const [{ total }] = (await db
      .select({ total: count() })
      .from(core.files)
      .where(and(eq(core.files.userId, user.id), eq(core.files.kind, "resume")))) as [{ total: number }];
    if (total >= MAX_RESUMES_PER_USER) throw badRequest(`You can keep up to ${MAX_RESUMES_PER_USER} résumés. Delete one first.`);

    const id = newId();
    const r2Key = `users/${user.id}/resumes/${id}.pdf`;
    const filename = sanitizeFilename(file.name);
    const sha256 = await sha256Hex(bytes);
    await c.env.FILES.put(r2Key, bytes, {
      httpMetadata: { contentType: "application/pdf" },
      customMetadata: { userId: user.id, fileId: id },
    });
    const [row] = await db
      .insert(core.files)
      .values({
        id,
        userId: user.id,
        kind: "resume",
        r2Key,
        filename,
        contentType: "application/pdf",
        sizeBytes: bytes.length,
        sha256,
        createdAt: Date.now(),
      })
      .returning();
    await audit(c.env.DB_CORE, {
      userId: user.id,
      action: "file.uploaded",
      target: id,
      metadata: { kind: "resume", sizeBytes: bytes.length },
    });
    await trackEvent(c.env.DB_CORE, user.id, "resume_uploaded");
    return c.json({ resume: serialize(row!) }, 201);
  })

  .get("/resumes/:id/download", async (c) => {
    const user = c.get("user")!;
    const rows = await coreDb(c.env)
      .select()
      .from(core.files)
      .where(and(eq(core.files.id, c.req.param("id")), eq(core.files.userId, user.id)))
      .limit(1);
    const file = rows[0];
    if (!file) throw notFound("Résumé");
    const object = await c.env.FILES.get(file.r2Key);
    if (!object) throw notFound("Résumé");
    return new Response(object.body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(file.filename)}`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  })

  .delete("/resumes/:id", async (c) => {
    const user = c.get("user")!;
    const db = coreDb(c.env);
    const rows = await db
      .select()
      .from(core.files)
      .where(and(eq(core.files.id, c.req.param("id")), eq(core.files.userId, user.id)))
      .limit(1);
    const file = rows[0];
    if (!file) throw notFound("Résumé");
    await c.env.FILES.delete(file.r2Key);
    await db.delete(core.files).where(eq(core.files.id, file.id));
    await audit(c.env.DB_CORE, { userId: user.id, action: "file.deleted", target: file.id });
    return c.json({ ok: true });
  });
