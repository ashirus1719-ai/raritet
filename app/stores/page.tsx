import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/app/components/SiteFooter";
import Image from "next/image";
import { ArrowRight, BookOpen, Clock3, MapPin, Phone, Search } from "lucide-react";
import styles from "./stores.module.css";
import { getContent } from "@/lib/site-content";
import CartLink from "@/app/components/CartLink";

export const metadata: Metadata = {
  title: "Магазины в Бишкеке | Раритет",
  description: "Адреса, контакты и часы работы книжных магазинов «Раритет» в Бишкеке.",
};

export const dynamic = "force-dynamic";

export default async function StoresPage() {
  const { stores, heroDescription } = await getContent("stores");
  return (
    <main className={styles.storesPage}>
      <div className={styles.artWrap}>
      <header className={`site-header ${styles.siteHeader}`}>
        <Link className="wordmark" href="/" aria-label="Раритет — главная"><BookOpen className="brand-mark" size={39}/><span>РАРИТЕТ</span></Link>
        <nav aria-label="Основная навигация"><Link href="/">Главная</Link><Link href="/books">Каталог</Link><Link href="/about">О компании</Link><Link href="/stores" aria-current="page">Магазины</Link><Link href="/#contacts">Контакты</Link></nav>
        <div className="header-tools"><Link href="/books" aria-label="Поиск"><Search size={21}/></Link><CartLink /><Link className="header-sign-in" href="/admin">Войти</Link></div>
      </header>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><i/>✦ <span>ГДЕ НАС НАЙТИ</span></p>
          <h1>Наши<br/>магазины</h1>
          <h2>Ближе к вам, ближе к книгам</h2>
          <p className={styles.heroDescription}>{heroDescription}</p>
          <a className={styles.heroButton} href="#store-list">Выбрать магазин <ArrowRight size={17}/></a>
        </div>
        <div className={styles.mapPins} aria-hidden="true"><span><BookOpen/></span><span><BookOpen/></span><span><BookOpen/></span><span><BookOpen/></span><span><BookOpen/></span></div>
      </section>
      <section className={styles.storesSection} id="store-list">
        <div className={styles.sectionTitle}><span/>✦<h2>Выберите ближайший магазин</h2><span/></div>
        <div className={styles.storesGrid}>
          {stores.map((store) => <article className={`${styles.storeCard} ${store.wide ? styles.wideCard : ""}`} key={store.name + store.address}>
            <div className={styles.storeText}><h3><MapPin/>{store.name}</h3><p><MapPin/>{store.address}</p><p><Clock3/>{store.hours}</p><p><Phone/>{store.phone}</p><a href={`https://maps.google.com/?q=${encodeURIComponent(store.map)}`} target="_blank" rel="noreferrer" className={styles.routeLink}>Маршрут <ArrowRight/></a></div>
            <Image src={store.image} alt={`Книжный магазин «Раритет» — ${store.name}`} width={700} height={450} loading="lazy"/>
          </article>)}
        </div>
      </section>
      </div>
      <Link href="/books" className={styles.bookBanner}><span>Ждём вас за новыми историями</span><ArrowRight/></Link>
      <SiteFooter />
    </main>
  );
}
