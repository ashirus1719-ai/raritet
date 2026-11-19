import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BookDetail from "@/app/components/BookDetail";
import { getBookBySlug, getCatalogBooks } from "@/lib/books";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  return book ? { title: `${book.title} | Раритет`, description: book.description } : { title: "Книга не найдена | Раритет" };
}

export default async function BookPage({ params }: Props) {
  const { slug } = await params;
  const [book, books] = await Promise.all([getBookBySlug(slug), getCatalogBooks()]);
  if (!book) notFound();
  return <BookDetail book={book} related={books.filter((item) => item.slug !== slug)} />;
}
