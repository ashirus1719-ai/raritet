import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/app/components/SiteFooter";
import { ArrowRight, BookOpen, MapPin, Search, Users } from "lucide-react";
import styles from "./about.module.css";
import { getContent } from "@/lib/site-content";
import CartLink from "@/app/components/CartLink";
import AccountButton from "@/app/components/AccountButton";
import AdminNavLink from "@/app/components/AdminNavLink";

export const dynamic = "force-dynamic";

const icons = { book: BookOpen, users: Users, map: MapPin };

export const metadata: Metadata = {
  title: "О компании | Раритет",
  description: "Раритет — книжный магазин, издательство и пространство культуры Кыргызстана с 1992 года.",
};

export default async function AboutPage() {
  const about = await getContent("about");
  return (
    <main className={styles.aboutPage}>
      <header className={`site-header ${styles.header}`}>
        <Link className="wordmark" href="/" aria-label="Раритет — главная"><BookOpen className="brand-mark" size={42} strokeWidth={1.5}/><span>РАРИТЕТ</span></Link>
        <nav aria-label="Основная навигация"><Link href="/">Главная</Link><Link href="/books">Каталог</Link><Link href="/about" aria-current="page">О компании</Link><Link href="/stores">Магазины</Link><Link href="/#contacts">Контакты</Link><AdminNavLink /></nav>
        <div className="header-tools"><Link href="/books" aria-label="Поиск по каталогу"><Search size={22}/></Link><Link href="/stores" aria-label="Наши магазины"><MapPin size={21}/></Link><CartLink /><AccountButton /></div>
      </header>
      <section className={styles.hero}>
        <div className={styles.copy}>
          <div className={styles.eyebrow}><span/>✦ <b>О НАС</b><span/></div>
          <h1>{about.title}</h1>
          <h2>{about.subtitle}</h2>
          <p className={styles.description}>{about.description}</p>
          <div className={styles.stats}>
            {about.stats.map((st, i) => { const Icon = icons[st.icon] ?? BookOpen; return <div key={i}><Icon/><strong>{st.value}</strong><span>{st.label}</span></div>; })}
          </div>
          <Link href="/books" className={styles.button}>Узнать больше <ArrowRight size={17}/></Link>
        </div>
        <div className={styles.note}><span className={styles.noteIcon}><BookOpen/></span><strong>{about.note}</strong><span className={styles.noteStar}>✦</span></div>
        <div className={styles.mountainLine} aria-hidden="true"/>
      </section>
      <SiteFooter />
    </main>
  );
}
