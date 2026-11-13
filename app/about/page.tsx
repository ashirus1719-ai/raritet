import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Calendar, Globe2, Heart, Landmark, Link2, MapPin, Mountain, Palette, Users } from "lucide-react";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "О магазине и издательстве | Раритет",
  description: "История книжного магазина и издательства «Раритет». С 1992 года мы знакомим Бишкек с лучшими книгами и создаем собственные издания о культуре Кыргызстана.",
};

export default function AboutPage() {
  return (
    <main className={styles.aboutPage}>
      <header className={styles.pageHeader}>
        <div className={styles.container}>
          <Link href="/" className={styles.backLink}>← Главная</Link>
          <div className={styles.headerContent}>
            <div className={styles.headerBadge}>
              <Landmark size={20} />
              <span>С 1992 ГОДА</span>
            </div>
            <h1>О магазине<br />и издательстве</h1>
            <p className={styles.lead}>История, которая началась три десятилетия назад и продолжается в каждой книге</p>
          </div>
        </div>
      </header>

      <section className={styles.storySection}>
        <div className={styles.container}>
          <div className={styles.storyGrid}>
            <div className={styles.storyVisual}>
              <div className={styles.visualCard}>
                <span className={styles.visualYear}>1992</span>
                <BookOpen size={48} strokeWidth={1.5} />
                <p>Открытие книжного<br />магазина</p>
              </div>
              <div className={styles.visualCard}>
                <span className={styles.visualYear}>1997</span>
                <Palette size={48} strokeWidth={1.5} />
                <p>Основание<br />издательства</p>
              </div>
              <div className={styles.visualCard}>
                <span className={styles.visualYear}>2026</span>
                <Heart size={48} strokeWidth={1.5} />
                <p>Более 30 лет<br />с читателями</p>
              </div>
            </div>

            <div className={styles.storyContent}>
              <h2>Наша история</h2>
              <p>Книжный магазин «Раритет» открылся в 1992 году, в период становления независимости Кыргызстана. Мы начали с небольшого ассортимента, но всегда стремились предлагать книги, которые расширяют кругозор и помогают лучше узнать родную страну.</p>
              
              <p>В 1997 году было основано издательство «Раритет». Мы начали выпускать собственные книги: подарочные альбомы о природе и традициях Кыргызстана, путеводители, карты и детскую литературу. Наша цель — сохранить и популяризировать культурное наследие страны через качественные издания.</p>

              <p>Сегодня «Раритет» — это сеть магазинов в Бишкеке, собственное издательство и музей прикладного искусства. Мы продолжаем делать то, что любим: находить и создавать книги, которые становятся частью жизни наших читателей.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.valuesSection}>
        <div className={styles.container}>
          <h2>Чем мы занимаемся</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <BookOpen size={32} strokeWidth={1.5} />
              <h3>Книжная торговля</h3>
              <p>Широкий ассортимент художественной литературы, детских книг, классики и современных авторов</p>
            </div>

            <div className={styles.valueCard}>
              <Mountain size={32} strokeWidth={1.5} />
              <h3>Издания о Кыргызстане</h3>
              <p>Подарочные альбомы, книги о культуре, истории и природе страны, путеводители и карты</p>
            </div>

            <div className={styles.valueCard}>
              <Palette size={32} strokeWidth={1.5} />
              <h3>Собственное издательство</h3>
              <p>Создаем качественные книги, которые рассказывают о традициях и наследии Кыргызстана</p>
            </div>

            <div className={styles.valueCard}>
              <Landmark size={32} strokeWidth={1.5} />
              <h3>Музей прикладного искусства</h3>
              <p>В нашем магазине на площади Ала-Тоо работает выставка изделий кыргызских мастеров</p>
            </div>

            <div className={styles.valueCard}>
              <Users size={32} strokeWidth={1.5} />
              <h3>Комплектование библиотек</h3>
              <p>Помогаем школам, вузам и организациям подбирать книги для библиотечных фондов</p>
            </div>

            <div className={styles.valueCard}>
              <Heart size={32} strokeWidth={1.5} />
              <h3>Культурные события</h3>
              <p>Проводим встречи с авторами, презентации книг и другие мероприятия для любителей чтения</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.museumSection}>
        <div className={styles.container}>
          <div className={styles.museumContent}>
            <div className={styles.museumText}>
              <span className={styles.sectionBadge}>КУЛЬТУРА КЫРГЫЗСТАНА</span>
              <h2>Музей прикладного искусства</h2>
              <p>В магазине на площади Ала-Тоо работает постоянная выставка предметов прикладного искусства кыргызского народа. Здесь можно увидеть традиционные изделия мастеров, узнать больше о культурных традициях и истории ремесел.</p>
              <p>Посещение музея бесплатное в часы работы магазина. Мы будем рады рассказать вам о каждом экспонате.</p>
              <Link href="/#stores" className={styles.ctaButton}>
                <MapPin size={16} />
                Адрес музея
              </Link>
            </div>
            <div className={styles.museumVisual}>
              <div className={styles.museumIcon}>
                <Landmark size={64} strokeWidth={1.2} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.linksSection}>
        <div className={styles.container}>
          <h2>Полезные ссылки</h2>
          <div className={styles.linksGrid}>
            <a href="https://books.kg/" target="_blank" rel="noopener noreferrer" className={styles.linkCard}>
              <Globe2 size={24} />
              <div>
                <h3>Официальный сайт</h3>
                <p>books.kg</p>
              </div>
              <Link2 size={16} />
            </a>

            <a href="https://www.instagram.com/raritet_kg/" target="_blank" rel="noopener noreferrer" className={styles.linkCard}>
              <Link2 size={24} />
              <div>
                <h3>Instagram</h3>
                <p>@raritet_kg</p>
              </div>
              <Link2 size={16} />
            </a>

            <Link href="/books" className={styles.linkCard}>
              <BookOpen size={24} />
              <div>
                <h3>Каталог книг</h3>
                <p>Посмотреть издания</p>
              </div>
              <Link2 size={16} />
            </Link>

            <Link href="/#stores" className={styles.linkCard}>
              <MapPin size={24} />
              <div>
                <h3>Наши магазины</h3>
                <p>Адреса и контакты</p>
              </div>
              <Link2 size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <Calendar size={40} />
            <h2>Приходите в гости</h2>
            <p>Мы работаем для вас каждый день. Выберите удобный магазин и приезжайте за новыми книгами и впечатлениями.</p>
            <Link href="/#stores" className={styles.ctaButtonLarge}>Выбрать магазин</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
