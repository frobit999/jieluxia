import type { D1Database } from "@cloudflare/workers-types";

// ── Password Hashing (PBKDF2) ──

export async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    key,
    256
  );
  const toHex = (a: Uint8Array) =>
    [...a].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${toHex(salt)}:${toHex(new Uint8Array(bits))}`;
}

export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(":");
  const salt = new Uint8Array(
    saltHex.match(/.{2}/g)!.map((b) => parseInt(b, 16))
  );
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    key,
    256
  );
  return (
    [...new Uint8Array(bits)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("") === hashHex
  );
}

// ── JWT ──

function b64url(data: Uint8Array | string): string {
  const str = typeof data === "string" ? data : String.fromCharCode(...data);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(s: string): Uint8Array {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return new Uint8Array([...atob(s)].map((c) => c.charCodeAt(0)));
}

export async function signToken(
  userId: string,
  secret: string
): Promise<string> {
  const h = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const p = b64url(
    JSON.stringify({
      sub: userId,
      iat: (Date.now() / 1000) | 0,
      exp: Date.now() / 1000 + 2592000,
    })
  );
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(`${h}.${p}`)
  );
  return `${h}.${p}.${b64url(new Uint8Array(sig))}`;
}

export async function verifyToken(
  token: string,
  secret: string
): Promise<string | null> {
  try {
    const [h, p, s] = token.split(".");
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      b64urlDecode(s) as unknown as ArrayBuffer,
      enc.encode(`${h}.${p}`)
    );
    if (!ok) return null;
    const d = JSON.parse(new TextDecoder().decode(b64urlDecode(p)));
    return d.exp > Date.now() / 1000 ? d.sub : null;
  } catch {
    return null;
  }
}

// ── Helpers ──

export function genId(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 21);
}

export async function getUser(
  db: D1Database,
  req: Request,
  secret: string
): Promise<Record<string, unknown> | null> {
  const cookie = req.headers.get("Cookie") || "";
  const m = cookie.match(/token=([^;]+)/);
  if (!m) return null;
  const userId = await verifyToken(m[1], secret);
  if (!userId) return null;
  return await db
    .prepare("SELECT * FROM users WHERE id=?")
    .bind(userId)
    .first();
}
