import Link from "next/link";
import { BookOpen, Search } from "lucide-react";
import CartLink from "@/app/components/CartLink";
import styles from "./BookStore.module.css";

export default function StoreHeader({ current }: { current?: "books" | "cart" }) {
  return (
    <header className={`site-header ${styles.catalogHeader}`}>
      <Link className="wordmark" href="/" aria-label="Раритет — главная"><BookOpen className="brand-mark" size={37} strokeWidth={1.5} /><span>РАРИТЕТ<small>КНИГИ · КУЛЬТУРА · КЫРГЫЗСТАН</small></span></Link>
      <nav aria-label="Основная навигация"><Link href="/">Главная</Link><Link href="/books" aria-current={current === "books" ? "page" : undefined}>Каталог</Link><Link href="/about">О компании</Link><Link href="/stores">Магазины</Link><Link href="/#contacts">Контакты</Link></nav>
      <div className="header-tools"><Link href="/books#catalog-search" aria-label="Поиск по каталогу"><Search size={21} /></Link><CartLink /><Link className="header-sign-in" href="/login">Войти</Link></div>
    </header>
  );
}
