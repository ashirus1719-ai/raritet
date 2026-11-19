import Link from "next/link";
import type { CatalogBook } from "@/lib/books";
import BookCover from "@/app/components/BookCover";
import AddToCartButton from "@/app/components/AddToCartButton";
import styles from "./BookStore.module.css";

export type BookCardData = Pick<CatalogBook, "slug" | "title" | "author" | "publisher" | "priceKgs" | "stock" | "coverUrl" | "coverTone" | "isFeatured">;

export default function BookCard({ book, number }: { book: BookCardData; number?: number }) {
  const href = `/books/${book.slug}`;
  return (
    <article className={styles.bookCard}>
      <Link href={href} className={styles.bookCoverWrap} tabIndex={-1} aria-hidden="true">
        <BookCover title={book.title} author={book.author} tone={book.coverTone} image={book.coverUrl} />
        {number !== undefined && <span className={styles.cardNumber}>{String(number).padStart(2, "0")}</span>}
        {book.isFeatured && <span className={styles.featured}>ВЫБОР РЕДАКЦИИ</span>}
      </Link>
      <div className={styles.bookInfo}>
        <h3><Link href={href}>{book.title}</Link></h3>
        <p>{book.author || book.publisher || "Издательство Раритет"}</p>
        <div className={styles.bookPrice}>
          <strong>{new Intl.NumberFormat("ru-RU").format(book.priceKgs)} сом</strong>
          <span>{book.stock === null ? "Наличие уточняйте" : book.stock > 0 ? "В наличии" : "Нет в наличии"}</span>
        </div>
        <div className={styles.cardActions}>
          <AddToCartButton book={{ slug: book.slug, title: book.title, author: book.author, priceKgs: book.priceKgs, coverUrl: book.coverUrl, coverTone: book.coverTone, stock: book.stock }} />
          <Link href={href} className={styles.cardDetails}>О книге</Link>
        </div>
      </div>
    </article>
  );
}
