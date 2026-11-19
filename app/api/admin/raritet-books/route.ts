import { prisma } from "@/lib/prisma";
import { clearCatalogBooksCache } from "@/lib/books";
import { isValidSession } from "@/lib/admin-auth";
import { cookies } from "next/headers";

type BookRow = { id: bigint };
const ser = <T extends BookRow>(b: T) => ({ ...b, id: b.id.toString() });
const int = (v: unknown) => (v === "" || v === null || v === undefined ? null : parseInt(String(v), 10));
const str = (v: unknown) => (v === "" || v === null || v === undefined ? null : String(v));

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value || null;
  
  if (!isValidSession(session)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const books = await prisma.raritetBook.findMany({
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "desc" },
      ],
    });
    return Response.json({ books: books.map(ser) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[ADMIN_BOOKS_GET]", error);
    return Response.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value || null;
  
  if (!isValidSession(session)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    const book = await prisma.raritetBook.create({
      data: {
        slug: data.slug,
        title: data.title,
        author: data.author || null,
        description: data.description || "",
        publisher: data.publisher || null,
        publicationYear: data.publicationYear ? parseInt(data.publicationYear) : null,
        pages: data.pages ? parseInt(data.pages) : null,
        language: data.language || null,
        binding: data.binding || null,
        isbn: data.isbn || null,
        category: data.category || "Без категории",
        priceKgs: parseInt(data.priceKgs),
        oldPriceKgs: data.oldPriceKgs ? parseInt(data.oldPriceKgs) : null,
        stock: data.stock ? parseInt(data.stock) : null,
        coverUrl: data.coverUrl || null,
        coverTone: data.coverTone || "forest",
        isFeatured: data.isFeatured || false,
        isPublished: data.isPublished || false,
        sortOrder: data.sortOrder ? parseInt(data.sortOrder) : 100,
      },
    });

    clearCatalogBooksCache();

    return Response.json({ book: ser(book) }, { status: 201 });
  } catch (error) {
    console.error("[ADMIN_BOOKS_POST]", error);
    return Response.json({ error: "Failed to create book" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value || null;
  
  if (!isValidSession(session)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { id } = data;
    const patch: Record<string, unknown> = {};
    for (const k of ["slug", "title", "description", "category", "coverTone"]) if (data[k] !== undefined) patch[k] = String(data[k]);
    for (const k of ["author", "publisher", "language", "binding", "isbn", "coverUrl"]) if (data[k] !== undefined) patch[k] = str(data[k]);
    for (const k of ["publicationYear", "pages", "oldPriceKgs", "stock"]) if (data[k] !== undefined) patch[k] = int(data[k]);
    if (data.priceKgs !== undefined) patch.priceKgs = int(data.priceKgs) ?? 0;
    if (data.sortOrder !== undefined) patch.sortOrder = int(data.sortOrder) ?? 100;
    if (data.isFeatured !== undefined) patch.isFeatured = !!data.isFeatured;
    if (data.isPublished !== undefined) patch.isPublished = !!data.isPublished;

    const book = await prisma.raritetBook.update({
      where: { id: BigInt(id) },
      data: patch,
    });

    clearCatalogBooksCache();

    return Response.json({ book: ser(book) });
  } catch (error) {
    console.error("[ADMIN_BOOKS_PUT]", error);
    return Response.json({ error: "Failed to update book" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value || null;
  
  if (!isValidSession(session)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return Response.json({ error: "Book ID required" }, { status: 400 });
    }

    await prisma.raritetBook.delete({
      where: { id: BigInt(id) },
    });

    clearCatalogBooksCache();

    return Response.json({ success: true });
  } catch (error) {
    console.error("[ADMIN_BOOKS_DELETE]", error);
    return Response.json({ error: "Failed to delete book" }, { status: 500 });
  }
}
