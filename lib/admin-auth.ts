// Простая проверка пароля для админ-панели
// В production следует использовать более надежную аутентификацию

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "raritet2024";

export function checkAdminAuth(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function isValidSession(sessionToken: string | null): boolean {
  if (!sessionToken) return false;
  // Простая проверка токена (в production использовать JWT или session store)
  return sessionToken === Buffer.from(ADMIN_PASSWORD).toString("base64");
}

export function createSessionToken(password: string): string | null {
  if (checkAdminAuth(password)) {
    return Buffer.from(password).toString("base64");
  }
  return null;
}
