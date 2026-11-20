"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteFooter from "@/app/components/SiteFooter";
import { ArrowRight, BookOpen, FlaskConical, Gift, GraduationCap, Languages, Mountain, Search, Smile } from "lucide-react";
import CartLink from "@/app/components/CartLink";

const categories = [
  { title: "Художественная литература", Icon: BookOpen, href: "/books" },
  { title: "Учебная литература", Icon: GraduationCap, href: "/books" },
  { title: "Детская литература", Icon: Smile, href: "/books" },
  { title: "Научная литература", Icon: FlaskConical, href: "/books" },
  { title: "Книги о Кыргызстане", Icon: Mountain, href: "/books" },
  { title: "Подарочные издания", Icon: Gift, href: "/books" },
  { title: "Иностранная литература", Icon: Languages, href: "/books" },
];

const defaultHome = {
  heroEyebrow: "КНИГИ И КУЛЬТУРНОЕ НАСЛЕДИЕ", heroTitle: "Книги, которые\nсохраняют историю", heroText: "Откройте для себя книги, знания\nи культурное наследие Кыргызстана",
  countryEyebrow: "ОТКРОЙТЕ СВОЮ СТРАНУ", countryTitle: "Книги о Кыргызстане", countryText: "Узнайте больше о нашей стране —\nо её природе, истории, культуре\nи людях.",
  aboutEyebrow: "КНИЖНЫЙ МИР БИШКЕКА", aboutTitle: "Раритет — с 1992 года", aboutText: "Сеть книжных магазинов «Раритет» — это любовь к книгам, уважение к знаниям и забота о культуре. Уже более 30 лет мы объединяем читателей в Кыргызстане.",
  museumEyebrow: "КУЛЬТУРНОЕ НАСЛЕДИЕ", museumTitle: "Музей прикладного искусства\nКыргызстана", museumText: "На Пушкина, 78 расположен музей\nнародного искусства, открытый для всех.",
  copyright: "Раритет. Все права защищены.",
};

function Lines({ text }: { text: string }) {
  return <>{text.split("\n").map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}</>;
}

export default function Home() {
  const [home, setHome] = useState(defaultHome);
  useEffect(() => {
    fetch("/api/content/home", { cache: "no-store" }).then((r) => r.json()).then((d) => setHome({ ...defaultHome, ...d })).catch(() => {});
  }, []);
  return <main className="home-page" id="top">
    <div className="first-screen">
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="Раритет — главная"><BookOpen className="brand-mark" size={37} strokeWidth={1.5} /><span>РАРИТЕТ<small>КНИГИ · КУЛЬТУРА · КЫРГЫЗСТАН</small></span></Link>
      <nav aria-label="Основная навигация"><Link href="/" aria-current="page">Главная</Link><Link href="/books">Каталог</Link><Link href="/about">О компании</Link><Link href="/stores">Магазины</Link><a href="#contacts">Контакты</a></nav>
      <div className="header-tools"><Link href="/books" aria-label="Поиск книг"><Search size={21} /></Link><CartLink /><Link className="header-sign-in" href="/admin">Войти</Link></div>
    </header>

    <section className="hero" aria-label="Книги Раритет">
      <div className="hero-copy"><p className="eyebrow">{home.heroEyebrow}</p><h1><Lines text={home.heroTitle} /></h1><p className="hero-description"><Lines text={home.heroText} /></p><Link className="button button-primary" href="/books">Перейти в каталог <ArrowRight size={18} /></Link></div>
      <div className="hero-controls" aria-hidden="true"><span className="active-dot"/><span/><span/></div>
    </section>
    </div>

    <nav className="category-ribbon" aria-label="Категории книг"><div className="category-track">{categories.map(({title, Icon, href}) => <Link href={href} key={title}><Icon size={29} strokeWidth={1.55}/><span>{title}</span></Link>)}{categories.map(({title, Icon, href}) => <Link href={href} key={`repeat-${title}`} aria-hidden="true" tabIndex={-1}><Icon size={29} strokeWidth={1.55}/><span>{title}</span></Link>)}</div></nav>

    <section className="kyrgyzstan-section"><div className="kyrgyzstan-copy"><p className="eyebrow">{home.countryEyebrow}</p><h2>{home.countryTitle}</h2><p><Lines text={home.countryText} /></p><Link className="button button-outline desktop-kyrgyzstan-link" href="/books">Перейти в раздел <ArrowRight size={17}/></Link></div><div className="book-showcase"><img src="/images/books-kyrgyzstan-reference.png" alt="Три книги о природе, истории и культуре Кыргызстана"/></div><Link className="button button-outline mobile-kyrgyzstan-link" href="/books">Перейти в раздел <ArrowRight size={17}/></Link></section>

    <section className="about-feature"><div className="store-photo" role="img" aria-label="Книжный магазин Раритет"/><div className="about-feature-copy"><p className="eyebrow">{home.aboutEyebrow}</p><h2>{home.aboutTitle}</h2><p>{home.aboutText}</p><Link className="button button-primary" href="/about">О компании <ArrowRight size={17}/></Link></div></section>

    <section className="museum-banner"><div><p className="eyebrow">{home.museumEyebrow}</p><h2><Lines text={home.museumTitle} /></h2><p><Lines text={home.museumText} /></p><Link href="/stores">Узнать больше <ArrowRight size={16}/></Link></div></section>

    <SiteFooter />
  </main>;
}
