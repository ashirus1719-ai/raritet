"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUp, BookOpen, Mail, MapPin, Phone } from "lucide-react";
import { defaultContent, type SiteContent } from "@/lib/site-content-defaults";
import styles from "./SiteFooter.module.css";

type Data = { contacts: SiteContent["contacts"]; stores: SiteContent["stores"]["stores"]; copyright: string };

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const NAV = [
  { href: "/", label: "Главная" },
  { href: "/books", label: "Каталог книг" },
  { href: "/about", label: "О компании" },
  { href: "/stores", label: "Магазины" },
];

// Общий футер сайта. Контакты, список магазинов и копирайт берутся из админки.
export default function SiteFooter() {
  const [data, setData] = useState<Data>({
    contacts: defaultContent.contacts,
    stores: defaultContent.stores.stores,
    copyright: defaultContent.home.copyright,
  });

  useEffect(() => {
    const get = (k: string) => fetch(`/api/content/${k}`, { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
    Promise.all([get("contacts"), get("stores"), get("home")]).then(([c, st, h]) => {
      setData((d) => ({
        contacts: c ? { ...d.contacts, ...c } : d.contacts,
        stores: Array.isArray(st?.stores) ? st.stores : d.stores,
        copyright: h?.copyright ?? d.copyright,
      }));
    });
  }, []);

  const { contacts, stores } = data;
  // Год всегда текущий; из админки берётся только текст после него.
  const copyright = `© 1992–${new Date().getFullYear()} ${data.copyright.replace(/^©?\s*\d{4}(\s*[–-]\s*\d{4})?\s*/, "")}`;
  const tel = contacts.phone.replace(/[^+\d]/g, "");

  return (
    <footer className={styles.footer} id="contacts">
      <svg className={styles.ridge} viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
        <path className={styles.ridgeBack} d="M0 90V58l90-22 70 14 110-38 95 30 70-12 120 34 105-40 90 26 85-18 120 30 100-36 95 24 80-14 120 30 90-18v62z" />
        <path className={styles.ridgeFront} d="M0 90V70l120-18 100 16 140-26 110 22 130-14 120 20 140-28 120 24 130-12 110 18 220-16v34z" />
        <path className={styles.ridgeLine} d="M0 70l120-18 100 16 140-26 110 22 130-14 120 20 140-28 120 24 130-12 110 18 220-16" />
      </svg>

      <div className={styles.inner}>
        <div className={styles.brandCol}>
          <Link href="/" className={styles.brand} aria-label="Раритет — главная">
            <span className={styles.brandIcon}><BookOpen /></span>
            <span><b>РАРИТЕТ</b><small>Книги. Культура. Кыргызстан.</small></span>
          </Link>
          <p className={styles.about}>Сеть книжных магазинов в Бишкеке с 1992 года. Книги, издания о Кыргызстане и подарочные альбомы.</p>
          <div className={styles.socials}>
            <a href={contacts.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon /></a>
            <a href={`tel:${tel}`} aria-label="Позвонить"><Phone /></a>
            <a href={`mailto:${contacts.email}`} aria-label="Написать письмо"><Mail /></a>
          </div>
        </div>

        <nav className={styles.col} aria-label="Разделы сайта">
          <h3>Разделы</h3>
          {NAV.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
          <Link href="/privacy">Политика конфиденциальности</Link>
          <Link href="/terms">Условия использования</Link>
        </nav>

        <div className={`${styles.col} ${styles.storesCol}`}>
          <h3>Наши магазины</h3>
          <ul>
            {stores.slice(0, 5).map((s) => (
              <li key={s.name + s.address}><MapPin /><span><b>{s.name}</b>{s.address}</span></li>
            ))}
          </ul>
          <Link href="/stores" className={styles.more}>Все адреса <ArrowRight /></Link>
        </div>

        <div className={styles.col}>
          <h3>Связаться с нами</h3>
          <a href={`tel:${tel}`} className={styles.contact}><span><Phone /></span>{contacts.phone}</a>
          <a href={`mailto:${contacts.email}`} className={styles.contact}><span><Mail /></span>{contacts.email}</a>
          <a href={contacts.instagram} target="_blank" rel="noreferrer" className={styles.contact}><span><InstagramIcon /></span>Instagram</a>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>{copyright}</p>
        <span className={styles.ornament} aria-hidden="true">✦</span>
        <a href="#top" className={styles.toTop} onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Наверх <ArrowUp /></a>
      </div>
    </footer>
  );
}
