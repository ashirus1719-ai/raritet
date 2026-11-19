import { prisma } from "@/lib/prisma";

import { defaultContent, type ContentKey, type SiteContent } from "@/lib/site-content-defaults";

export * from "@/lib/site-content-defaults";

// Читает блок контента из БД; если записи нет или БД недоступна — отдаёт значения по умолчанию.
export async function getContent<K extends ContentKey>(key: K): Promise<SiteContent[K]> {
  try {
    const row = await prisma.raritetStoreSetting.findUnique({ where: { settingKey: key } });
    if (row && row.settingValue && typeof row.settingValue === "object") {
      return { ...defaultContent[key], ...(row.settingValue as object) } as SiteContent[K];
    }
  } catch (error) {
    console.error("[SITE_CONTENT]", key, error);
  }
  return defaultContent[key];
}

export async function setContent(key: ContentKey, value: unknown) {
  const json = JSON.parse(JSON.stringify(value));
  await prisma.raritetStoreSetting.upsert({
    where: { settingKey: key },
    create: { settingKey: key, settingValue: json },
    update: { settingValue: json },
  });
}
