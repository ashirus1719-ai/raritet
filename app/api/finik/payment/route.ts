import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { matchesOrderAccessToken, ORDER_ACCESS_COOKIE } from "@/lib/book-order-security";
import { createFinikPayment, newFinikPaymentId } from "@/lib/finik";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const orderId = body && typeof body === "object" ? (body as { orderId?: unknown }).orderId : undefined;
    if (typeof orderId !== "string" || !/^\d+$/.test(orderId)) return NextResponse.json({ error: "required" }, { status: 400 });
    const order = await prisma.raritetBookOrder.findUnique({ where: { id: BigInt(orderId) } });
    if (!order || !matchesOrderAccessToken(request.cookies.get(ORDER_ACCESS_COOKIE)?.value, order.accessTokenHash)) {
      return NextResponse.json({ error: "notFound" }, { status: 404 });
    }
    if (order.paymentStatus === "paid") return NextResponse.json({ paid: true });
    if (order.paymentStatus !== "pending" || order.status !== "pending_payment" || order.reservationExpiresAt <= new Date()) {
      return NextResponse.json({ error: "paymentUnavailable" }, { status: 409 });
    }
    if (order.currency !== "KGS") return NextResponse.json({ error: "invalidCurrency" }, { status: 400 });
    // Stock is only written off after payment, so re-check it before sending the buyer to pay.
    const items = await prisma.raritetBookOrderItem.findMany({ where: { orderId: order.id }, select: { titleSnapshot: true, quantity: true, book: { select: { stock: true, isPublished: true } } } });
    const unavailable = items.filter((item) => !item.book || !item.book.isPublished || (item.book.stock !== null && item.book.stock < item.quantity));
    if (unavailable.length) return NextResponse.json({ error: "outOfStock", titles: unavailable.map((item) => item.titleSnapshot) }, { status: 409 });
    if (order.paymentUrl) return NextResponse.json({ paymentUrl: order.paymentUrl });

    let paymentId = order.paymentId;
    if (!paymentId) {
      const candidate = newFinikPaymentId();
      const claimed = await prisma.raritetBookOrder.updateMany({
        where: { id: order.id, paymentStatus: "pending", paymentId: null },
        data: { paymentId: candidate },
      });
      paymentId = claimed.count ? candidate : (await prisma.raritetBookOrder.findUnique({ where: { id: order.id }, select: { paymentId: true } }))?.paymentId ?? null;
    }
    if (!paymentId) return NextResponse.json({ error: "paymentUnavailable" }, { status: 409 });

    const paymentUrl = await createFinikPayment({ amount: order.totalKgs, paymentId, orderId: order.id.toString() });
    await prisma.raritetBookOrder.updateMany({
      where: { id: order.id, paymentStatus: "pending", paymentId },
      data: { paymentUrl },
    });
    return NextResponse.json({ paymentUrl });
  } catch (error) {
    console.error("[RARITET_FINIK_PAYMENT]", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "paymentFailed" }, { status: 502 });
  }
}
