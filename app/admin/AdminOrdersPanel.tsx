"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, ShoppingBag } from "lucide-react";
import s from "./admin.module.css";

type Order = { id: string; orderNumber: string; customerName: string; customerPhone: string; customerEmail: string | null; pickupLocation: string; note: string; totalKgs: number; currency: string; updatedAt: string; items: { titleSnapshot: string; quantity: number; lineTotalKgs: number }[] };

export default function AdminOrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/orders", { cache: "no-store" });
      if (!response.ok) throw new Error("Не удалось загрузить заказы");
      const data = await response.json();
      setOrders(data.orders ?? []);
      setError("");
    } catch (e) { setError(e instanceof Error ? e.message : "Ошибка загрузки"); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); const timer = setInterval(load, 15000); return () => clearInterval(timer); }, [load]);

  return <section className={s.panel}>
    <div className={s.panelHead}><span className={s.panelIcon}><ShoppingBag /></span><div><h3>Оплаченные заказы</h3><p>Обновляются автоматически каждые 15 секунд</p></div><button className={s.btnGhost} onClick={() => void load()} aria-label="Обновить"><RefreshCw /></button></div>
    <div className={s.panelBody}>
      {error && <p className={s.errorText}>{error}</p>}
      {loading ? <p className={s.empty}>Загружаем заказы…</p> : orders.length === 0 ? <p className={s.empty}>Оплаченных заказов пока нет</p> : orders.map((order) => <article className={s.dataCard} key={order.id}>
        <div className={s.dataCardHead}><div><strong>Заказ {order.orderNumber}</strong><small>{new Date(order.updatedAt).toLocaleString("ru-RU")}</small></div><b>{order.totalKgs.toLocaleString("ru-RU")} {order.currency === "KGS" ? "сом" : order.currency}</b></div>
        <div className={s.dataGrid}><span><small>Покупатель</small>{order.customerName}</span><span><small>Телефон</small><a href={`tel:${order.customerPhone}`}>{order.customerPhone}</a></span>{order.customerEmail && <span><small>Email</small><a href={`mailto:${order.customerEmail}`}>{order.customerEmail}</a></span>}<span><small>Получение</small>{order.pickupLocation}</span></div>
        <ul className={s.dataItems}>{order.items.map((item, i) => <li key={`${order.id}-${i}`}>{item.titleSnapshot} × {item.quantity}<b>{item.lineTotalKgs.toLocaleString("ru-RU")} сом</b></li>)}</ul>
        {order.note && <p className={s.dataNote}>{order.note}</p>}
      </article>)}
    </div>
  </section>;
}
