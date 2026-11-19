import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { matchesOrderAccessToken, ORDER_ACCESS_COOKIE } from "@/lib/book-order-security";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!/^\d+$/.test(id)) return NextResponse.json({ error: "notFound" }, { status: 404 });
  const order = await prisma.raritetBookOrder.findUnique({
    where: { id: BigInt(id) },
    select: { id: true, orderNumber: true, accessTokenHash: true, status: true, paymentStatus: true, totalKgs: true, currency: true, reservationExpiresAt: true, items: { select: { titleSnapshot: true, quantity: true, unitPriceKgs: true, lineTotalKgs: true } } },
  });
  if (!order || !matchesOrderAccessToken(request.cookies.get(ORDER_ACCESS_COOKIE)?.value, order.accessTokenHash)) {
    return NextResponse.json({ error: "notFound" }, { status: 404 });
  }
  return NextResponse.json({ order: { ...order, id: order.id.toString(), accessTokenHash: undefined } });
}
