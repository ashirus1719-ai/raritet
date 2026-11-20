import { getAdminUser } from "@/lib/admin-auth";
import { isOwner, OWNER_USER_ID } from "@/lib/owner";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  const users = await prisma.user.findMany({
    where: q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] } : {},
    orderBy: { createdAt: "desc" },
    take: 100,
    select: { id: true, name: true, email: true, image: true, role: true, createdAt: true },
  });
  return Response.json({
    users: users.map((user) => ({ ...user, isOwner: user.id === OWNER_USER_ID })),
    canManageRoles: isOwner(admin.id),
  }, { headers: { "Cache-Control": "no-store" } });
}

/** Only the site owner may grant or revoke admin rights, and the owner's own rights cannot be changed. */
export async function PATCH(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!isOwner(admin.id)) return Response.json({ error: "Выдавать и снимать права администратора может только владелец сайта" }, { status: 403 });
  try {
    const body = await request.json();
    if (typeof body.userId !== "string" || !["admin", "user"].includes(body.role)) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }
    if (isOwner(body.userId)) return Response.json({ error: "Права владельца изменить нельзя" }, { status: 400 });
    const target = await prisma.user.findUnique({ where: { id: body.userId }, select: { id: true } });
    if (!target) return Response.json({ error: "Пользователь не найден" }, { status: 404 });
    const user = await prisma.user.update({ where: { id: body.userId }, data: { role: body.role }, select: { id: true, name: true, email: true, role: true } });
    return Response.json({ user });
  } catch {
    return Response.json({ error: "Не удалось изменить права пользователя" }, { status: 500 });
  }
}
