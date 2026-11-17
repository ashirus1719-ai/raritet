import Link from "next/link";
import { BookOpen, Search } from "lucide-react";
import styles from "@/app/components/BookStore.module.css";

export default function LoadingBooks() {
  return (
    <main className={styles.storePage} aria-label="Загружаем каталог книг" aria-busy="true">
      <header className={`site-header ${styles.catalogHeader}`}>
        <Link className="wordmark" href="/" aria-label="Раритет — главная"><BookOpen className="brand-mark" size={37} strokeWidth={1.5} /><span>РАРИТЕТ<small>КНИГИ · КУЛЬТУРА · КЫРГЫЗСТАН</small></span></Link>
        <nav aria-label="Основная навигация"><Link href="/">Главная</Link><Link href="/books" aria-current="page">Каталог</Link><Link href="/about">О компании</Link><Link href="/stores">Магазины</Link><a href="#contacts">Контакты</a></nav>
        <div className="header-tools"><a href="#catalog-search" aria-label="Поиск по каталогу"><Search size={21} /></a></div>
      </header>
      <section className={styles.catalogHero}>
        <div className={styles.heroCopy}><p className={styles.kicker}>КНИГИ И КУЛЬТУРА КЫРГЫЗСТАНА</p><h1>Каталог</h1><p>Уникальные книги, которые<br className={styles.desktopBreak} /> сохраняют историю</p><div className={styles.heroOrnament} aria-hidden="true"><span />✦<span /></div></div>
      </section>
      <section className={styles.catalogSection} aria-label="Загрузка книг">
        <div className={`${styles.categoryChips} ${styles.loadingChips}`} aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <span key={index} />)}</div>
        <div className={styles.catalogToolbar}><div className={styles.toolbarTitle}><p className={styles.kicker}>ВЫБЕРИТЕ СВОЮ ИСТОРИЮ</p><h2>Книжная полка</h2></div></div>
        <div className={`${styles.bookGrid} ${styles.loadingCardGrid}`} aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <div key={index} className={styles.loadingCard} />)}</div>
      </section>
    </main>
  );
}
