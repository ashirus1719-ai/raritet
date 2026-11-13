"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowDownWideNarrow, ArrowLeft, ArrowRight, Search, SlidersHorizontal } from "lucide-react";
import type { CatalogBook } from "@/lib/books";
import BookCover from "@/app/components/BookCover";
import styles from "./BookStore.module.css";

const PAGE_SIZE = 12;

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

  return (
    <main className={styles.storePage}>
      <div className={styles.storeTop}><Link href="/">← На главную</Link><span>Книжный магазин · Бишкек</span></div>
      <section className={styles.catalogHero}>
        <p className={styles.kicker}>КНИГИ, КОТОРЫЕ ХРАНЯТ ИСТОРИИ</p>
        <h1>Найдите свою<br /><em>следующую историю.</em></h1>
        <p>Издания о Кыргызстане, книги для детей и взрослых, подарки с характером. Каждую книгу можно рассмотреть отдельно.</p>
        <div className={styles.heroMeta}><span>КАТАЛОГ РАРИТЕТ</span><span>{books.length} ИЗДАНИЙ</span><span>ЦЕНЫ В СОМах</span></div>
      </section>
      {books.every((book) => Number(book.id) < 0) && <p className={styles.demoNote}>Показан предварительный каталог. Наличие и параметры издания уточняйте в магазине.</p>}
      <section className={styles.catalogSection}>
        <div className={styles.catalogHeading}><div><p className={styles.kicker}>ВЫБЕРИТЕ ПО НАСТРОЕНИЮ</p><h2>Книжная полка</h2></div><span>{filtered.length} {filtered.length === 1 ? "книга" : "книг"}</span></div>
        <div className={styles.controls}>
          <label className={styles.search}><Search size={17} /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Название, автор или тема" aria-label="Поиск по книгам" />{query && <button type="button" onClick={() => { setQuery(""); setPage(1); }} aria-label="Очистить поиск">×</button>}</label>
          <label className={styles.sort}><ArrowDownWideNarrow size={16} /><select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }} aria-label="Сортировка"><option value="featured">Рекомендуем</option><option value="price-asc">Сначала дешевле</option><option value="price-desc">Сначала дороже</option><option value="title">По названию</option></select></label>
        </div>
        <div className={styles.categoryChips} aria-label="Категории">{categories.map((item) => <button type="button" key={item} onClick={() => { setCategory(item); setPage(1); }} className={category === item ? styles.activeChip : ""}><SlidersHorizontal size={13} />{item}</button>)}</div>
        {filtered.length ? <><div className={styles.bookGrid}>{visibleBooks.map((book, index) => <Link key={book.slug} href={`/books/${book.slug}`} className={styles.bookCard}>
          <div className={styles.bookCoverWrap}><BookCover title={book.title} author={book.author} tone={book.coverTone} image={book.coverUrl} /><span className={styles.cardNumber}>{String((page - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}</span>{book.isFeatured && <span className={styles.featured}>ВЫБОР РЕДАКЦИИ</span>}</div>
          <div className={styles.bookInfo}><span className={styles.bookCategory}>{book.category}</span><h3>{book.title}</h3><p>{book.author || book.publisher || "Издательство Раритет"}</p><div className={styles.bookPrice}><strong>{new Intl.NumberFormat("ru-RU").format(book.priceKgs)} сом</strong><span>{book.stock === null ? "Наличие уточняйте" : book.stock > 0 ? "В наличии" : "Нет в наличии"}</span></div><span className={styles.detailsLink}>О книге <ArrowRight size={15} /></span></div>
        </Link>)}</div>{pageCount > 1 && <nav className={styles.pagination} aria-label="Страницы каталога"><button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} aria-label="Предыдущая страница"><ArrowLeft size={16} /> Назад</button><span>Страница {page} из {pageCount}</span><button type="button" onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={page === pageCount} aria-label="Следующая страница">Дальше <ArrowRight size={16} /></button></nav>}</> : <div className={styles.empty}><span>⌕</span><h3>Такой книги пока нет</h3><p>Попробуйте другое название или выберите все книги.</p><button type="button" onClick={() => { setQuery(""); setCategory("Все книги"); setPage(1); }}>Сбросить фильтры</button></div>}
      </section>
      <footer className={styles.storeFooter}><Link href="/">Раритет</Link><span>Книги о местах и людях, которых хочется помнить.</span><a href="https://www.instagram.com/raritet_kg/" target="_blank" rel="noreferrer">Instagram ↗</a></footer>
    </main>
  );
}
