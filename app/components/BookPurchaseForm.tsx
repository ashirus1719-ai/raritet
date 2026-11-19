"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./BookStore.module.css";

export default function BookPurchaseForm({ slug, stock }: { slug: string; stock: number | null }) {
  const router = useRouter();
  const maxQuantity = stock === null ? 10 : Math.max(0, Math.min(stock, 10));
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/book-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          quantity,
          customerName: form.get("customerName"),
          customerPhone: form.get("customerPhone"),
          customerEmail: form.get("customerEmail"),
          note: form.get("note"),
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.order?.id) {
        setError(result.error === "outOfStock" ? "Этого количества сейчас нет в наличии." : "Не удалось оформить заказ. Проверьте данные и попробуйте ещё раз.");
        return;
      }
      router.push(`/order/${result.order.id}`);
    } catch {
      setError("Не удалось связаться с сайтом. Проверьте интернет и повторите попытку.");
    } finally {
      setBusy(false);
    }
  }

  if (maxQuantity === 0) return <p className={styles.purchaseUnavailable}>Эта книга сейчас недоступна для заказа.</p>;

  return (
    <form className={styles.purchaseForm} onSubmit={submit}>
      <h2>Оформить заказ</h2>
      <label>Ваше имя<input name="customerName" required minLength={2} maxLength={100} autoComplete="name" /></label>
      <label>Телефон<input name="customerPhone" required minLength={7} maxLength={30} type="tel" autoComplete="tel" placeholder="+996 …" /></label>
      <label>Электронная почта <span>необязательно</span><input name="customerEmail" type="email" maxLength={254} autoComplete="email" /></label>
      <label>Количество
        <input name="quantity" type="number" min={1} max={maxQuantity} value={Math.min(quantity, maxQuantity)} onChange={(event) => {
          const nextQuantity = Number(event.target.value);
          setQuantity(Number.isFinite(nextQuantity) ? Math.max(1, Math.min(nextQuantity, maxQuantity)) : 1);
        }} />
      </label>
      <label>Комментарий <span>необязательно</span><textarea name="note" rows={2} maxLength={500} /></label>
      <p className={styles.pickupNote}>Получение: самовывоз из книжного магазина «Раритет» в Бишкеке.</p>
      {error && <p className={styles.purchaseError} role="alert">{error}</p>}
      <button type="submit" disabled={busy}>{busy ? "Создаём заказ…" : "Продолжить к оплате"}</button>
      <small>Сумма заказа будет рассчитана по текущей цене книги.</small>
    </form>
  );
}
