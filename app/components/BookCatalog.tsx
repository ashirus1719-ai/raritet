"use client";

import Link from "next/link";
import SiteFooter from "@/app/components/SiteFooter";
import { useMemo, useState } from "react";
import { ArrowDownWideNarrow, ArrowLeft, ArrowRight, BookOpen, FlaskConical, Landmark, Mountain, Search, SlidersHorizontal, Sparkles, Smile } from "lucide-react";
import type { CatalogBook } from "@/lib/books";
import BookCover from "@/app/components/BookCover";
import styles from "./BookStore.module.css";

const PAGE_SIZE = 12;

function CategoryIcon({ label }: { label: string }) {
  const Icon = label === "Все книги" ? BookOpen
    : /истор/i.test(label) ? Landmark
      : /культур|кыргыз/i.test(label) ? Mountain
        : /искусств/i.test(label) ? Sparkles
          : /детск/i.test(label) ? Smile
            : /науч|учеб/i.test(label) ? FlaskConical
              : SlidersHorizontal;
  return <Icon size={22} strokeWidth={1.7} aria-hidden="true" />;
}

export default function BookCatalog({ books }: { books: CatalogBook[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Все книги");
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const categories = useMemo(() => ["Все книги", ...new Set(books.map((book) => book.category))], [books]);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("ru");
    const result = books.filter((book) => (category === "Все книги" || book.category === category)
      && (!normalized || `${book.title} ${book.author ?? ""} ${book.category}`.toLocaleLowerCase("ru").includes(normalized)));
    if (sort === "price-asc") result.sort((a, b) => a.priceKgs - b.priceKgs);
    if (sort === "price-desc") result.sort((a, b) => b.priceKgs - a.priceKgs);
    if (sort === "title") result.sort((a, b) => a.title.localeCompare(b.title, "ru"));
    return result;
  }, [books, category, query, sort]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visibleBooks = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const paginationPages = Array.from({ length: pageCount }, (_, index) => index + 1)
    .filter((pageNumber) => pageNumber === 1 || pageNumber === pageCount || Math.abs(pageNumber - page) <= 1);

  return (
    <main className={styles.storePage}>
      <header className={`site-header ${styles.catalogHeader}`}>
        <Link className="wordmark" href="/" aria-label="Раритет — главная"><BookOpen className="brand-mark" size={37} strokeWidth={1.5} /><span>РАРИТЕТ<small>КНИГИ · КУЛЬТУРА · КЫРГЫЗСТАН</small></span></Link>
        <nav aria-label="Основная навигация"><Link href="/">Главная</Link><Link href="/books" aria-current="page">Каталог</Link><Link href="/about">О компании</Link><Link href="/stores">Магазины</Link><a href="#contacts">Контакты</a></nav>
        <div className="header-tools"><a href="#catalog-search" aria-label="Поиск по каталогу"><Search size={21} /></a></div>
      </header>
      <section className={styles.catalogHero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>КНИГИ И КУЛЬТУРА КЫРГЫЗСТАНА</p>
          <h1>Каталог</h1>
          <p>Уникальные книги, которые<br className={styles.desktopBreak} /> сохраняют историю</p>
          <div className={styles.heroOrnament} aria-hidden="true"><span />✦<span /></div>
        </div>
      </section>
      {books.every((book) => Number(book.id) < 0) && <p className={styles.demoNote}>Показан предварительный каталог. Наличие и параметры издания уточняйте в магазине.</p>}
      <section className={styles.catalogSection} id="catalog-books">
        <div className={styles.categoryChips} aria-label="Категории">{categories.map((item) => <button type="button" key={item} onClick={() => { setCategory(item); setPage(1); }} className={category === item ? styles.activeChip : ""}><CategoryIcon label={item}/><span>{item}</span></button>)}</div>
        <div className={styles.catalogToolbar}><div className={styles.toolbarTitle}><p className={styles.kicker}>ВЫБЕРИТЕ СВОЮ ИСТОРИЮ</p><h2>Книжная полка</h2><span className={styles.resultCount}>{filtered.length} {filtered.length === 1 ? "книга" : "книг"}</span></div><div className={styles.controls}>
          <label className={styles.search} id="catalog-search"><Search size={17} /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Название, автор или тема" aria-label="Поиск по книгам" />{query && <button type="button" onClick={() => { setQuery(""); setPage(1); }} aria-label="Очистить поиск">×</button>}</label>
          <label className={styles.sort}><ArrowDownWideNarrow size={16} /><select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }} aria-label="Сортировка"><option value="featured">Рекомендуем</option><option value="price-asc">Сначала дешевле</option><option value="price-desc">Сначала дороже</option><option value="title">По названию</option></select></label>
        </div></div>
        {filtered.length ? <><div className={styles.bookGrid}>{visibleBooks.map((book, index) => <Link key={book.slug} href={`/books/${book.slug}`} className={styles.bookCard}>
          <div className={styles.bookCoverWrap}><BookCover title={book.title} author={book.author} tone={book.coverTone} image={book.coverUrl} /><span className={styles.cardNumber}>{String((page - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}</span>{book.isFeatured && <span className={styles.featured}>ВЫБОР РЕДАКЦИИ</span>}</div>
          <div className={styles.bookInfo}><span className={styles.bookCategory}>{book.category}</span><h3>{book.title}</h3><p>{book.author || book.publisher || "Издательство Раритет"}</p><div className={styles.bookPrice}><strong>{new Intl.NumberFormat("ru-RU").format(book.priceKgs)} сом</strong><span>{book.stock === null ? "Наличие уточняйте" : book.stock > 0 ? "В наличии" : "Нет в наличии"}</span></div><span className={styles.detailsLink}>О книге <ArrowRight size={15} /></span></div>
        </Link>)}</div>{pageCount > 1 && <nav className={styles.pagination} aria-label="Страницы каталога"><button className={styles.pageArrow} type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} aria-label="Предыдущая страница"><ArrowLeft size={16}/></button>{paginationPages.map((pageNumber, index) => <span className={styles.pageSlot} key={pageNumber}>{index > 0 && pageNumber - paginationPages[index - 1] > 1 && <span className={styles.pageEllipsis}>…</span>}<button type="button" onClick={() => setPage(pageNumber)} aria-current={page === pageNumber ? "page" : undefined} className={page === pageNumber ? styles.currentPage : undefined}>{pageNumber}</button></span>)}<button className={styles.pageArrow} type="button" onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={page === pageCount} aria-label="Следующая страница"><ArrowRight size={16}/></button></nav>}</> : <div className={styles.empty}><span>⌕</span><h3>Такой книги пока нет</h3><p>Попробуйте другое название или выберите все книги.</p><button type="button" onClick={() => { setQuery(""); setCategory("Все книги"); setPage(1); }}>Сбросить фильтры</button></div>}
      </section>
      <SiteFooter />
    </main>
  );
}
