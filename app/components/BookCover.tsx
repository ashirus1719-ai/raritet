import styles from "./BookStore.module.css";

function sharpCover(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "images.unsplash.com") {
      parsed.searchParams.set("auto", "format");
      parsed.searchParams.set("fit", "crop");
      parsed.searchParams.set("w", "720");
      parsed.searchParams.set("q", "74");
      return parsed.toString();
    }
  } catch {
    return url;
  }
  return url;
}

export default function BookCover({ title, author, tone = "forest", image, compact = false }: {
  title: string;
  author?: string | null;
  tone?: string;
  image?: string | null;
  compact?: boolean;
}) {
  const toneClass = styles[`tone_${tone}`] ?? styles.tone_forest;

  if (image) {
    return (
      <div
        className={`${styles.cover} ${styles.coverPhoto} ${compact ? styles.coverCompact : ""}`}
        role="img"
        aria-label={`Обложка: ${title}`}
      >
        <img src={sharpCover(image)} alt="" loading="lazy" decoding="async" fetchPriority="low" />
      </div>
    );
  }

  return (
    <div className={`${styles.cover} ${toneClass} ${compact ? styles.coverCompact : ""}`} role="img" aria-label={`Обложка: ${title}`}>
      <span className={styles.coverKicker}>РАРИТЕТ · ИЗДАНИЕ</span>
      <strong>{title}</strong>
      {author && <span className={styles.coverAuthor}>{author}</span>}
      <span className={styles.coverMark}>Р</span>
    </div>
  );
}
