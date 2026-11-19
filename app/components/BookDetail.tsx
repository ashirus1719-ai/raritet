import Link from "next/link";
import { BookOpen, Clock3, MapPin, QrCode } from "lucide-react";
import type { Book, CatalogBook } from "@/lib/books";
import BookCover from "@/app/components/BookCover";
import BookBuyBox from "@/app/components/BookBuyBox";
import BookCard from "@/app/components/BookCard";
import StoreHeader from "@/app/components/StoreHeader";
import SiteFooter from "@/app/components/SiteFooter";
import styles from "./BookStore.module.css";

const formatPrice = (value: number) => new Intl.NumberFormat("ru-RU").format(value);

export default function BookDetail({ book, related }: { book: Book; related: CatalogBook[] }) {
  const details = [
    ["Автор", book.author], ["Издательство", book.publisher], ["Год издания", book.publicationYear], ["Страниц", book.pages],
    ["Язык", book.language], ["Переплёт", book.binding], ["ISBN", book.isbn], ["Категория", book.category],
  ].filter((entry) => entry[1]);
  const discount = book.oldPriceKgs && book.oldPriceKgs > book.priceKgs ? Math.round((1 - book.priceKgs / book.oldPriceKgs) * 100) : 0;
  const facts = [book.publicationYear && `${book.publicationYear} г.`, book.pages && `${book.pages} стр.`, book.language, book.binding].filter(Boolean);
  const moreBooks = [...related.filter((item) => item.category === book.category), ...related.filter((item) => item.category !== book.category)].slice(0, 4);

  return (
    <main className={styles.detailPage}>
      <StoreHeader current="books" />
      <nav className={styles.breadcrumb} aria-label="Хлебные крошки"><Link href="/">Главная</Link><span>/</span><Link href="/books">Каталог</Link><span>/</span><span>{book.category}</span></nav>

      <section className={styles.detailHero}>
        <div className={styles.detailArt}>
          <BookCover title={book.title} author={book.author} tone={book.coverTone} image={book.coverUrl} />
          {discount > 0 && <span className={styles.discountBadge}>−{discount}%</span>}
          {book.isFeatured && <span className={styles.artFeatured}>Выбор редакции</span>}
        </div>

        <div className={styles.detailCopy}>
          <span className={styles.detailCategory}>{book.category}</span>
          <h1>{book.title}</h1>
          {book.author && <p className={styles.detailAuthor}>{book.author}</p>}
          {facts.length > 0 && <ul className={styles.detailFacts}>{facts.map((fact) => <li key={String(fact)}>{fact}</li>)}</ul>}

          <div className={styles.buyPanel}>
            <div className={styles.detailPrice}>
              <strong>{formatPrice(book.priceKgs)} <small>сом</small></strong>
              {discount > 0 && <del>{formatPrice(book.oldPriceKgs!)} сом</del>}
            </div>
            <div className={styles.availability}><span className={book.stock === null ? styles.statusUnknown : book.stock > 0 ? styles.statusAvailable : styles.statusUnavailable} />{book.stock === null ? "Наличие уточняйте у магазина" : book.stock > 0 ? `В наличии: ${book.stock} шт.` : "Сейчас нет в наличии"}</div>
            <BookBuyBox book={{ slug: book.slug, title: book.title, author: book.author, priceKgs: book.priceKgs, coverUrl: book.coverUrl, coverTone: book.coverTone, stock: book.stock }} />
            <ul className={styles.perks}>
              <li><MapPin size={17} aria-hidden="true" /><span><strong>Самовывоз</strong> из магазина «Раритет» в Бишкеке</span></li>
              <li><QrCode size={17} aria-hidden="true" /><span><strong>Оплата онлайн</strong> через Finik QR</span></li>
              <li><Clock3 size={17} aria-hidden="true" /><span><strong>30 минут на оплату</strong> после оформления заказа</span></li>
            </ul>
          </div>
          <p className={styles.smallPrint}>Вопросы о наличии: <a href="tel:+996312664524">+996 312 664 524</a></p>
        </div>
      </section>

      <section className={styles.detailInfo}>
        <article className={styles.detailAbout}>
          <h2>О книге</h2>
          <p className={styles.detailDescription}>{book.description || "Книга из каталога Раритет. Подробности об издании можно уточнить у сотрудников магазина."}</p>
          <blockquote className={styles.editorNote}><BookOpen size={20} aria-hidden="true" /><p>В Раритете книги находят читателей с 1992 года. Если ищете похожее издание — сотрудники магазина помогут подобрать его.</p></blockquote>
        </article>
        {details.length > 0 && <aside className={styles.detailSpecs}>
          <h2>Характеристики</h2>
          <dl>{details.map(([label, value]) => <div className={styles.specRow} key={String(label)}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        </aside>}
      </section>

      {moreBooks.length > 0 && <section className={styles.related}>
        <div className={styles.catalogHeading}><div><p className={styles.kicker}>ЕЩЁ ИСТОРИИ</p><h2>Посмотрите также</h2></div><Link href="/books">Весь каталог →</Link></div>
        <div className={styles.bookGrid}>{moreBooks.map((item) => <BookCard key={item.slug} book={item} />)}</div>
      </section>}
      <SiteFooter />
    </main>
  );
}
