import { isAxiosError } from "axios";
import { useApiClient } from "./client";

type ArticleCover = {
  path?: string;
  rel_path?: string;
  width?: number;
  height?: number;
} | null;

type ArticleSection = {
  id?: number;
  title?: string;
  slug: string;
  uri?: string;
};
type ArticleTag = { id?: number; name: string; slug: string };

export type ArticlePreview = {
  id: number;
  slug: string;
  title: string;
  description?: string | null;
  url?: string;
  publication_start_datetime?: string | null;
  category?: ArticleSection | null;
  main_tag?: ArticleTag | null;
  cover_preview?: ArticleCover;
  cover_preview_narrow?: ArticleCover;
  cover_square?: ArticleCover;
  cover_vertical?: ArticleCover;
};

export type Article = ArticlePreview & {
  content?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_type?: string | null;
  template?: string | null;
  cover_default?: ArticleCover;
  cover_wide?: ArticleCover;
  share_image?: ArticleCover;
  next?: ArticlePreview | null;
  previous?: ArticlePreview | null;
  related?: ArticlePreview[];
  tags?: ArticleTag[];
  source?: { type: string; title: string; url?: string | null }[];
  author?: {
    id: number;
    slug: string;
    title: string;
    speciality?: string | null;
    avatar?: { file?: { path_string?: string } } | null;
  } | null;
  search_exclude?: boolean;
  hide_pinterest?: boolean;
  is_banners_disabled?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type ArticleCollectionEntity = {
  id: number;
  slug: string;
  title: string;
  url?: string;
  category?: { title?: string };
  cover_preview?: { path?: string } | null;
  cover_square?: { path?: string } | null;
};

export type ArticleCollectionItem = {
  entity: ArticleCollectionEntity;
};

export type NewsItem = {
  id: number;
  slug: string;
  title: string;
};

type RelatedMaterial = ArticlePreview & {
  entity_name?: string;
  city_slug?: string;
};

export type NewsNoteItem = Pick<
  Article,
  | "id"
  | "slug"
  | "title"
  | "description"
  | "content"
  | "category"
  | "main_tag"
  | "tags"
  | "cover_preview"
> &
  Partial<
    Pick<
      Article,
      | "meta_title"
      | "meta_description"
      | "meta_keywords"
      | "og_title"
      | "og_description"
      | "share_image"
      | "search_exclude"
    >
  > & {
    related?: RelatedMaterial[];
    related_material?: RelatedMaterial[];
  };

export const getNewsUrl = (item: NewsItem) =>
  `/news/${item.id}-${item.slug}.html`;

export type CollectionPinItem = ArticleCollectionItem & {
  title?: string | null;
  url?: string | null;
  image?: { path?: string } | null;
};

type ArticleCollectionItemsResponse = {
  data: ArticleCollectionItem[];
};

export const useArticlesApi = () => {
  const api = useApiClient();

  const getArticlesHome = async (collection: string) => {
    const { data } = await api.get<ArticleCollectionItemsResponse>(
      `/api/articles/article?limit=50`,
    );

    return data;
  };

  const getMoreArticles = async (limit = 50, offset = 0) => {
    const { data } = await api.get<ArticleCollectionItemsResponse>(
      "/api/articles/article",
      {
        params: { limit, offset },
      },
    );

    return data;
  };

  const getCollectionItems = async (collection: string) => {
    const { data } = await api.get<{ data: CollectionPinItem[] }>(
      `/api/articles/collections/${collection}/items`,
    );

    return data;
  };

  const getNews = async (limit = 16, offset = 0) => {
    const { data } = await api.get<{ data: NewsItem[] }>("/api/articles/news", {
      params: { settlement_url: "www.interior.ru/news", limit, offset },
    });

    return data;
  };

  // в отличие от getNews отдаёт новости целиком, с контентом
  const getNewsFeed = async (limit = 10, offset = 0) => {
    const { data } = await api.get<{
      data: NewsNoteItem[];
      meta: { total: number; to: number | null };
    }>("/api/articles/news", {
      params: { settlement_url: "www.interior.ru/news", limit, offset },
    });

    return data;
  };

  // settlement_url — адрес страницы, на которой показывают статью: по нему бэк считает статистику
  const getArticle = async (
    id: number | string,
    device: "desktop" | "mobile",
    settlementUrl?: string,
  ): Promise<Article | null> => {
    try {
      const { data } = await api.get<{ data: Article }>(
        `/api/articles/article/${encodeURIComponent(id)}`,
        { params: { device, settlement_url: settlementUrl } },
      );
      return data.data ?? null;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) return null;
      throw error;
    }
  };

  const incrementArticleViews = (id: number, settlementUrl?: string) =>
    api
      .put(`/api/articles/article/${id}/views`, null, {
        params: { settlement_url: settlementUrl },
      })
      .catch((error) => console.error("article views update failed", error));

  return {
    getArticlesHome,
    getNews,
    getNewsFeed,
    getCollectionItems,
    getMoreArticles,
    getArticle,
    incrementArticleViews,
  };
};
