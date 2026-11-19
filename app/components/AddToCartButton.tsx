"use client";

import Link from "next/link";
import { Check, ShoppingBag } from "lucide-react";
import { addToCart, maxQuantityFor, useCart, type CartBook } from "@/lib/cart";
import styles from "./Cart.module.css";

/** Compact "В корзину" button for book cards. Turns into a link to the cart once the book is added. */
export default function AddToCartButton({ book, className = "" }: { book: CartBook; className?: string }) {
  const inCart = useCart().find((item) => item.slug === book.slug);

  if (maxQuantityFor(book.stock) === 0) {
    return <button type="button" className={`${styles.addButton} ${className}`} disabled>Нет в наличии</button>;
  }

  if (inCart) {
    return (
      <Link href="/cart" className={`${styles.addButton} ${styles.addButtonDone} ${className}`} aria-label={`В корзине: ${inCart.quantity} шт. Перейти в корзину`}>
        <Check size={15} strokeWidth={2.2} aria-hidden="true" /> В корзине
      </Link>
    );
  }

  return (
    <button type="button" className={`${styles.addButton} ${className}`} onClick={() => addToCart(book)}>
      <ShoppingBag size={15} strokeWidth={2} aria-hidden="true" /> В корзину
    </button>
  );
}
