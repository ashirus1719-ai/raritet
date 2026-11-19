import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createOrderAccessToken, hashOrderAccessToken, ORDER_ACCESS_COOKIE } from "@/lib/book-order-security";

export const runtime = "nodejs";

const MAX_LINES = 20;
const MAX_PER_BOOK = 10;
const MAX_TOTAL_KGS = 2_147_483_647;

/** Accepts either `{ items: [{ slug, quantity }] }` (cart) or the legacy `{ slug, quantity }` (single book). */
function parseLines(data: Record<string, unknown>) {
  const raw = Array.isArray(data.items) ? data.items : [{ slug: data.slug, quantity: data.quantity }];
  if (raw.length < 1 || raw.length > MAX_LINES) return null;
  const merged = new Map<string, number>();
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") return null;
    const { slug, quantity } = entry as Record<string, unknown>;
    const cleanSlug = typeof slug === "string" ? slug.trim() : "";
    const qty = Number(quantity);
    if (!cleanSlug || cleanSlug.length > 200 || !Number.isInteger(qty) || qty < 1) return null;
    merged.set(cleanSlug, (merged.get(cleanSlug) ?? 0) + qty);
  }
  const lines = [...merged].map(([slug, quantity]) => ({ slug, quantity }));
  return lines.every((line) => line.quantity <= MAX_PER_BOOK) ? lines : null;
}

export async function POST(request: NextRequest) {
  try {
    const input: unknown = await request.json();
    if (!input || typeof input !== "object") return NextResponse.json({ error: "invalidRequest" }, { status: 400 });
    const data = input as Record<string, unknown>;
    const lines = parseLines(data);
    const customerName = typeof data.customerName === "string" ? data.customerName.trim() : "";
    const customerPhone = typeof data.customerPhone === "string" ? data.customerPhone.trim() : "";
    const customerEmail = typeof data.customerEmail === "string" ? data.customerEmail.trim() : "";
    const note = typeof data.note === "string" ? data.note.trim() : "";

    if (!lines || customerName.length < 2 || customerName.length > 100 ||
      customerPhone.length < 7 || customerPhone.length > 30 || (customerEmail && (customerEmail.length > 254 || !/^\S+@\S+\.\S+$/.test(customerEmail))) || note.length > 500) {
      return NextResponse.json({ error: "invalidOrder" }, { status: 400 });
    }

    const books = await prisma.raritetBook.findMany({ where: { slug: { in: lines.map((line) => line.slug) }, isPublished: true } });
    const bySlug = new Map(books.map((book) => [book.slug, book]));
    const missing = lines.filter((line) => !bySlug.has(line.slug)).map((line) => line.slug);
    if (missing.length) return NextResponse.json({ error: "bookNotFound", slugs: missing }, { status: 404 });

    const items = lines.map((line) => {
      const book = bySlug.get(line.slug)!;
      return { book, quantity: line.quantity, lineTotalKgs: book.priceKgs * line.quantity };
    });
    if (items.some(({ book }) => !Number.isSafeInteger(book.priceKgs) || book.priceKgs <= 0)) return NextResponse.json({ error: "invalidPrice" }, { status: 400 });
    const short = items.find(({ book, quantity }) => book.stock !== null && book.stock < quantity);
    if (short) return NextResponse.json({ error: "outOfStock", slug: short.book.slug, available: Math.max(0, short.book.stock ?? 0) }, { status: 409 });
    const totalKgs = items.reduce((sum, item) => sum + item.lineTotalKgs, 0);
    if (totalKgs > MAX_TOTAL_KGS) return NextResponse.json({ error: "invalidOrder" }, { status: 400 });

    const accessToken = createOrderAccessToken();
    const orderNumber = `R-${Date.now().toString(36).toUpperCase()}-${randomBytes(3).toString("hex").toUpperCase()}`;
    const pickupLocation = process.env.RARITET_PICKUP_LOCATION || "Самовывоз: книжный магазин «Раритет», Бишкек";
    // Stock is only checked here; it is written off in the Finik webhook once the order is paid.
    const order = await prisma.raritetBookOrder.create({
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
        totalKgs,
        currency: "KGS",
        reservationExpiresAt: new Date(Date.now() + 30 * 60 * 1000),
        items: {
          create: items.map(({ book, quantity, lineTotalKgs }) => ({ bookId: book.id, titleSnapshot: book.title, quantity, unitPriceKgs: book.priceKgs, lineTotalKgs })),
        },
      },
      select: { id: true, orderNumber: true, totalKgs: true },
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
    console.error("[RARITET_ORDER_CREATE]", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "serverError" }, { status: 500 });
  }
}
