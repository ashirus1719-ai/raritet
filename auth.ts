import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const googleReady = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
const bootstrapAdmins = new Set(
  (process.env.ADMIN_BOOTSTRAP_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
);

async function grantBootstrapAdmin(email: string | null | undefined, id: string | undefined) {
  if (!id || !email || !bootstrapAdmins.has(email.trim().toLowerCase())) return;
  await prisma.user.updateMany({ where: { id }, data: { role: "admin" } });
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: googleReady ? [Google] : [],
  session: { strategy: "database", maxAge: 60 * 60 * 24 * 14 },
  pages: { signIn: "/admin" },
  trustHost: true,
  callbacks: {
    async signIn({ user }) {
      return Boolean(user.email);
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      await grantBootstrapAdmin(user.email, user.id);
    },
    async signIn({ user }) {
      await grantBootstrapAdmin(user.email, user.id);
    },
  },
});
