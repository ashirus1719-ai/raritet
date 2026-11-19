import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { isValidSession } from "@/lib/admin-auth";

const MAX_BYTES = 4 * 1024 * 1024; // лимит тела запроса на Vercel ~4.5 МБ

export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (!isValidSession(cookieStore.get("admin_session")?.value ?? null)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !key || !secret) {
    return Response.json({ error: "Cloudinary не настроен: задайте CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET" }, { status: 500 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return Response.json({ error: "Файл не передан" }, { status: 400 });
    if (!file.type.startsWith("image/")) return Response.json({ error: "Можно загружать только изображения" }, { status: 400 });
    if (file.size > MAX_BYTES) return Response.json({ error: "Файл больше 4 МБ — сожмите его" }, { status: 400 });

    const timestamp = String(Math.floor(Date.now() / 1000));
    const folder = "raritet";
    const signature = createHash("sha1").update(`folder=${folder}&timestamp=${timestamp}${secret}`).digest("hex");

    const body = new FormData();
    body.append("file", file);
    body.append("api_key", key);
    body.append("timestamp", timestamp);
    body.append("folder", folder);
    body.append("signature", signature);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: "POST", body });
    const data = await res.json();
    if (!res.ok) return Response.json({ error: data?.error?.message ?? "Ошибка Cloudinary" }, { status: 502 });
    return Response.json({ url: data.secure_url });
  } catch (error) {
    console.error("[ADMIN_UPLOAD]", error);
    return Response.json({ error: "Не удалось загрузить файл" }, { status: 500 });
  }
}
