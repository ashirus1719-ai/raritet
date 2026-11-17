import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Clock3, MapPin, Phone, Search, UserRound } from "lucide-react";
import styles from "./stores.module.css";

export const metadata: Metadata = {
  title: "Магазины в Бишкеке | Раритет",
  description: "Адреса, контакты и часы работы книжных магазинов «Раритет» в Бишкеке.",
};

const stores = [
  { name: "Площадь Ала-Тоо", address: "ул. Пушкина, 78", hours: "Ежедневно 10:00–19:00", phone: "0555 790 755", image: "/images/store-ala-too.webp", map: "Раритет, ул. Пушкина 78, Бишкек" },
  { name: "Проспект Чуй", address: "пр. Чуй, 271", hours: "Ежедневно 10:00–19:00", phone: "+996 312 34-19-78", image: "/images/store-prospekt-chuy.webp", map: "Раритет, проспект Чуй 271, Бишкек" },
  { name: "ТРЦ Asia Mall", address: "пр. Чынгыза Айтматова, 3 · 1 этаж", hours: "Ежедневно 10:00–22:00", phone: "+996 312 97-55-42", image: "/images/store-asia-mall.webp", map: "Asia Mall, Бишкек" },
  { name: "ГУМ «Чынар»", address: "пр. Чуй, 92 · 4 этаж", hours: "Ежедневно 10:00–22:00", phone: "+996 312 88-24-45", image: "/images/store-gum-chynar.webp", map: "ГУМ Чынар, Бишкек" },
  { name: "ТЦ Tommi Mall", address: "ул. Аалы Токомбаева, 17/2 · 3 этаж", hours: "Ежедневно 10:00–22:00", phone: "0555 790 750", image: "/images/store-tommi-mall.webp", map: "Tommi Mall, Бишкек", wide: true },
];

export default function StoresPage() {
  return (
    <main className={styles.storesPage}>
      <header className={`site-header ${styles.siteHeader}`}>
        <Link className="wordmark" href="/" aria-label="Раритет — главная"><BookOpen className="brand-mark" size={39}/><span>РАРИТЕТ</span></Link>
        <nav aria-label="Основная навигация"><Link href="/">Главная</Link><Link href="/books">Каталог</Link><Link href="/about">О компании</Link><Link href="/stores" aria-current="page">Магазины</Link><Link href="/#contacts">Контакты</Link></nav>
        <div className="header-tools"><Link href="/books" aria-label="Поиск"><Search size={21}/></Link><Link href="/stores" aria-label="Магазины"><UserRound size={21}/></Link></div>
      </header>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><i/>✦ <span>ГДЕ НАС НАЙТИ</span></p>
          <h1>Наши<br/>магазины</h1>
          <h2>Ближе к вам, ближе к книгам</h2>
          <p>Пять книжных магазинов в Бишкеке —<br className={styles.desktopBreak}/> выберите удобный адрес.</p>
          <a className={styles.heroButton} href="#store-list">Выбрать магазин <ArrowRight size={17}/></a>
        </div>
        <div className={styles.mapPins} aria-hidden="true"><span><BookOpen/></span><span><BookOpen/></span><span><BookOpen/></span><span><BookOpen/></span><span><BookOpen/></span></div>
      </section>
      <section className={styles.storesSection} id="store-list">
        <div className={styles.sectionTitle}><span/>✦<h2>Выберите ближайший магазин</h2><span/></div>
        <div className={styles.storesGrid}>
          {stores.map((store) => <article className={`${styles.storeCard} ${store.wide ? styles.wideCard : ""}`} key={store.name}>
            <div className={styles.storeText}><h3><MapPin/>{store.name}</h3><p><MapPin/>{store.address}</p><p><Clock3/>{store.hours}</p><p><Phone/>{store.phone}</p><a href={`https://maps.google.com/?q=${encodeURIComponent(store.map)}`} target="_blank" rel="noreferrer" className={styles.routeLink}>Маршрут <ArrowRight/></a></div>
            <Image src={store.image} alt={`Книжный магазин «Раритет» — ${store.name}`} width={700} height={450} loading="lazy"/>
          </article>)}
        </div>
      </section>
      <Link href="/books" className={styles.bookBanner}><span>Ждём вас за новыми историями</span><ArrowRight/></Link>
      <footer className={`site-footer ${styles.footer}`} id="contacts">
        <div className={styles.footerBrand}><Link className="wordmark" href="/"><BookOpen size={42}/><span>РАРИТЕТ<small>Книги. Культура. Кыргызстан.</small></span></Link></div>
        <div><h3>Магазины</h3><p>5 филиалов в Бишкеке</p><Link href="#store-list">Все магазины <ArrowRight/></Link></div>
        <div><h3>Контакты</h3><a href="tel:+996312341978">(0312) 34-19-78</a><a href="mailto:info@raritet.kg">info@raritet.kg</a></div>
        <div><h3>Мы в соцсетях</h3><a href="https://www.instagram.com/raritet_kg/" target="_blank" rel="noreferrer">Instagram ↗</a></div>
        <p className={styles.copyright}>© 2025 Раритет. Все права защищены.</p>
      </footer>
    </main>
  );
}
