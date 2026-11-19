import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export const ORDER_ACCESS_COOKIE = "raritet-order-access";

export function createOrderAccessToken() {
  return randomBytes(32).toString("base64url");
}

export function hashOrderAccessToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function matchesOrderAccessToken(token: string | undefined, hash: string) {
  if (!token) return false;
  const actual = Buffer.from(hashOrderAccessToken(token), "hex");
  const expected = Buffer.from(hash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
