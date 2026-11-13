import { prisma } from "@/lib/prisma";
import { clearCatalogBooksCache } from "@/lib/books";
import { isValidSession } from "@/lib/admin-auth";
import { cookies } from "next/headers";

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
    return Response.json({ books }, { headers: { "Cache-Control": "no-store" } });
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

    return Response.json({ book }, { status: 201 });
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
    const { id, ...updateData } = data;

    // Преобразуем строковые значения в числа где нужно
    const processedData: any = { ...updateData };
    if (updateData.publicationYear) processedData.publicationYear = parseInt(updateData.publicationYear);
    if (updateData.pages) processedData.pages = parseInt(updateData.pages);
    if (updateData.priceKgs) processedData.priceKgs = parseInt(updateData.priceKgs);
    if (updateData.oldPriceKgs) processedData.oldPriceKgs = parseInt(updateData.oldPriceKgs);
    if (updateData.stock !== undefined) processedData.stock = updateData.stock ? parseInt(updateData.stock) : null;
    if (updateData.sortOrder) processedData.sortOrder = parseInt(updateData.sortOrder);

    const book = await prisma.raritetBook.update({
      where: { id: BigInt(id) },
      data: processedData,
    });

    clearCatalogBooksCache();

    return Response.json({ book });
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
