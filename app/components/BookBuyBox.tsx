"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { addToCart, maxQuantityFor, useCart, type CartBook } from "@/lib/cart";
import styles from "./Cart.module.css";

export default function BookBuyBox({ book }: { book: CartBook }) {
  const router = useRouter();
  const inCart = useCart().find((item) => item.slug === book.slug);
  const limit = maxQuantityFor(book.stock);
  const available = Math.max(0, limit - (inCart?.quantity ?? 0));
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState("");
  const amount = Math.max(1, Math.min(quantity, available || 1));

  if (limit === 0) return <p className={styles.buyUnavailable}>Эта книга сейчас недоступна для заказа. Позвоните нам — подскажем, когда она появится.</p>;

  function add(goToCart: boolean) {
    if (available > 0) {
      const total = addToCart(book, amount);
      setNotice(total ? `Добавлено в корзину. Сейчас в корзине: ${total} шт.` : "Корзина заполнена — оформите текущий заказ.");
      setQuantity(1);
    }
    if (goToCart) router.push("/cart");
  }

  return (
    <div className={styles.buyBox}>
      <div className={styles.buyRow}>
        <div className={styles.stepper} aria-label="Количество">
          <button type="button" onClick={() => setQuantity(amount - 1)} disabled={amount <= 1 || available === 0} aria-label="Меньше"><Minus size={16} /></button>
          <output aria-live="polite">{available === 0 ? 0 : amount}</output>
          <button type="button" onClick={() => setQuantity(amount + 1)} disabled={amount >= available} aria-label="Больше"><Plus size={16} /></button>
        </div>
        <button type="button" className={styles.buyPrimary} onClick={() => add(false)} disabled={available === 0}>
          <ShoppingBag size={18} strokeWidth={2} aria-hidden="true" /> {available === 0 ? "Максимум в корзине" : "В корзину"}
        </button>
      </div>
      <button type="button" className={styles.buySecondary} onClick={() => add(true)}>Купить сейчас</button>
      {inCart && <p className={styles.buyNotice} role="status"><Check size={15} aria-hidden="true" /> {notice || `В корзине: ${inCart.quantity} шт.`} <Link href="/cart">Перейти в корзину</Link></p>}
    </div>
  );
}
