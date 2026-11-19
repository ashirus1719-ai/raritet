import type { Metadata } from "next";
import CartView from "@/app/components/CartView";
import StoreHeader from "@/app/components/StoreHeader";
import SiteFooter from "@/app/components/SiteFooter";
import styles from "@/app/components/BookStore.module.css";

export const metadata: Metadata = {
  title: "Корзина | Раритет",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <main className={styles.storePage}>
      <StoreHeader current="cart" />
      <CartView />
      <SiteFooter />
    </main>
  );
}
