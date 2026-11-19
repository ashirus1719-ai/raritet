// Типы и значения по умолчанию (без Prisma — можно импортировать и в клиентские компоненты).
export type Store = { name: string; address: string; hours: string; phone: string; image: string; map: string; wide?: boolean };
export type AboutStat = { icon: "book" | "users" | "map"; value: string; label: string };

export type SiteContent = {
  about: { title: string; subtitle: string; description: string; note: string; stats: AboutStat[] };
  stores: { stores: Store[]; heroDescription: string };
  contacts: { phone: string; email: string; instagram: string };
  home: {
    heroEyebrow: string; heroTitle: string; heroText: string;
    countryEyebrow: string; countryTitle: string; countryText: string;
    aboutEyebrow: string; aboutTitle: string; aboutText: string;
    museumEyebrow: string; museumTitle: string; museumText: string;
    copyright: string;
  };
};
export type ContentKey = keyof SiteContent;

export const CONTENT_KEYS: ContentKey[] = ["about", "stores", "contacts", "home"];

export const defaultContent: SiteContent = {
  about: {
    title: "О компании",
    subtitle: "Раритет — больше, чем книжный магазин",
    description: "Мы — книжный магазин «Раритет», где каждая книга находит своего читателя. Наша миссия — сохранять книжную культуру, вдохновлять на знания и создавать уютное пространство для всех, кто любит книги.",
    note: "Раритет — это традиции, которые вдохновляют",
    stats: [
      { icon: "book", value: "30+", label: "лет с вами" },
      { icon: "users", value: "50 000+", label: "довольных читателей" },
      { icon: "book", value: "100 000+", label: "книг в каталоге" },
      { icon: "map", value: "5", label: "магазинов по КР" },
    ],
  },
  stores: {
    heroDescription: "Пять книжных магазинов в Бишкеке — выберите удобный адрес.",
    stores: [
      { name: "Площадь Ала-Тоо", address: "ул. Пушкина, 78", hours: "Ежедневно 10:00–19:00", phone: "0555 790 755", image: "/images/store-ala-too.webp", map: "Раритет, ул. Пушкина 78, Бишкек" },
      { name: "Проспект Чуй", address: "пр. Чуй, 271", hours: "Ежедневно 10:00–19:00", phone: "+996 312 34-19-78", image: "/images/store-prospekt-chuy.webp", map: "Раритет, проспект Чуй 271, Бишкек" },
      { name: "ТРЦ Asia Mall", address: "пр. Чынгыза Айтматова, 3 · 1 этаж", hours: "Ежедневно 10:00–22:00", phone: "+996 312 97-55-42", image: "/images/store-asia-mall.webp", map: "Asia Mall, Бишкек" },
      { name: "ГУМ «Чынар»", address: "пр. Чуй, 92 · 4 этаж", hours: "Ежедневно 10:00–22:00", phone: "+996 312 88-24-45", image: "/images/store-gum-chynar.webp", map: "ГУМ Чынар, Бишкек" },
      { name: "ТЦ Tommi Mall", address: "ул. Аалы Токомбаева, 17/2 · 3 этаж", hours: "Ежедневно 10:00–22:00", phone: "0555 790 750", image: "/images/store-tommi-mall.webp", map: "Tommi Mall, Бишкек", wide: true },
    ],
  },
  contacts: { phone: "+996 312 66-45-24", email: "info@raritet.kg", instagram: "https://www.instagram.com/raritet_kg/" },
  home: {
    heroEyebrow: "КНИГИ И КУЛЬТУРНОЕ НАСЛЕДИЕ",
    heroTitle: "Книги, которые\nсохраняют историю",
    heroText: "Откройте для себя книги, знания\nи культурное наследие Кыргызстана",
    countryEyebrow: "ОТКРОЙТЕ СВОЮ СТРАНУ",
    countryTitle: "Книги о Кыргызстане",
    countryText: "Узнайте больше о нашей стране —\nо её природе, истории, культуре\nи людях.",
    aboutEyebrow: "КНИЖНЫЙ МИР БИШКЕКА",
    aboutTitle: "Раритет — с 1992 года",
    aboutText: "Сеть книжных магазинов «Раритет» — это любовь к книгам, уважение к знаниям и забота о культуре. Уже более 30 лет мы объединяем читателей в Кыргызстане.",
    museumEyebrow: "КУЛЬТУРНОЕ НАСЛЕДИЕ",
    museumTitle: "Музей прикладного искусства\nКыргызстана",
    museumText: "На Пушкина, 78 расположен музей\nнародного искусства, открытый для всех.",
    copyright: "Раритет. Все права защищены.",
  },
};
