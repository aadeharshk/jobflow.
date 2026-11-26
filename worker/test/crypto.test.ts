import { describe, expect, it } from "vitest";
import { envelopeDecrypt, envelopeEncrypt, newId, randomToken, sha256Hex, timingSafeEqual } from "../src/lib/crypto";

const KEK = btoa(String.fromCharCode(...new Uint8Array(32).fill(9)));
const OTHER_KEK = btoa(String.fromCharCode(...new Uint8Array(32).fill(1)));

describe("crypto helpers", () => {
  it("generates unique 256-bit URL-safe tokens", () => {
    const tokens = new Set(Array.from({ length: 200 }, randomToken));
    expect(tokens.size).toBe(200);
    for (const t of tokens) expect(t).toMatch(/^[A-Za-z0-9_-]{43}$/);
  });

  it("creates time-sortable ids", async () => {
    const a = newId();
    await new Promise((r) => setTimeout(r, 2));
    const b = newId();
    expect(a < b).toBe(true);
    expect(a).toMatch(/^[0-9a-f]{32}$/);
  });

  it("hashes with SHA-256", async () => {
    expect(await sha256Hex("abc")).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  });

  it("compares in constant time semantics", () => {
    expect(timingSafeEqual("abc", "abc")).toBe(true);
    expect(timingSafeEqual("abc", "abd")).toBe(false);
    expect(timingSafeEqual("abc", "abcd")).toBe(false);
  });
});

describe("envelope encryption", () => {
  it("round-trips a secret", async () => {
    const sealed = await envelopeEncrypt(KEK, "1//refresh-token-value", "user-1");
    expect(sealed.ciphertext).not.toContain("refresh");
    expect(await envelopeDecrypt(KEK, sealed, "user-1")).toBe("1//refresh-token-value");
  });

  it("produces different ciphertexts for the same input (random IV + data key)", async () => {
    const a = await envelopeEncrypt(KEK, "same", "u");
    const b = await envelopeEncrypt(KEK, "same", "u");
    expect(a.ciphertext).not.toBe(b.ciphertext);
    expect(a.wrappedDataKey).not.toBe(b.wrappedDataKey);
  });

  it("rejects decryption under another user's context (AAD binding)", async () => {
    const sealed = await envelopeEncrypt(KEK, "secret", "user-1");
    await expect(envelopeDecrypt(KEK, sealed, "user-2")).rejects.toThrow();
  });

  it("rejects decryption with the wrong key", async () => {
    const sealed = await envelopeEncrypt(KEK, "secret", "user-1");
    await expect(envelopeDecrypt(OTHER_KEK, sealed, "user-1")).rejects.toThrow();
  });

  it("rejects tampered ciphertext", async () => {
    const sealed = await envelopeEncrypt(KEK, "secret", "user-1");
    const flipped = sealed.ciphertext.slice(0, -2) + (sealed.ciphertext.endsWith("A") ? "B" : "A") + sealed.ciphertext.slice(-1);
    await expect(envelopeDecrypt(KEK, { ...sealed, ciphertext: flipped }, "user-1")).rejects.toThrow();
  });
});
