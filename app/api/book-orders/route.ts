import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createOrderAccessToken, hashOrderAccessToken, ORDER_ACCESS_COOKIE } from "@/lib/book-order-security";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const input: unknown = await request.json();
    if (!input || typeof input !== "object") return NextResponse.json({ error: "invalidRequest" }, { status: 400 });
    const data = input as Record<string, unknown>;
    const slug = typeof data.slug === "string" ? data.slug.trim() : "";
    const quantity = Number(data.quantity);
    const customerName = typeof data.customerName === "string" ? data.customerName.trim() : "";
    const customerPhone = typeof data.customerPhone === "string" ? data.customerPhone.trim() : "";
    const customerEmail = typeof data.customerEmail === "string" ? data.customerEmail.trim() : "";
    const note = typeof data.note === "string" ? data.note.trim() : "";

    if (!slug || !Number.isInteger(quantity) || quantity < 1 || quantity > 10 || customerName.length < 2 || customerName.length > 100 ||
      customerPhone.length < 7 || customerPhone.length > 30 || (customerEmail && (customerEmail.length > 254 || !/^\S+@\S+\.\S+$/.test(customerEmail))) || note.length > 500) {
      return NextResponse.json({ error: "invalidOrder" }, { status: 400 });
    }

    const book = await prisma.raritetBook.findFirst({ where: { slug, isPublished: true } });
    if (!book) return NextResponse.json({ error: "bookNotFound" }, { status: 404 });
    if (!Number.isSafeInteger(book.priceKgs) || book.priceKgs <= 0) return NextResponse.json({ error: "invalidPrice" }, { status: 400 });
    if (book.stock !== null && book.stock < quantity) return NextResponse.json({ error: "outOfStock" }, { status: 409 });

    const accessToken = createOrderAccessToken();
    const orderNumber = `R-${Date.now().toString(36).toUpperCase()}-${randomBytes(3).toString("hex").toUpperCase()}`;
    const pickupLocation = process.env.RARITET_PICKUP_LOCATION || "Самовывоз: книжный магазин «Раритет», Бишкек";
    const order = await prisma.$transaction(async (tx) => {
      if (book.stock !== null) {
        const reserved = await tx.raritetBook.updateMany({
          where: { id: book.id, isPublished: true, stock: { gte: quantity } },
          data: { stock: { decrement: quantity } },
        });
        if (reserved.count !== 1) throw new Error("OUT_OF_STOCK");
      }
      return tx.raritetBookOrder.create({
        data: {
          orderNumber,
          accessTokenHash: hashOrderAccessToken(accessToken),
          customerName,
          customerPhone,
          customerEmail: customerEmail || null,
          pickupLocation,
          note,
          status: "pending_payment",
          paymentStatus: "pending",
          totalKgs: book.priceKgs * quantity,
          currency: "KGS",
          reservationExpiresAt: new Date(Date.now() + 30 * 60 * 1000),
          items: { create: { bookId: book.id, titleSnapshot: book.title, quantity, unitPriceKgs: book.priceKgs, lineTotalKgs: book.priceKgs * quantity } },
        },
        select: { id: true, orderNumber: true, totalKgs: true },
      });
    });

    const response = NextResponse.json({ order: { id: order.id.toString(), orderNumber: order.orderNumber, totalKgs: order.totalKgs } }, { status: 201 });
    response.cookies.set(ORDER_ACCESS_COOKIE, accessToken, {
      httpOnly: true,
      secure: request.nextUrl.protocol === "https:",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });
    return response;
  } catch (error) {
    if (error instanceof Error && error.message === "OUT_OF_STOCK") return NextResponse.json({ error: "outOfStock" }, { status: 409 });
    console.error("[RARITET_ORDER_CREATE]", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "serverError" }, { status: 500 });
  }
}
