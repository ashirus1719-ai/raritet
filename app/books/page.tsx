import type { Metadata } from "next";
import BookCatalog from "@/app/components/BookCatalog";
import { getCatalogBooks } from "@/lib/books";

export const metadata: Metadata = {
  title: "Книги и каталог | Раритет",
  description: "Книги и издания магазина Раритет в Бишкеке.",
};

export default async function BooksPage() {
  const books = await getCatalogBooks();
  return <BookCatalog books={books} />;
}
