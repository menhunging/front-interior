const appConf = {
  apiHost: "https://api.interior.ru",
  host: "https://interior.ru",
  hostCanonical: "https://www.interior.ru",
  title: "Экспертное медиа о дизайне, архитектуре и искусстве | INTERIOR+DESIGN",
  description:
    "Ведущее российское издание о дизайне интерьера, архитектуре и искусстве.  Ежедневная хроника индустрии, интервью с лидерами мнений, экспертные обзоры, главные тренды, проекты квартир и загородных домов на INTERIOR+DESIGN",
  ogImage: "/pictures/share.png",
  address: "123022, Россия, Москва, Рочдельская улица, 15с10",
  phone: "+74956538383",
  mainMenu: [
    {
      id: 41,
      title: "Лайфстайл",
      slug: "lifestyle",
      uri: "lifestyle",
      parent: null,
    },
    {
      id: 42,
      title: "Тренды",
      slug: "trendy",
      uri: "trendy",
      parent: null,
    },
    {
      id: 1,
      title: "Дизайн",
      slug: "design",
      uri: "design",
      parent: null,
    },
    {
      id: 2,
      title: "Архитектура",
      slug: "architecture",
      uri: "architecture",
      parent: null,
    },
    {
      id: 3,
      title: "Арт",
      slug: "art",
      uri: "art",
      parent: null,
    },
    {
      id: 8,
      title: "Интерьеры",
      slug: "place",
      uri: "place",
      parent: null,
    },
    {
      id: 9,
      title: "Журнал",
      slug: "design",
      uri: "design",
      parent: null,
    },
  ],
  staticMenu: [
    {
      caption: "О проекте",
      link: "about.html",
    },
    {
      caption: "Редакция",
      link: "staff.html",
    },
    {
      caption: "Legal info",
      link: "privacy.html",
    },
    {
      caption: "Реклама",
      link: "advert.html",
      important: true,
    },
  ],
  socialMenu: [
    {
      title: "Telegram",
      link: "https://t.me/interiorplusdesign",
      itemprop: "sameAs",
    },
    {
      title: "Pinterest",
      link: "https://ru.pinterest.com/interiorru/",
      itemprop: "sameAs",
    },
    {
      title: "VK",
      link: "https://vk.com/interiorplusdesign",
      itemprop: "sameAs",
    },
    // {
    //   title: "Zen",
    //   link: "https://zen.yandex.ru/interior.ru",
    //   itemprop: "sameAs",
    // },
  ],
  additionalMainLinks: [
    {
      title: "I+D 3.0",
      link: "/I-D_30_years/main",
      active: true,
      important: true,
    },
    {
      title: "Guide",
      link: "https://www.interior.ru/guide/moskva/places",
      active: true,
      important: true,
    },
    {
      title: "Design Now",
      link: "https://www.interior.ru/contests/21-design-now-2025/",
      important: true,
      active: true,
    },
  ],
  newJournalNumber: {
    title: "Новый номер!",
    description:
      "Новый выпуск INTERIOR+DESIGN № 4-5/2026 посвящен дизайну. Джордж Ябу и Гленн Пушельберг — об историях и эмоциях в объектах. Милан 2026 — превью и открытия. Владимир Пирожков — про креатив и искусственный интеллект. Новые авторы, создающие предметы с характером. SPECIAL 3.0. Несерьезный разговор о серьезном дизайне",
  },
  journalNumbers: [
    {
      image:
        "https://api.interior.ru/media/oblozhki-zhurnalov/i_d_30_years.png?nowebp",
    },
    {
      image:
        "https://api.interior.ru/media/oblozhki-zhurnalov/ID_2025_12.png?nowebp",
    },
    {
      image:
        "https://api.interior.ru/media/oblozhki-zhurnalov/I_D_2025_11_10.png?nowebp",
    },
    {
      image:
        "https://api.interior.ru/media/oblozhki-zhurnalov/ID_number-2025-09.png?nowebp",
    },
    {
      image:
        "https://api.interior.ru/media/oblozhki-zhurnalov/ID_2025_06.png?nowebp",
    },
    {
      image:
        "https://api.interior.ru/media/oblozhki-zhurnalov/I_D_2025_04.png?nowebp",
    },
    {
      image:
        "https://api.interior.ru/media/oblozhki-zhurnalov/I_D-2025-02.png?nowebp",
    },
    {
      image:
        "https://api.interior.ru/media/oblozhki-zhurnalov/2024_12_gold.png?nowebp",
    },
    {
      image:
        "https://api.interior.ru/media/oblozhki-zhurnalov/2024_1-2.png?nowebp",
    },
    {
      image:
        "https://api.interior.ru/media/oblozhki-zhurnalov/2024-10-20.png?nowebp",
    },
    {
      image:
        "https://api.interior.ru/media/oblozhki-zhurnalov/2023_12_gold.png?nowebp",
    },
    {
      image:
        "https://api.interior.ru/media/oblozhki-zhurnalov/ID_2023_03.png?nowebp",
    },
    {
      image:
        "https://api.interior.ru/media/oblozhki-zhurnalov/ID_2023_03_10.png?nowebp",
    },
    {
      image:
        "https://api.interior.ru/media/oblozhki-zhurnalov/ID_2023_1_KO.png?nowebp",
    },
    {
      image:
        "https://api.interior.ru/media/oblozhki-zhurnalov/ID_2022_11_20.png?nowebp",
    },
    {
      image:
        "https://api.interior.ru/media/oblozhki-zhurnalov/2022_09_KO.png?nowebpp",
    },
    {
      image:
        "https://api.interior.ru/media/oblozhki-zhurnalov/2022_09_art.png?nowebp",
    },
    {
      image:
        "https://api.interior.ru/media/oblozhki-zhurnalov/2022-02-1.png?nowebp",
    },
    {
      image:
        "https://api.interior.ru/media/oblozhki-zhurnalov/2022-02-2.png?nowebp",
    },
    {
      image:
        "https://api.interior.ru/media/oblozhki-zhurnalov/2022-02-3.png?nowebp",
    },
    {
      image:
        "https://api.interior.ru/media/oblozhki-zhurnalov/2022-02-4.png?nowebp",
    },
    {
      image:
        "https://api.interior.ru/media/oblozhki-zhurnalov/2021-12-4.png?nowebp",
    },
    {
      image:
        "https://api.interior.ru/media/oblozhki-zhurnalov/2021-12-2.png?nowebp",
    },
    {
      image:
        "https://api.interior.ru/media/oblozhki-zhurnalov/2021-12-3.png?nowebp",
    },
    {
      image:
        "https://api.interior.ru/media/oblozhki-zhurnalov/mag-LATEST.png?nowebp",
    },
    {
      image:
        "https://api.interior.ru/media/oblozhki-zhurnalov/2021-10-11.png?nowebp",
    },
    {
      image:
        "https://api.interior.ru/media/oblozhki-zhurnalov/Screenshot-2021-08-30-at-15.07.18.png",
    },
    {
      image:
        "https://api.interior.ru/media/oblozhki-zhurnalov/Screenshot-2021-08-30-at-15.07.27.png",
    },
    {
      image:
        "https://api.interior.ru/media/oblozhki-zhurnalov/Screenshot-2021-08-30-at-15.07.33.png",
    },
    {
      image: "https://api.interior.ru/media/oblozhki-zhurnalov/2021-art-4.png",
    },
    {
      image: "https://api.interior.ru/media/oblozhki-zhurnalov/2021-art-1.png",
    },
    {
      image: "https://api.interior.ru/media/oblozhki-zhurnalov/2021-art-3.png",
    },
    {
      image: "https://api.interior.ru/media/oblozhki-zhurnalov/2021-art-2.png",
    },
    {
      image:
        "https://api.interior.ru/media/oblozhki-zhurnalov/m-09-040-2021_1.png",
    },
    {
      image:
        "https://api.interior.ru/media/oblozhki-zhurnalov/m-09-040-2021_2.png",
    },
    {
      image:
        "https://api.interior.ru/media/oblozhki-zhurnalov/m-09-040-2021_3.png",
    },
    {
      image:
        "https://api.interior.ru/media/oblozhki-zhurnalov/m-09-040-2021_4.png",
    },
    {
      image: "https://api.interior.ru/media/oblozhki-zhurnalov/m19.png",
    },
    {
      image: "https://api.interior.ru/media/oblozhki-zhurnalov/m18.png",
    },
    {
      image: "https://api.interior.ru/media/oblozhki-zhurnalov/m21.png",
    },
    {
      image: "https://api.interior.ru/media/oblozhki-zhurnalov/m20.png",
    },
    {
      image: "https://api.interior.ru/media/oblozhki-zhurnalov/m15-2.png",
    },
    {
      image: "https://api.interior.ru/media/oblozhki-zhurnalov/m14-2.png",
    },
    {
      image: "https://api.interior.ru/media/oblozhki-zhurnalov/m16-2.png",
    },
    {
      image: "https://api.interior.ru/media/oblozhki-zhurnalov/m17-2.png",
    },
    {
      image: "https://api.interior.ru/media/oblozhki-zhurnalov/m5.png",
    },
    {
      image: "https://api.interior.ru/media/oblozhki-zhurnalov/m6.png",
    },
    {
      image: "https://api.interior.ru/media/oblozhki-zhurnalov/m7.png",
    },
    {
      image: "https://api.interior.ru/media/oblozhki-zhurnalov/m8.png",
    },
    {
      image: "https://api.interior.ru/media/oblozhki-zhurnalov/m4.png",
    },
    {
      image: "https://api.interior.ru/media/oblozhki-zhurnalov/m3.png",
    },
    {
      image: "https://api.interior.ru/media/oblozhki-zhurnalov/m1.png",
    },
    {
      image: "https://api.interior.ru/media/oblozhki-zhurnalov/m2.png",
    },
    {
      image: "https://api.interior.ru/media/oblozhki-zhurnalov/2222.jpg",
    },
    {
      image: "https://api.interior.ru/media/oblozhki-zhurnalov/4444.jpg",
    },
    {
      image: "https://api.interior.ru/media/oblozhki-zhurnalov/3333.jpg",
    },
    {
      image: "https://api.interior.ru/media/oblozhki-zhurnalov/1111.jpg",
    },
  ],
  covers: {
    default: "cover_preview",
    narrow: "cover_preview_narrow",
    square: "cover_square",
    vertical: "cover_vertical",
    image: "cover_default",
    image_wide: "cover_wide",
    og_image: "share_image",
  },
};

export default defineAppConfig(appConf);
