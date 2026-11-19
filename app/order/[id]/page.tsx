import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { matchesOrderAccessToken, ORDER_ACCESS_COOKIE } from "@/lib/book-order-security";
import BookOrderPanel from "@/app/components/BookOrderPanel";
import styles from "@/app/components/BookStore.module.css";

export const dynamic = "force-dynamic";

export default async function BookOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ORDER_ACCESS_COOKIE)?.value;
  const order = await prisma.raritetBookOrder.findUnique({
    where: { id: BigInt(id) },
    select: { id: true, orderNumber: true, accessTokenHash: true, status: true, paymentStatus: true, totalKgs: true, reservationExpiresAt: true, items: { select: { titleSnapshot: true, quantity: true, unitPriceKgs: true, lineTotalKgs: true } } },
  });
  if (!order || !matchesOrderAccessToken(accessToken, order.accessTokenHash)) notFound();

  return (
    <main className={styles.detailPage}>
      <div className={styles.orderPage}>
        <p className={styles.kicker}>КНИЖНЫЙ МАГАЗИН · РАРИТЕТ</p>
        <h1>Заказ создан</h1>
        <p className={styles.orderNumber}>Номер заказа {order.orderNumber}</p>
        <BookOrderPanel initialOrder={{
          id: order.id.toString(),
          orderNumber: order.orderNumber,
          status: order.status,
          paymentStatus: order.paymentStatus,
          totalKgs: order.totalKgs,
          reservationExpiresAt: order.reservationExpiresAt.toISOString(),
          items: order.items,
        }} />
        <a className={styles.orderBackLink} href="/books">Вернуться в каталог</a>
      </div>
    </main>
  );
}
