"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, FlaskConical, Gift, GraduationCap, Languages, Mail, MapPin, Mountain, Search, Smile, Phone } from "lucide-react";

const categories = [
  { title: "Художественная литература", Icon: BookOpen, href: "/books" },
  { title: "Учебная литература", Icon: GraduationCap, href: "/books" },
  { title: "Детская литература", Icon: Smile, href: "/books" },
  { title: "Научная литература", Icon: FlaskConical, href: "/books" },
  { title: "Книги о Кыргызстане", Icon: Mountain, href: "/books" },
  { title: "Подарочные издания", Icon: Gift, href: "/books" },
  { title: "Иностранная литература", Icon: Languages, href: "/books" },
];

export default function Home() {
  return <main className="home-page" id="top">
    <div className="first-screen">
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="Раритет — главная"><BookOpen className="brand-mark" size={37} strokeWidth={1.5} /><span>РАРИТЕТ<small>КНИГИ · КУЛЬТУРА · КЫРГЫЗСТАН</small></span></Link>
      <nav aria-label="Основная навигация"><Link href="/" aria-current="page">Главная</Link><Link href="/books">Каталог</Link><Link href="/about">О компании</Link><Link href="/stores">Магазины</Link><a href="#contacts">Контакты</a></nav>
      <div className="header-tools"><Link href="/books" aria-label="Поиск книг"><Search size={21} /></Link></div>
    </header>

    <section className="hero" aria-label="Книги Раритет">
      <div className="hero-copy"><p className="eyebrow">КНИГИ И КУЛЬТУРНОЕ НАСЛЕДИЕ</p><h1>Книги, которые<br />сохраняют историю</h1><p className="hero-description">Откройте для себя книги, знания<br className="desktop-break" /> и культурное наследие Кыргызстана</p><Link className="button button-primary" href="/books">Перейти в каталог <ArrowRight size={18} /></Link></div>
      <div className="hero-controls" aria-hidden="true"><span className="active-dot"/><span/><span/></div>
    </section>
    </div>

    <nav className="category-ribbon" aria-label="Категории книг"><div className="category-track">{categories.map(({title, Icon, href}) => <Link href={href} key={title}><Icon size={29} strokeWidth={1.55}/><span>{title}</span></Link>)}{categories.map(({title, Icon, href}) => <Link href={href} key={`repeat-${title}`} aria-hidden="true" tabIndex={-1}><Icon size={29} strokeWidth={1.55}/><span>{title}</span></Link>)}</div></nav>

    <section className="kyrgyzstan-section"><div className="kyrgyzstan-copy"><p className="eyebrow">ОТКРОЙТЕ СВОЮ СТРАНУ</p><h2>Книги о Кыргызстане</h2><p>Узнайте больше о нашей стране —<br />о её природе, истории, культуре<br />и людях.</p><Link className="button button-outline desktop-kyrgyzstan-link" href="/books">Перейти в раздел <ArrowRight size={17}/></Link></div><div className="book-showcase"><img src="/images/books-kyrgyzstan-reference.png" alt="Три книги о природе, истории и культуре Кыргызстана"/></div><Link className="button button-outline mobile-kyrgyzstan-link" href="/books">Перейти в раздел <ArrowRight size={17}/></Link></section>

    <section className="about-feature"><div className="store-photo" role="img" aria-label="Книжный магазин Раритет"/><div className="about-feature-copy"><p className="eyebrow">КНИЖНЫЙ МИР БИШКЕКА</p><h2>Раритет — с 1992 года</h2><p>Сеть книжных магазинов «Раритет» — это любовь к книгам, уважение к знаниям и забота о культуре. Уже более 30 лет мы объединяем читателей в Кыргызстане.</p><Link className="button button-primary" href="/about">О компании <ArrowRight size={17}/></Link></div></section>

    <section className="museum-banner"><div><p className="eyebrow">КУЛЬТУРНОЕ НАСЛЕДИЕ</p><h2>Музей прикладного искусства<br/>Кыргызстана</h2><p>На Пушкина, 78 расположен музей<br/>народного искусства, открытый для всех.</p><Link href="/stores">Узнать больше <ArrowRight size={16}/></Link></div></section>

    <footer className="site-footer" id="contacts"><div className="footer-brand"><Link className="wordmark" href="/"><BookOpen className="brand-mark" size={42}/><span>РАРИТЕТ<small>Книги. Культура. Кыргызстан.</small></span></Link></div><div><h3>Наши магазины</h3><p><MapPin size={15}/> Бишкек</p><Link href="/stores">Все адреса <ArrowRight size={14}/></Link></div><div><h3>Контакты</h3><a href="tel:+996312664524"><Phone size={15}/> +996 312 66-45-24</a><a href="mailto:info@raritet.kg"><Mail size={15}/> info@raritet.kg</a></div><div><h3>Мы в соцсетях</h3><a className="social-link" href="https://www.instagram.com/raritet_kg/" target="_blank" rel="noreferrer">Instagram ↗</a></div><p className="copyright">© 1992–2025 Раритет. Все права защищены.</p></footer>
  </main>;
}
