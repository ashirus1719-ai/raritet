import { createHmac, timingSafeEqual } from "node:crypto";

// Пароль берётся только из переменной окружения ADMIN_PASSWORD (.env.local).
// Если она не задана, вход закрыт.
function getPassword(): string | null {
  return process.env.ADMIN_PASSWORD || null;
}

function sign(password: string): string {
  return createHmac("sha256", password).update("raritet-admin-session").digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function checkAdminAuth(password: string): boolean {
  const expected = getPassword();
  return !!expected && typeof password === "string" && safeEqual(password, expected);
}

export function isValidSession(sessionToken: string | null): boolean {
  const expected = getPassword();
  if (!expected || !sessionToken) return false;
  return safeEqual(sessionToken, sign(expected));
}

export function createSessionToken(password: string): string | null {
  return checkAdminAuth(password) ? sign(getPassword()!) : null;
}
