import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isFinikTimestampValid, verifyFinikWebhook } from "@/lib/finik";

export const runtime = "nodejs";

type WebhookPayload = {
  transactionId?: string;
  status?: string;
  amount?: number | string;
  fields?: { paymentId?: string; amount?: number | string };
  data?: { accountId?: string };
};

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("signature");
    const timestamp = request.headers.get("x-api-timestamp");
    const host = request.headers.get("host");
    if (!signature || !timestamp || !host || !isFinikTimestampValid(timestamp)) {
      return NextResponse.json({ error: "invalidRequest" }, { status: 400 });
    }

    const body = (await request.json()) as WebhookPayload;
    const signedHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      if (key.toLowerCase().startsWith("x-api-")) signedHeaders[key] = value;
    });
    const url = new URL(request.url);
    if (!verifyFinikWebhook({
      signature,
      timestamp,
      host,
      headers: signedHeaders,
      body: body as Record<string, unknown>,
      path: url.pathname,
      queryStringParameters: Object.fromEntries(url.searchParams.entries()),
    })) return NextResponse.json({ error: "invalidSignature" }, { status: 401 });

    const paymentId = body.fields?.paymentId;
    const status = body.status?.toLowerCase();
    if (status !== "success" && status !== "succeeded") return NextResponse.json({ success: true, ignored: true });
    if (!paymentId || !body.transactionId) return NextResponse.json({ error: "missingPaymentData" }, { status: 400 });
    if (body.data?.accountId && body.data.accountId !== process.env.FINIK_ACCOUNT_ID) {
      return NextResponse.json({ error: "invalidAccount" }, { status: 400 });
    }

    const order = await prisma.raritetBookOrder.findFirst({
      where: { paymentId },
      select: { id: true, totalKgs: true, currency: true, paymentStatus: true },
    });
    if (!order) return NextResponse.json({ error: "paymentNotFound" }, { status: 404 });
    const paidAmount = Number(body.amount ?? body.fields?.amount);
    if (order.currency !== "KGS" || !Number.isSafeInteger(paidAmount) || paidAmount !== order.totalKgs) {
      return NextResponse.json({ error: "amountMismatch" }, { status: 400 });
    }
    if (order.paymentStatus === "paid") return NextResponse.json({ success: true, duplicate: true });

    // Mark the order paid and write off stock atomically. The status guard makes this run once even if Finik retries the webhook.
    await prisma.$transaction(async (tx) => {
      const marked = await tx.raritetBookOrder.updateMany({
        where: { id: order.id, paymentId, paymentStatus: "pending" },
        data: { paymentStatus: "paid", status: "paid" },
      });
      if (marked.count !== 1) return;
      const items = await tx.raritetBookOrderItem.findMany({ where: { orderId: order.id, bookId: { not: null } }, select: { bookId: true, quantity: true } });
      for (const item of items) {
        const bookId = item.bookId!;
        const written = await tx.raritetBook.updateMany({ where: { id: bookId, stock: { gte: item.quantity } }, data: { stock: { decrement: item.quantity } } });
        if (written.count === 1) continue;
        // Someone else bought the last copies while this order was awaiting payment: the order stays paid, stock goes to zero.
        const zeroed = await tx.raritetBook.updateMany({ where: { id: bookId, stock: { not: null } }, data: { stock: 0 } });
        if (zeroed.count) console.warn("[RARITET_FINIK_WEBHOOK] Paid order exceeds stock", { orderId: order.id.toString(), bookId: bookId.toString(), quantity: item.quantity });
      }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[RARITET_FINIK_WEBHOOK]", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "serverError" }, { status: 500 });
  }
}
