import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  const isAdmin = session?.user?.role === "admin";
  return Response.json({
    authenticated: isAdmin,
    isAdmin,
    googleConfigured: Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET),
    user: isAdmin ? { id: session.user.id, name: session.user.name, email: session.user.email } : null,
  }, { headers: { "Cache-Control": "no-store" } });
}
