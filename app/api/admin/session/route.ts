import { createSessionToken, isValidSession } from "@/lib/admin-auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    const token = createSessionToken(password);
    
    if (!token) {
      return Response.json({ error: "Invalid password" }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 дней
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("[ADMIN_SESSION]", error);
    return Response.json({ error: "Failed to authenticate" }, { status: 500 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  
  return Response.json({ authenticated: isValidSession(session ?? null) });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  
  return Response.json({ success: true });
}
