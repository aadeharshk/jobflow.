/**
 * Web Crypto helpers. No Node.js dependencies — runs natively on Workers.
 */
const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

export function toHex(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  return Array.from(view, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function fromBase64(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(normalized + "=".repeat((4 - (normalized.length % 4)) % 4));
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

/** 256-bit URL-safe random token (sessions, CSRF state). */
export function randomToken(): string {
  return toBase64Url(randomBytes(32));
}

/** Time-sortable unique ID (UUIDv7-style prefix + randomness). */
export function newId(): string {
  const time = Date.now().toString(16).padStart(12, "0");
  return `${time}${toHex(randomBytes(10))}`;
}

export async function sha256Hex(value: string | Uint8Array): Promise<string> {
  const data = typeof value === "string" ? encoder.encode(value) : value;
  return toHex(await crypto.subtle.digest("SHA-256", data));
}

/** Constant-time string comparison for secrets of equal expected length. */
export function timingSafeEqual(a: string, b: string): boolean {
  const ab = encoder.encode(a);
  const bb = encoder.encode(b);
  if (ab.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < ab.length; i++) diff |= ab[i]! ^ bb[i]!;
  return diff === 0;
}

// ---------------------------------------------------------------------------
// Envelope encryption for OAuth tokens (used from Phase 6, tested now).
// plaintext --AES-256-GCM(dataKey)--> ciphertext
// dataKey   --AES-256-GCM(KEK)------> wrappedDataKey     (KEK = TOKEN_ENCRYPTION_KEY secret)
// Stored format for both: base64url(iv[12] || ciphertext+tag)
// ---------------------------------------------------------------------------

async function importAesKey(raw: Uint8Array): Promise<CryptoKey> {
  if (raw.length !== 32) throw new Error("AES key must be 32 bytes");
  return crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

async function aesEncrypt(key: CryptoKey, plaintext: Uint8Array, aad: Uint8Array): Promise<string> {
  const iv = randomBytes(12);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: aad }, key, plaintext));
  const out = new Uint8Array(iv.length + ct.length);
  out.set(iv);
  out.set(ct, iv.length);
  return toBase64Url(out);
}

async function aesDecrypt(key: CryptoKey, payload: string, aad: Uint8Array): Promise<Uint8Array> {
  const bytes = fromBase64(payload);
  if (bytes.length < 12 + 16) throw new Error("ciphertext too short");
  const iv = bytes.slice(0, 12);
  const ct = bytes.slice(12);
  return new Uint8Array(await crypto.subtle.decrypt({ name: "AES-GCM", iv, additionalData: aad }, key, ct));
}

export interface EnvelopeCiphertext {
  ciphertext: string;
  wrappedDataKey: string;
}

/**
 * Encrypts a secret for a specific user. `context` (e.g. the user ID) is bound as
 * additional authenticated data, so ciphertext cannot be swapped between users.
 */
export async function envelopeEncrypt(kekBase64: string, plaintext: string, context: string): Promise<EnvelopeCiphertext> {
  const kek = await importAesKey(fromBase64(kekBase64));
  const dataKeyRaw = randomBytes(32);
  const dataKey = await importAesKey(dataKeyRaw);
  const aad = encoder.encode(context);
  const ciphertext = await aesEncrypt(dataKey, encoder.encode(plaintext), aad);
  const wrappedDataKey = await aesEncrypt(kek, dataKeyRaw, aad);
  dataKeyRaw.fill(0);
  return { ciphertext, wrappedDataKey };
}

export async function envelopeDecrypt(kekBase64: string, value: EnvelopeCiphertext, context: string): Promise<string> {
  const kek = await importAesKey(fromBase64(kekBase64));
  const aad = encoder.encode(context);
  const dataKeyRaw = await aesDecrypt(kek, value.wrappedDataKey, aad);
  const dataKey = await importAesKey(dataKeyRaw);
  dataKeyRaw.fill(0);
  return decoder.decode(await aesDecrypt(dataKey, value.ciphertext, aad));
}
