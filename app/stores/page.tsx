import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Landmark, Link2, MapPin, Phone } from "lucide-react";
import styles from "./stores.module.css";

export const metadata: Metadata = {
  title: "Магазины в Бишкеке | Раритет",
  description: "Адреса, контакты и часы работы книжных магазинов «Раритет» в Бишкеке. Выберите удобный филиал и приезжайте за книгами.",
};

const stores = [
  {
    name: "Площадь Ала-Тоо",
    address: "ул. Пушкина, 78",
    phone: "+996 312 66-45-24",
    hours: "Пн-Вс: 10:00 — 18:00",
    features: ["Магазин", "Музей прикладного искусства"],
    description: "Наш главный магазин в историческом центре города. Здесь вы найдете самый широкий выбор книг о Кыргызстане, детской литературы и подарочных изданий. На территории магазина работает музей прикладного искусства.",
    mapLink: "https://maps.google.com/?q=Раритет,+ул.+Пушкина+78,+Бишкек",
  },
  {
    name: "Проспект Чуй",
    address: "пр. Чуй, 271",
    phone: "+996 312 34-19-78",
    hours: "Пн-Сб: 9:00 — 19:00, Вс: 10:00 — 18:00",
    features: ["Книжный магазин"],
    description: "Магазин расположен в центре города, недалеко от главных достопримечательностей. Удобная транспортная доступность и большой выбор художественной литературы и классики.",
    mapLink: "https://maps.google.com/?q=Раритет,+пр.+Чуй+271,+Бишкек",
  },
  {
    name: "Asia Mall",
    address: "ТРЦ «Азия Mall», 2 этаж",
    phone: "+996 312 97-55-42",
    hours: "Пн-Вс: 10:00 — 22:00",
    features: ["Книжный магазин", "Торговый центр"],
    description: "Удобное расположение в популярном торговом центре. Широкий выбор современной литературы, детских книг и бестселлеров. Работаем до позднего вечера без выходных.",
    mapLink: "https://maps.google.com/?q=Asia+Mall,+Бишкек",
  },
];

export default function StoresPage() {
  return (
    <main className={styles.storesPage}>
      <header className={styles.pageHeader}>
        <div className={styles.container}>
          <Link href="/" className={styles.backLink}>← Главная</Link>
          <div className={styles.headerContent}>
            <div className={styles.headerBadge}>
              <MapPin size={18} />
              <span>БИШКЕК</span>
            </div>
            <h1>Наши магазины</h1>
            <p className={styles.lead}>Выберите удобный адрес и приезжайте за новыми книгами и впечатлениями</p>
          </div>
        </div>
      </header>

      <section className={styles.storesSection}>
        <div className={styles.container}>
          <div className={styles.storesGrid}>
            {stores.map((store, index) => (
              <article key={store.name} className={styles.storeCard}>
                <div className={styles.storeHeader}>
                  <div className={styles.storeNumber}>{String(index + 1).padStart(2, "0")}</div>
                  <div className={styles.storeFeatures}>
                    {store.features.map((feature) => (
                      <span key={feature} className={styles.featureBadge}>{feature}</span>
                    ))}
                  </div>
                </div>

                <h2>{store.name}</h2>
                <p className={styles.storeDescription}>{store.description}</p>

                <div className={styles.storeDetails}>
                  <div className={styles.detailRow}>
                    <MapPin size={18} />
                    <div>
                      <span className={styles.detailLabel}>Адрес</span>
                      <strong>{store.address}</strong>
                    </div>
                  </div>

                  <div className={styles.detailRow}>
                    <Clock size={18} />
                    <div>
                      <span className={styles.detailLabel}>Часы работы</span>
                      <strong>{store.hours}</strong>
                    </div>
                  </div>

                  <div className={styles.detailRow}>
                    <Phone size={18} />
                    <div>
                      <span className={styles.detailLabel}>Телефон</span>
                      <a href={`tel:${store.phone.replace(/[^+\d]/g, "")}`} className={styles.phoneLink}>
                        {store.phone}
                      </a>
                    </div>
                  </div>
                </div>

                <div className={styles.storeActions}>
                  <a href={store.mapLink} target="_blank" rel="noopener noreferrer" className={`${styles.actionButton} ${styles.primary}`}>
                    <MapPin size={16} />
                    Построить маршрут
                  </a>
                  <a href={`tel:${store.phone.replace(/[^+\d]/g, "")}`} className={`${styles.actionButton} ${styles.secondary}`}>
                    <Phone size={16} />
                    Позвонить
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.infoSection}>
        <div className={styles.container}>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <Clock size={32} strokeWidth={1.5} />
              <h3>Актуальный график</h3>
              <p>Перед визитом рекомендуем уточнить время работы по телефону, так как в праздничные дни график может меняться.</p>
            </div>

            <div className={styles.infoCard}>
              <Landmark size={32} strokeWidth={1.5} />
              <h3>Музей на Ала-Тоо</h3>
              <p>В магазине на площади Ала-Тоо работает музей прикладного искусства. Посещение бесплатное в часы работы магазина.</p>
            </div>

            <div className={styles.infoCard}>
              <Phone size={32} strokeWidth={1.5} />
              <h3>Консультация по телефону</h3>
              <p>Позвоните нам, чтобы уточнить наличие конкретной книги, узнать о новинках или задать любые вопросы.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.contactContent}>
            <h2>Не нашли нужную книгу?</h2>
            <p>Позвоните в любой из наших магазинов, и сотрудники помогут подобрать издание или примут заказ на поиск книги.</p>
            <div className={styles.contactButtons}>
              <Link href="/books" className={styles.contactBtn}>
                Посмотреть каталог
              </Link>
              <a href="https://www.instagram.com/raritet_kg/" target="_blank" rel="noopener noreferrer" className={`${styles.contactBtn} ${styles.secondary}`}>
                <Link2 size={16} />
                Instagram
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
