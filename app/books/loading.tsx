import styles from "@/app/components/BookStore.module.css";

export default function LoadingBooks() {
  return (
    <main className={styles.storePage} aria-label="Загружаем каталог книг" aria-busy="true">
      <div className={styles.storeTop}><span>← На главную</span><span>Книжный магазин · Бишкек</span></div>
      <section className={styles.catalogHero} aria-hidden="true">
        <p className={styles.kicker}>КАТАЛОГ РАРИТЕТ</p>
        <div className={`${styles.loadingLine} ${styles.loadingHeroLine}`} />
        <div className={`${styles.loadingLine} ${styles.loadingHeroText}`} />
      </section>
      <section className={styles.catalogSection} aria-hidden="true">
        <div className={styles.catalogHeading}><div><p className={styles.kicker}>ВЫБЕРИТЕ ПО НАСТРОЕНИЮ</p><h2>Книжная полка</h2></div></div>
        <div className={`${styles.bookGrid} ${styles.loadingCardGrid}`}>
          {Array.from({ length: 8 }, (_, index) => <div key={index} className={styles.loadingCard} />)}
        </div>
      </section>
    </main>
  );
}
