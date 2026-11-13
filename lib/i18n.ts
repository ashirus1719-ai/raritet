export type Locale = 'ru' | 'ky' | 'en';

export const locales: Locale[] = ['ru', 'ky', 'en'];

export const localeNames: Record<Locale, string> = {
  ru: 'Русский',
  ky: 'Кыргызча',
  en: 'English',
};

export const translations = {
  ru: {
    // Header
    catalog: 'Каталог',
    about: 'О магазине',
    stores: 'Адреса',
    contact: 'Связаться',
    
    // Hero
    bookstoreLine: 'Книжный магазин и издательство в Бишкеке',
    since1992: 'КНИЖНЫЙ МАГАЗИН · С 1992 ГОДА',
    heroTitle: 'Истории, которые остаются.',
    heroDescription: 'Книги для любопытных. Издания о Кыргызстане. Место, где читатель всегда найдёт что-то своё.',
    findBook: 'Найти свою книгу',
    chooseStore: 'Выбрать магазин',
    bookTradition: 'Книжная традиция и культура Кыргызстана',
    
    // Categories
    categoriesTitle: 'Выберите своё направление.',
    categoriesSubtitle: 'От первого самостоятельного чтения до книг, к которым возвращаются снова.',
    category1: 'Художественная литература',
    category1Note: 'Классика и современные авторы',
    category2: 'Детские книги',
    category2Note: 'Большие открытия для юных читателей',
    category3: 'Кыргызстан и культура',
    category3Note: 'История, традиции и природа',
    category4: 'Подарочные издания',
    category4Note: 'Альбомы, карты и путеводители',
    askInStore: 'Уточнить в магазине',
    
    // About
    ourHistory: 'НАША ИСТОРИЯ',
    aboutTitle: 'Больше, чем книжный магазин.',
    aboutText1: '«Раритет» объединяет книжную торговлю и издательское дело. Мы выпускаем подарочные альбомы о природе, традициях и искусстве Кыргызстана, карты, путеводители и книги для детей.',
    aboutText2: 'В магазине на площади Ала-Тоо работает выставка прикладного искусства кыргызского народа. Здесь можно не только выбрать книгу, но и ближе познакомиться с культурой страны.',
    
    // Stores
    storesTitle: 'Заходите в гости.',
    storesSubtitle: 'Выберите удобный адрес и уточните наличие книг по телефону.',
    storeNote: 'Перед поездкой уточните актуальный график работы по телефону.',
    
    // Contact
    nextBook: 'ВАША СЛЕДУЮЩАЯ КНИГА ЖДЁТ',
    contactTitle: 'Найдём историю для вас.',
    callStore: 'Позвонить в магазин',
    
    // Footer
    footerText: 'Книги, культура и Кыргызстан. С 1992 года.',
    copyright: '© Раритет, Бишкек',
    
    // Common
    instagram: 'Instagram',
    phone: 'Телефон',
  },
  
  ky: {
    // Header
    catalog: 'Каталог',
    about: 'Биз жөнүндө',
    stores: 'Дареги',
    contact: 'Байланышуу',
    
    // Hero
    bookstoreLine: 'Бишкектеги китеп дүкөнү жана басмакана',
    since1992: 'КИТЕП ДҮКӨНҮ · 1992-ЖЫЛДАН БЕРИ',
    heroTitle: 'Калган окуялар.',
    heroDescription: 'Кызыктуулар үчүн китептер. Кыргызстан жөнүндөгү басылмалар. Окурман ар дайым өзүнө керектүүнү таба турган жер.',
    findBook: 'Китебин табуу',
    chooseStore: 'Дүкөн тандоо',
    bookTradition: 'Китеп салты жана Кыргызстандын маданияты',
    
    // Categories
    categoriesTitle: 'Өз багытыңызды тандаңыз.',
    categoriesSubtitle: 'Биринчи өз алдынча окуудан кайра кайрылган китептерге чейин.',
    category1: 'Көркөм адабият',
    category1Note: 'Классика жана учурдагы авторлор',
    category2: 'Балдар китептери',
    category2Note: 'Жаш окурмандар үчүн чоң ачылыштар',
    category3: 'Кыргызстан жана маданият',
    category3Note: 'Тарых, салттар жана жаратылыш',
    category4: 'Белек китептери',
    category4Note: 'Альбомдор, карталар жана гиддер',
    askInStore: 'Дүкөндөн сураңыз',
    
    // About
    ourHistory: 'БИЗДИН ТАРЫХ',
    aboutTitle: 'Китеп дүкөнүнөн ашкан.',
    aboutText1: '«Раритет» китеп соодасын жана басма ишин бириктирет. Биз Кыргызстандын жаратылышы, салттары жана искусствосу жөнүндө белек альбомдорду, карталарды, гиддерди жана балдар китептерин чыгарабыз.',
    aboutText2: 'Ала-Тоо аянтындагы дүкөндө кыргыз элинин колөнөр искусствосунун көргөзмөсү иштейт. Бул жерде китеп тандоо менен кошо өлкөнүн маданиятын жакындан таанууга болот.',
    
    // Stores
    storesTitle: 'Кош келиңиздер.',
    storesSubtitle: 'Ыңгайлуу даректи тандап, телефон аркылуу китептердин барын тактаңыз.',
    storeNote: 'Баруудан мурун телефон аркылуу иш графигин тактаңыз.',
    
    // Contact
    nextBook: 'СИЗДИН КИЙИНКИ КИТЕБИҢИЗ КҮТҮП ТУРАТ',
    contactTitle: 'Сиз үчүн китеп табабыз.',
    callStore: 'Дүкөнгө чалуу',
    
    // Footer
    footerText: 'Китептер, маданият жана Кыргызстан. 1992-жылдан бери.',
    copyright: '© Раритет, Бишкек',
    
    // Common
    instagram: 'Instagram',
    phone: 'Телефон',
  },
  
  en: {
    // Header
    catalog: 'Catalog',
    about: 'About Us',
    stores: 'Locations',
    contact: 'Contact',
    
    // Hero
    bookstoreLine: 'Bookstore and Publishing House in Bishkek',
    since1992: 'BOOKSTORE · SINCE 1992',
    heroTitle: 'Stories that remain.',
    heroDescription: 'Books for the curious. Publications about Kyrgyzstan. A place where every reader will find something special.',
    findBook: 'Find Your Book',
    chooseStore: 'Choose a Store',
    bookTradition: 'Book tradition and culture of Kyrgyzstan',
    
    // Categories
    categoriesTitle: 'Choose your direction.',
    categoriesSubtitle: 'From first independent reading to books you return to again and again.',
    category1: 'Fiction',
    category1Note: 'Classics and contemporary authors',
    category2: "Children's Books",
    category2Note: 'Great discoveries for young readers',
    category3: 'Kyrgyzstan & Culture',
    category3Note: 'History, traditions and nature',
    category4: 'Gift Editions',
    category4Note: 'Albums, maps and travel guides',
    askInStore: 'Ask in Store',
    
    // About
    ourHistory: 'OUR STORY',
    aboutTitle: 'More than a bookstore.',
    aboutText1: 'Raritet combines book trade and publishing. We publish gift albums about the nature, traditions and art of Kyrgyzstan, maps, guides and children\'s books.',
    aboutText2: 'At our store on Ala-Too Square, there is an exhibition of Kyrgyz folk crafts. Here you can not only choose a book, but also get to know the country\'s culture better.',
    
    // Stores
    storesTitle: 'Come visit us.',
    storesSubtitle: 'Choose a convenient address and check book availability by phone.',
    storeNote: 'Please confirm opening hours by phone before visiting.',
    
    // Contact
    nextBook: 'YOUR NEXT BOOK AWAITS',
    contactTitle: "We'll find a story for you.",
    callStore: 'Call the Store',
    
    // Footer
    footerText: 'Books, culture and Kyrgyzstan. Since 1992.',
    copyright: '© Raritet, Bishkek',
    
    // Common
    instagram: 'Instagram',
    phone: 'Phone',
  },
};

export function getTranslation(locale: Locale, key: keyof typeof translations.ru): string {
  return translations[locale][key] || translations.ru[key];
}
