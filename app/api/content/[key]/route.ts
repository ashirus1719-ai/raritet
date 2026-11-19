import { CONTENT_KEYS, getContent, type ContentKey } from "@/lib/site-content";

// Публичное чтение контента (нужно клиентским страницам, например футеру главной).
export async function GET(_: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!CONTENT_KEYS.includes(key as ContentKey)) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(await getContent(key as ContentKey), { headers: { "Cache-Control": "no-store" } });
}
