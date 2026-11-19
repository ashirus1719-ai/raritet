import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

export async function GET() {
  if (!(await getAdminUser())) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const orders = await prisma.raritetBookOrder.findMany({
      where: { paymentStatus: "paid", status: "paid" },
      orderBy: { updatedAt: "desc" },
      take: 100,
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        customerPhone: true,
        customerEmail: true,
        pickupLocation: true,
        note: true,
        totalKgs: true,
        currency: true,
        updatedAt: true,
        items: { select: { titleSnapshot: true, quantity: true, lineTotalKgs: true } },
      },
    });
    return Response.json({ orders: orders.map((order) => ({ ...order, id: order.id.toString() })) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[ADMIN_PAID_ORDERS]", error instanceof Error ? error.message : "Unknown error");
    return Response.json({ error: "Failed to load orders" }, { status: 500 });
  }
}
