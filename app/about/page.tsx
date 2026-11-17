import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, MapPin, Search, Users } from "lucide-react";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "О компании | Раритет",
  description: "Раритет — книжный магазин, издательство и пространство культуры Кыргызстана с 1992 года.",
};

export default function AboutPage() {
  return (
    <main className={styles.aboutPage}>
      <header className={`site-header ${styles.header}`}>
        <Link className="wordmark" href="/" aria-label="Раритет — главная"><BookOpen className="brand-mark" size={42} strokeWidth={1.5}/><span>РАРИТЕТ</span></Link>
        <nav aria-label="Основная навигация"><Link href="/">Главная</Link><Link href="/books">Каталог</Link><Link href="/about" aria-current="page">О компании</Link><Link href="/stores">Магазины</Link><Link href="/#contacts">Контакты</Link></nav>
        <div className="header-tools"><Link href="/books" aria-label="Поиск по каталогу"><Search size={22}/></Link><Link href="/stores" aria-label="Наши магазины"><MapPin size={21}/></Link></div>
      </header>
      <section className={styles.hero}>
        <div className={styles.copy}>
          <div className={styles.eyebrow}><span/>✦ <b>О НАС</b><span/></div>
          <h1>О компании</h1>
          <h2>Раритет — больше, чем книжный магазин</h2>
          <p className={styles.description}>Мы — книжный магазин «Раритет», где каждая книга находит своего читателя. Наша миссия — сохранять книжную культуру, вдохновлять на знания и создавать уютное пространство для всех, кто любит книги.</p>
          <div className={styles.stats}>
            <div><BookOpen/><strong>10+</strong><span>лет с вами</span></div>
            <div><Users/><strong>50 000+</strong><span>довольных читателей</span></div>
            <div><BookOpen/><strong>100 000+</strong><span>книг в каталоге</span></div>
            <div><MapPin/><strong>5</strong><span>магазинов по КР</span></div>
          </div>
          <Link href="/books" className={styles.button}>Узнать больше <ArrowRight size={17}/></Link>
        </div>
        <div className={styles.note}><span className={styles.noteIcon}><BookOpen/></span><strong>Раритет — это традиции,<br/>которые вдохновляют</strong><span className={styles.noteStar}>✦</span></div>
        <div className={styles.mountainLine} aria-hidden="true"/>
      </section>
    </main>
  );
}
