"use client";

import { useEffect, useState } from "react";
import styles from "./BookStore.module.css";

type OrderView = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalKgs: number;
  reservationExpiresAt: string;
  items: { titleSnapshot: string; quantity: number; unitPriceKgs: number; lineTotalKgs: number }[];
};

export default function BookOrderPanel({ initialOrder }: { initialOrder: OrderView }) {
  const [order, setOrder] = useState(initialOrder);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (order.paymentStatus === "paid") return;
    const refresh = async () => {
      try {
        const response = await fetch(`/api/book-orders/${order.id}`, { cache: "no-store" });
        if (response.ok) {
          const result = await response.json();
          if (result.order) setOrder(result.order);
        }
      } catch { /* The buyer can refresh manually if the connection is interrupted. */ }
    };
    const timer = window.setInterval(() => void refresh(), 5000);
    return () => window.clearInterval(timer);
  }, [order.id, order.paymentStatus]);

  async function pay() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/finik/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });
      const result = await response.json();
      if (result.paid) {
        setOrder((current) => ({ ...current, paymentStatus: "paid", status: "paid" }));
      } else if (response.ok && typeof result.paymentUrl === "string") {
        window.location.assign(result.paymentUrl);
      } else if (result.error === "outOfStock") {
        const titles = Array.isArray(result.titles) ? result.titles.map((title: string) => `«${title}»`).join(", ") : "";
        setError(`Пока вы оформляли заказ, ${titles || "часть книг"} раскупили. Свяжитесь с магазином или оформите заказ заново.`);
      } else {
        setError("Не удалось открыть оплату. Обновите страницу и попробуйте ещё раз.");
      }
    } catch {
      setError("Не удалось связаться с Finik. Проверьте интернет и попробуйте ещё раз.");
    } finally {
      setBusy(false);
    }
  }

  const paid = order.paymentStatus === "paid";
  const expired = new Date(order.reservationExpiresAt).getTime() <= Date.now();

  return (
    <>
      <div className={styles.orderItems}>
        {order.items.map((item, index) => <div key={`${item.titleSnapshot}-${index}`}><span>{item.titleSnapshot} × {item.quantity}</span><strong>{item.lineTotalKgs.toLocaleString("ru-RU")} сом</strong></div>)}
        <div className={styles.orderTotal}><span>К оплате</span><strong>{order.totalKgs.toLocaleString("ru-RU")} сом</strong></div>
      </div>
      <p className={styles.orderPaymentState} role="status">{paid ? "Оплата подтверждена. Мы свяжемся с вами по указанному телефону." : "Заказ ожидает оплаты через Finik QR."}</p>
      {!paid && !expired && <button className={styles.orderPayButton} disabled={busy} onClick={() => void pay()}>{busy ? "Открываем Finik…" : "Оплатить через Finik"}</button>}
      {!paid && expired && <p className={styles.purchaseError}>Время оплаты истекло. Свяжитесь с магазином, чтобы оформить заказ заново.</p>}
      {error && <p className={styles.purchaseError} role="alert">{error}</p>}
    </>
  );
}
