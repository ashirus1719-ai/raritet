import Link from "next/link";
import { ArrowLeft, BookOpen, CalendarDays, Languages, Layers3 } from "lucide-react";
import type { Book } from "@/lib/books";
import BookCover from "@/app/components/BookCover";
import BookPurchaseForm from "@/app/components/BookPurchaseForm";
import styles from "./BookStore.module.css";

export default function BookDetail({ book, related }: { book: Book; related: Book[] }) {
  const details = [
    ["Автор", book.author], ["Издательство", book.publisher], ["Год издания", book.publicationYear], ["Количество страниц", book.pages],
    ["Язык", book.language], ["Переплёт", book.binding], ["ISBN", book.isbn],
  ].filter((entry) => entry[1]);
  return (
    <main className={styles.detailPage}>
      <div className={styles.storeTop}><Link href="/books"><ArrowLeft size={15} /> В каталог</Link><span>РАРИТЕТ · КНИЖНЫЙ МАГАЗИН</span></div>
      <nav className={styles.breadcrumb} aria-label="Хлебные крошки"><Link href="/">Главная</Link><span>/</span><Link href="/books">Книги</Link><span>/</span><span>{book.category}</span></nav>
      <section className={styles.detailHero}>
        <div className={styles.detailArt}><BookCover title={book.title} author={book.author} tone={book.coverTone} image={book.coverUrl} /><span className={styles.artCaption}>ИЗДАНИЕ · {book.publisher || "РАРИТЕТ"}</span></div>
        <div className={styles.detailCopy}><p className={styles.kicker}>{book.category.toUpperCase()}</p><h1>{book.title}</h1>{book.author && <p className={styles.detailAuthor}>Книга {book.author}</p>}<p className={styles.detailDescription}>{book.description || "Книга из каталога Раритет. Подробности об издании можно уточнить у сотрудников магазина."}</p>
          <div className={styles.detailPrice}><strong>{new Intl.NumberFormat("ru-RU").format(book.priceKgs)} <small>сом</small></strong>{book.oldPriceKgs && <del>{new Intl.NumberFormat("ru-RU").format(book.oldPriceKgs)} сом</del>}</div>
          <div className={styles.availability}><span className={book.stock === null ? styles.statusUnknown : book.stock > 0 ? styles.statusAvailable : styles.statusUnavailable} />{book.stock === null ? "Уточните наличие у магазина" : book.stock > 0 ? `В наличии: ${book.stock} шт.` : "Сейчас нет в наличии"}</div>
          <BookPurchaseForm slug={book.slug} stock={book.stock} />
          <p className={styles.smallPrint}>Вопросы о наличии и самовывозе: <a href="tel:+996312664524">+996 312 664 524</a>.</p>
          {details.length > 0 && <div className={styles.detailSpecs}><div className={styles.specTitle}><span>01</span><strong>Об этом издании</strong></div>{details.map(([label, value]) => <div className={styles.specRow} key={String(label)}><span>{label}</span><strong>{value}</strong></div>)}</div>}
        </div>
      </section>
      <section className={styles.editorNote}><BookOpen size={21} /><div><span>ОТ РЕДАКЦИИ</span><p>В Раритете книги находят читателей уже не одно десятилетие. Если вы ищете похожее издание, сотрудники магазина помогут подобрать его на месте.</p></div></section>
      {related.length > 0 && <section className={styles.related}><div className={styles.catalogHeading}><div><p className={styles.kicker}>ЕЩЁ ИСТОРИИ</p><h2>Посмотрите также</h2></div><Link href="/books">Весь каталог →</Link></div><div className={styles.relatedGrid}>{related.slice(0, 3).map((item) => <Link key={item.slug} href={`/books/${item.slug}`}><BookCover title={item.title} author={item.author} tone={item.coverTone} image={item.coverUrl} compact /><span>{item.category}</span><strong>{item.title}</strong></Link>)}</div></section>}
      <footer className={styles.storeFooter}><Link href="/">Раритет</Link><span><CalendarDays size={14} /> С 1992 года · Бишкек</span><span><Languages size={14} /> Книги на разных языках</span><Layers3 size={15} /></footer>
    </main>
  );
}
