import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { isValidSession } from "@/lib/admin-auth";
import { CONTENT_KEYS, getContent, setContent, type ContentKey } from "@/lib/site-content";

async function authorized() {
  const cookieStore = await cookies();
  return isValidSession(cookieStore.get("admin_session")?.value ?? null);
}

export async function GET() {
  if (!(await authorized())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const entries = await Promise.all(CONTENT_KEYS.map(async (k) => [k, await getContent(k)] as const));
  return Response.json(Object.fromEntries(entries), { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: Request) {
  if (!(await authorized())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { key, value } = await request.json();
    if (!CONTENT_KEYS.includes(key as ContentKey) || typeof value !== "object" || value === null) {
      return Response.json({ error: "Bad request" }, { status: 400 });
    }
    await setContent(key, value);
    revalidatePath("/", "layout");
    return Response.json({ success: true });
  } catch (error) {
    console.error("[ADMIN_CONTENT_PUT]", error);
    return Response.json({ error: "Failed to save" }, { status: 500 });
  }
}
