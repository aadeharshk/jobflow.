/** Résumé upload validation. Content is checked by magic bytes, never trusted from the client. */
export const ALLOWED_RESUME_TYPES = {
  "application/pdf": { ext: "pdf", magic: [0x25, 0x50, 0x44, 0x46, 0x2d] }, // %PDF-
} as const;

export function looksLikePdf(head: Uint8Array): boolean {
  const magic = ALLOWED_RESUME_TYPES["application/pdf"].magic;
  return magic.every((b, i) => head[i] === b);
}

/** Keeps a human-readable filename while removing path separators and control characters. */
export function sanitizeFilename(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? "resume.pdf";
  const withoutControls = Array.from(base)
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return code >= 0x20 && code !== 0x7f;
    })
    .join("");
  const cleaned = withoutControls
    .replace(/["<>|:*?]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
  if (!cleaned) return "resume.pdf";
  return cleaned.toLowerCase().endsWith(".pdf") ? cleaned : `${cleaned}.pdf`;
}
