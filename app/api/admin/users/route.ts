import { getAdminUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  if (!(await getAdminUser())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  const users = await prisma.user.findMany({
    where: q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] } : {},
    orderBy: { createdAt: "desc" },
    take: 100,
    select: { id: true, name: true, email: true, image: true, role: true, createdAt: true },
  });
  return Response.json({ users }, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    if (typeof body.userId !== "string" || !["admin", "user"].includes(body.role)) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }
    if (body.userId === admin.id && body.role !== "admin") {
      return Response.json({ error: "Нельзя снять права администратора с самого себя" }, { status: 400 });
    }
    const target = await prisma.user.findUnique({ where: { id: body.userId }, select: { id: true, role: true } });
    if (!target) return Response.json({ error: "Пользователь не найден" }, { status: 404 });
    const user = await prisma.$transaction(async (tx) => {
      if (target.role === "admin" && body.role !== "admin") {
        const adminCount = await tx.user.count({ where: { role: "admin" } });
        if (adminCount <= 1) throw new Error("LAST_ADMIN");
      }
      return tx.user.update({ where: { id: body.userId }, data: { role: body.role }, select: { id: true, name: true, email: true, role: true } });
    }, { isolationLevel: "Serializable" });
    return Response.json({ user });
  } catch (error) {
    if (error instanceof Error && error.message === "LAST_ADMIN") return Response.json({ error: "Нельзя удалить последнего администратора" }, { status: 409 });
    return Response.json({ error: "Не удалось изменить права пользователя" }, { status: 500 });
  }
}
