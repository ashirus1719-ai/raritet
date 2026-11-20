import NextAuth, { CredentialsSignin } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { hashPassword, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, verifyPassword } from "@/lib/password";

const googleReady = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

// Tolerates quotes, spaces, semicolons and new lines around the addresses in the env value.
const bootstrapAdmins = new Set(
  (process.env.ADMIN_BOOTSTRAP_EMAILS ?? "")
    .split(/[,;\s]+/)
    .map((email) => email.replace(/^["']+|["']+$/g, "").trim().toLowerCase())
    .filter(Boolean),
);

class InvalidLogin extends CredentialsSignin { code = "invalid"; }
class EmailTaken extends CredentialsSignin { code = "email_taken"; }
class UseGoogle extends CredentialsSignin { code = "use_google"; }
class InvalidInput extends CredentialsSignin { code = "invalid_input"; }

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

async function authorizeWithPassword(input: Partial<Record<string, unknown>>) {
  const email = text(input.email).toLowerCase();
  const password = typeof input.password === "string" ? input.password : "";
  const name = text(input.name);
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254 || password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) throw new InvalidInput();

  const existing = await prisma.user.findFirst({ where: { email: { equals: email, mode: "insensitive" } } });

  if (input.mode === "register") {
    if (name.length < 2 || name.length > 100) throw new InvalidInput();
    if (existing) throw new EmailTaken();
    // Password accounts are never bootstrapped to admin: the address is not verified.
    const user = await prisma.user.create({ data: { email, name, passwordHash: await hashPassword(password), role: "user" } });
    return { id: user.id, name: user.name, email: user.email, image: user.image, role: user.role };
  }

  if (!existing) throw new InvalidLogin();
  if (!existing.passwordHash) throw new UseGoogle();
  if (!(await verifyPassword(password, existing.passwordHash))) throw new InvalidLogin();
  return { id: existing.id, name: existing.name, email: existing.email, image: existing.image, role: existing.role };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google proves ownership of the address, so it may join an account first created with a password (see linkAccount).
    ...(googleReady ? [Google({ allowDangerousEmailAccountLinking: true })] : []),
    Credentials({
      id: "credentials",
      credentials: { email: {}, password: {}, name: {}, mode: {} },
      authorize: authorizeWithPassword,
    }),
  ],
  // Credentials sign-in requires JWT sessions; the role is still re-read from the database on every request below.
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 14 },
  pages: { signIn: "/login", error: "/login" },
  trustHost: true,
  callbacks: {
    async signIn({ user }) {
      return Boolean(user.email);
    },
    async jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      if (!token.sub) return null;
      const dbUser = await prisma.user.findUnique({
        where: { id: token.sub },
        select: { name: true, email: true, image: true, role: true, accounts: { where: { provider: "google" }, select: { id: true }, take: 1 } },
      });
      if (!dbUser) return null;
      let role = dbUser.role;
      if (role !== "admin" && dbUser.accounts.length > 0 && dbUser.email && bootstrapAdmins.has(dbUser.email.toLowerCase())) {
        await prisma.user.update({ where: { id: token.sub }, data: { role: "admin" } });
        role = "admin";
      }
      token.role = role;
      token.name = dbUser.name;
      token.email = dbUser.email;
      token.picture = dbUser.image;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = typeof token.role === "string" ? token.role : "user";
        session.user.name = token.name ?? null;
        session.user.email = token.email ?? "";
        session.user.image = token.picture ?? null;
      }
      return session;
    },
  },
  events: {
    async linkAccount({ user, account }) {
      // Someone may have registered this address with a password without owning it; Google sign-in proves ownership, so drop that password.
      if (account.provider === "google" && user.id) await prisma.user.update({ where: { id: user.id }, data: { passwordHash: null } });
    },
  },
});
