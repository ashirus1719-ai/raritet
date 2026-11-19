"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import BookCover from "@/app/components/BookCover";
import { cartCount, cartTotal, clearCart, maxQuantityFor, removeFromCart, setCartQuantity, useCart } from "@/lib/cart";
import styles from "./Cart.module.css";

const formatPrice = (value: number) => new Intl.NumberFormat("ru-RU").format(value);

function booksWord(count: number) {
  const mod10 = count % 10, mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "книга";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "книги";
  return "книг";
}

export default function CartView() {
  const router = useRouter();
  const items = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const count = cartCount(items);
  const total = cartTotal(items);

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
          items: items.map(({ slug, quantity }) => ({ slug, quantity })),
          customerName: form.get("customerName"),
          customerPhone: form.get("customerPhone"),
          customerEmail: form.get("customerEmail"),
          note: form.get("note"),
        }),
      });
      const result = await response.json();
      if (response.ok && result.order?.id) {
        clearCart();
        router.push(`/order/${result.order.id}`);
        return;
      }
      if (result.error === "bookNotFound" && Array.isArray(result.slugs)) {
        const titles = items.filter((item) => result.slugs.includes(item.slug)).map((item) => `«${item.title}»`).join(", ");
        removeFromCart(result.slugs);
        setError(`${titles || "Некоторые книги"} больше нет в каталоге — мы убрали их из корзины. Проверьте заказ и отправьте снова.`);
      } else if (result.error === "outOfStock") {
        const item = items.find((entry) => entry.slug === result.slug);
        if (item && typeof result.available === "number") setCartQuantity(item.slug, result.available);
        setError(item ? `«${item.title}»: ${typeof result.available === "number" && result.available > 0 ? `в наличии только ${result.available} шт. — количество исправлено.` : "сейчас нет в наличии."}` : "Части книг сейчас нет в наличии.");
      } else {
        setError("Не удалось оформить заказ. Проверьте данные и попробуйте ещё раз.");
      }
    } catch {
      setError("Не удалось связаться с сайтом. Проверьте интернет и повторите попытку.");
    } finally {
      setBusy(false);
    }
  }

  if (!items.length) {
    return (
      <section className={styles.cartEmpty}>
        <ShoppingBag size={40} strokeWidth={1.4} aria-hidden="true" />
        <h1>Корзина пуста</h1>
        <p>Загляните в каталог — там книги о Кыргызстане, классика, детские издания и подарочные альбомы.</p>
        <Link href="/books" className={styles.cartEmptyLink}>Перейти в каталог</Link>
      </section>
    );
  }

  return (
    <section className={styles.cartPage}>
      <Link href="/books" className={styles.cartBack}><ArrowLeft size={15} /> Продолжить покупки</Link>
      <h1>Корзина <span>{count} {booksWord(count)}</span></h1>
      <div className={styles.cartLayout}>
        <ul className={styles.cartList}>
          {items.map((item) => {
            const limit = maxQuantityFor(item.stock);
            return (
              <li key={item.slug} className={styles.cartItem}>
                <Link href={`/books/${item.slug}`} className={styles.cartThumb} tabIndex={-1} aria-hidden="true">
                  <BookCover title={item.title} author={item.author} tone={item.coverTone} image={item.coverUrl} compact />
                </Link>
                <div className={styles.cartItemInfo}>
                  <Link href={`/books/${item.slug}`} className={styles.cartItemTitle}>{item.title}</Link>
                  {item.author && <span className={styles.cartItemAuthor}>{item.author}</span>}
                  <span className={styles.cartItemUnit}>{formatPrice(item.priceKgs)} сом / шт.</span>
                </div>
                <div className={styles.stepper} aria-label={`Количество: ${item.title}`}>
                  <button type="button" onClick={() => setCartQuantity(item.slug, item.quantity - 1)} disabled={item.quantity <= 1} aria-label="Меньше"><Minus size={15} /></button>
                  <output>{item.quantity}</output>
                  <button type="button" onClick={() => setCartQuantity(item.slug, item.quantity + 1)} disabled={item.quantity >= limit} aria-label="Больше"><Plus size={15} /></button>
                </div>
                <strong className={styles.cartItemTotal}>{formatPrice(item.priceKgs * item.quantity)} сом</strong>
                <button type="button" className={styles.cartRemove} onClick={() => removeFromCart(item.slug)} aria-label={`Удалить «${item.title}» из корзины`}><Trash2 size={17} /></button>
              </li>
            );
          })}
        </ul>

        <aside className={styles.cartSummary}>
          <div className={styles.summaryRows}>
            <div><span>Книги ({count})</span><span>{formatPrice(total)} сом</span></div>
            <div><span>Получение</span><span>Самовывоз, бесплатно</span></div>
            <div className={styles.summaryTotal}><span>Итого</span><strong>{formatPrice(total)} сом</strong></div>
          </div>
          <form className={styles.checkoutForm} onSubmit={submit}>
            <h2>Оформление заказа</h2>
            <label>Ваше имя<input name="customerName" required minLength={2} maxLength={100} autoComplete="name" /></label>
            <label>Телефон<input name="customerPhone" required minLength={7} maxLength={30} type="tel" autoComplete="tel" placeholder="+996 …" /></label>
            <label>Электронная почта <span>необязательно</span><input name="customerEmail" type="email" maxLength={254} autoComplete="email" /></label>
            <label>Комментарий <span>необязательно</span><textarea name="note" rows={2} maxLength={500} /></label>
            <p className={styles.checkoutNote}>Самовывоз из книжного магазина «Раритет» в Бишкеке. Оплатите заказ через Finik QR в течение 30 минут — книги закрепляются за вами после оплаты.</p>
            {error && <p className={styles.checkoutError} role="alert">{error}</p>}
            <button type="submit" disabled={busy}>{busy ? "Создаём заказ…" : "Перейти к оплате"}</button>
            <small>Итоговая сумма рассчитывается по текущим ценам каталога.</small>
          </form>
        </aside>
      </div>
    </section>
  );
}
