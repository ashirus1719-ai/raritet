import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Раритет — книжный магазин в Бишкеке",
    short_name: "Раритет",
    description: "Книги, издания о Кыргызстане и подарочные альбомы.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5eee4",
    theme_color: "#173f2e",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
