import { prisma } from "@/lib/prisma";

export type Book = {
  id: bigint;
  slug: string;
  title: string;
  author: string | null;
  description: string;
  publisher: string | null;
  publicationYear: number | null;
  pages: number | null;
  language: string | null;
  binding: string | null;
  isbn: string | null;
  category: string;
  priceKgs: number;
  oldPriceKgs: number | null;
  stock: number | null;
  coverUrl: string | null;
  coverTone: string;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
};

export type CatalogBook = Pick<Book,
  "slug" | "title" | "author" | "publisher" | "category" | "priceKgs" | "stock" | "coverUrl" | "coverTone" | "isFeatured"
> & { id: string };

type CatalogCache = { expiresAt: number; books: CatalogBook[] };
const globalForCatalog = globalThis as typeof globalThis & { raritetCatalogCache?: CatalogCache };

export const demoBooks: Book[] = [
  { id: BigInt(-1), slug: "neizvestnyi-kyrgyzstan", title: "Неизвестный Кыргызстан. Земля, где оставляю своё сердце", author: "Дудашвили", description: "Подарочное издание о природе и местах Кыргызстана. Уточните наличие и год издания перед заказом.", publisher: "Раритет", publicationYear: null, pages: null, language: "Русский", binding: "Твёрдый переплёт", isbn: null, category: "Кыргызстан и культура", priceKgs: 650, oldPriceKgs: null, stock: null, coverUrl: null, coverTone: "forest", isFeatured: true, isPublished: true, sortOrder: 1 },
  { id: BigInt(-2), slug: "kokomeren-stories", title: "Кокомеренские истории", author: "Ибраимов", description: "Истории, связанные с Кыргызстаном и его людьми. Уточните наличие и данные издания перед заказом.", publisher: "Раритет", publicationYear: null, pages: null, language: "Русский", binding: null, isbn: null, category: "Кыргызстан и культура", priceKgs: 800, oldPriceKgs: null, stock: null, coverUrl: null, coverTone: "terracotta", isFeatured: true, isPublished: true, sortOrder: 2 },
  { id: BigInt(-3), slug: "oliver-twist", title: "Oliver Twist / Оливер Твист", author: "Чарльз Диккенс", description: "Классический роман. Уточните язык, издательство и наличие конкретного издания.", publisher: "Бишкек", publicationYear: null, pages: null, language: "Русский", binding: null, isbn: null, category: "Классика", priceKgs: 630, oldPriceKgs: null, stock: null, coverUrl: null, coverTone: "indigo", isFeatured: false, isPublished: true, sortOrder: 3 },
  { id: BigInt(-4), slug: "sun-tzu-art-of-war", title: "Искусство войны с комментариями и иллюстрациями", author: "Сунь-Цзы", description: "Издание произведения о стратегии и военном искусстве. Уточните параметры экземпляра.", publisher: "АСТ", publicationYear: null, pages: null, language: "Русский", binding: null, isbn: null, category: "История и идеи", priceKgs: 860, oldPriceKgs: null, stock: null, coverUrl: null, coverTone: "plum", isFeatured: false, isPublished: true, sortOrder: 4 },
  { id: BigInt(-5), slug: "bedtime-tales", title: "100 коротких сказок на ночь", author: null, description: "Сборник сказок для чтения перед сном. Уточните возрастные рекомендации и наличие.", publisher: "Росмэн", publicationYear: null, pages: null, language: "Русский", binding: null, isbn: null, category: "Детские книги", priceKgs: 740, oldPriceKgs: null, stock: null, coverUrl: null, coverTone: "ochre", isFeatured: false, isPublished: true, sortOrder: 5 },
];

export async function getBooks(options: { includeUnpublished?: boolean } = {}) {
  try {
    const books = await prisma.raritetBook.findMany({
      where: options.includeUnpublished ? {} : { isPublished: true },
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "desc" },
      ],
    });
    
    return books.length ? books : demoBooks;
  } catch (error) {
    console.error("[RARITET_BOOKS_READ]", error instanceof Error ? error.message : "Unknown error");
    return demoBooks;
  }
}

function toCatalogBook(book: Book): CatalogBook {
  return {
    id: book.id.toString(),
    slug: book.slug,
    title: book.title,
    author: book.author,
    publisher: book.publisher,
    category: book.category,
    priceKgs: book.priceKgs,
    stock: book.stock,
    coverUrl: book.coverUrl,
    coverTone: book.coverTone,
    isFeatured: book.isFeatured,
  };
}

export async function getCatalogBooks(): Promise<CatalogBook[]> {
  const cached = globalForCatalog.raritetCatalogCache;
  if (cached && cached.expiresAt > Date.now()) return cached.books;

  try {
    const books = await prisma.raritetBook.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        slug: true,
        title: true,
        author: true,
        publisher: true,
        category: true,
        priceKgs: true,
        stock: true,
        coverUrl: true,
        coverTone: true,
        isFeatured: true,
      },
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "desc" },
      ],
    });

    const catalogBooks = books.length ? books.map((book) => ({ ...book, id: book.id.toString() })) : demoBooks.map(toCatalogBook);
    globalForCatalog.raritetCatalogCache = { books: catalogBooks, expiresAt: Date.now() + 30_000 };
    return catalogBooks;
  } catch (error) {
    console.error("[RARITET_CATALOG_READ]", error instanceof Error ? error.message : "Unknown error");
    return demoBooks.map(toCatalogBook);
  }
}

export function clearCatalogBooksCache() {
  globalForCatalog.raritetCatalogCache = undefined;
}

export async function getBookBySlug(slug: string) {
  try {
    const book = await prisma.raritetBook.findFirst({
      where: {
        slug,
        isPublished: true,
      },
    });
    
    return book ?? demoBooks.find((book) => book.slug === slug) ?? null;
  } catch (error) {
    console.error("[RARITET_BOOK_READ]", error instanceof Error ? error.message : "Unknown error");
    return demoBooks.find((book) => book.slug === slug) ?? null;
  }
}
