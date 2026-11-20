import { prisma } from "@/lib/prisma";

// Password guessing protection: after MAX_FAILURES wrong passwords within WINDOW_MS,
// password sign-in for that email is locked for LOCK_MS. Google sign-in is unaffected.
const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;
const LOCK_MS = 15 * 60 * 1000;

export async function checkLoginAllowed(email: string) {
  const attempt = await prisma.loginAttempt.findUnique({ where: { key: email } });
  return !attempt?.lockedUntil || attempt.lockedUntil <= new Date();
}

export async function recordLoginFailure(email: string) {
  const now = new Date();
  const attempt = await prisma.loginAttempt.findUnique({ where: { key: email } });
  const windowExpired = !attempt || now.getTime() - attempt.firstFailureAt.getTime() > WINDOW_MS;
  const failures = windowExpired ? 1 : attempt.failures + 1;
  const data = {
    failures,
    firstFailureAt: windowExpired ? now : attempt.firstFailureAt,
    lockedUntil: failures >= MAX_FAILURES ? new Date(now.getTime() + LOCK_MS) : null,
  };
  await prisma.loginAttempt.upsert({ where: { key: email }, create: { key: email, ...data }, update: data });
}

export async function clearLoginFailures(email: string) {
  await prisma.loginAttempt.deleteMany({ where: { key: email } });
}
