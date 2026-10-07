const API_HOST = "https://api.interior.ru";
const SITE_HOST_RE = /^https?:\/\/(www\.)?interior\.ru(?=\/|$)/;

export type ArticleEditor = "default" | "setka" | "verstka";

// бэк отдаёт абсолютные ссылки на боевой домен — внутри приложения нужен путь от корня
export const toSiteUri = (url?: string | null) =>
  url ? url.replace(SITE_HOST_RE, "") || "/" : "";

// у детальной статьи бэк не отдаёт url, у превью (next/related) — отдаёт
export const getArticleUri = (article: {
  id: number;
  slug: string;
  url?: string | null;
  category?: { slug: string } | null;
}) => {
  const uri = toSiteUri(article.url);
  if (uri) return uri;
  return article.category
    ? `/${article.category.slug}/${article.id}-${article.slug}.html`
    : "";
};

type SectionSource = {
  category?: { title?: string; slug: string } | null;
  main_tag?: { name: string; slug: string } | null;
};

export const getArticleSection = ({
  category,
  main_tag: mainTag,
}: SectionSource) => {
  if (category)
    return { title: category.title ?? "", url: `/${category.slug}` };
  if (mainTag) return { title: mainTag.name, url: `/${mainTag.slug}` };
  return null;
};

export const getArticleEditor = (html: string): ArticleEditor => {
  if (html.includes("data-vms-version")) return "verstka";
  if (html.includes("stk-grid")) return "setka";
  return "default";
};

// контент verstka.org может прийти JSON-ом с двумя макетами { desktop, mobile }
const pickContentVersion = (content: string, isMobile: boolean) => {
  if (!content.startsWith("{")) return content;

  try {
    const versions = JSON.parse(content) as {
      desktop?: string;
      mobile?: string;
    };
    return (isMobile && versions.mobile) || versions.desktop || "";
  } catch {
    return content;
  }
};

const RESIZE_SIZES = [500, 800, 1000, 1500, 2200];

const getResizedImageUrl = (src: string, size: number) => {
  let url: string;
  if (src.includes("/media/"))
    url = src.replace("/media/", `/media/resize/${size}/`);
  else if (src.includes("/images/"))
    url = src.replace("/images/", `/media/resize/${size}/images/`);
  else return src;

  return url.endsWith(".webp") ? url : `${url}.webp`;
};

// оригиналы в контенте бывают по несколько мегабайт — отдаём ресайз api в webp
const resizeContentImages = (html: string, size: number) =>
  html.replace(/<img[^>]*>/gi, (tag) =>
    tag.replace(
      /(?<![\w-])src=['"]([^'"]+\.(?:jpe?g|png))['"]/i,
      (_, src: string) => {
        const srcset = RESIZE_SIZES.map(
          (s) => `${getResizedImageUrl(src, s)} ${s}w`,
        ).join(", ");
        const sizes = [
          ...RESIZE_SIZES.map((s) => `(max-width: ${s}px) ${s}px`),
          "100vw",
        ].join(", ");
        return `src="${getResizedImageUrl(src, size)}" srcset="${srcset}" sizes="${sizes}" loading="lazy"`;
      },
    ),
  );

export const prepareArticleContent = (
  content: string | null | undefined,
  isMobile: boolean,
) => {
  if (!content) return "";

  const html = pickContentVersion(content, isMobile)
    .replace(
      /((?:data-)?src(?:set)?=")\/(images|media|files)/g,
      `$1${API_HOST}/$2`,
    )
    .replace(/„/g, "«")
    .replace(/“/g, "»")
    .replace(/•/g, "<span class='tohka'>•</span>")
    .replace(/_small\.jpg/g, ".jpg");

  return resizeContentImages(html, isMobile ? 500 : 1000);
};

export const formatArticleDate = (date?: string | null) =>
  date
    ? new Date(date).toLocaleString("ru", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Europe/Moscow",
      })
    : "";
