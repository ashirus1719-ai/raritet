"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { cartCount, useCart } from "@/lib/cart";
import styles from "./Cart.module.css";

export default function CartLink() {
  const count = cartCount(useCart());
  return (
    <Link href="/cart" className={styles.cartLink} aria-label={count ? `Корзина, книг: ${count}` : "Корзина"}>
      <ShoppingBag size={21} strokeWidth={1.8} aria-hidden="true" />
      {count > 0 && <span className={styles.cartBadge} aria-hidden="true">{count > 99 ? "99+" : count}</span>}
    </Link>
  );
}
