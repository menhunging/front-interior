import { isAxiosError } from "axios";
import { useApiClient } from "./client";
import type { ArticleCollectionEntity } from "./articles";

export type CategoryInfo = {
  id: number;
  slug: string;
  title: string;
  description?: string | null;
  image?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
};

// the same slug can be either a category (/api/articles/category) or a tag (/api/tag/tag)
export type Section = CategoryInfo & { kind: "category" | "tag" };

type ArticlesPageResponse = {
  data: ArticleCollectionEntity[];
  meta: { total: number };
};

export const useCategoriesApi = () => {
  const api = useApiClient();

  const fetchOrNull = async <T>(url: string) => {
    try {
      const { data } = await api.get<{ data: T }>(url);
      return data.data ?? null;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) return null;
      throw error;
    }
  };

  const getSection = async (slug: string): Promise<Section | null> => {
    const category = await fetchOrNull<CategoryInfo>(
      `/api/articles/category/${encodeURIComponent(slug)}`,
    );
    if (category) return { ...category, kind: "category" };

    const tag = await fetchOrNull<CategoryInfo & { name?: string }>(
      `/api/tag/tag/${encodeURIComponent(slug)}`,
    );
    if (tag)
      return { ...tag, title: tag.title || tag.name || slug, kind: "tag" };

    return null;
  };

  const getSectionArticles = async (
    section: Section,
    limit: number,
    offset: number,
  ) => {
    const { data } = await api.get<ArticlesPageResponse>(
      "/api/articles/article",
      {
        params: { [section.kind]: section.slug, limit, offset },
      },
    );

    return { items: data.data ?? [], total: data.meta?.total ?? 0 };
  };

  const getSectionPage = async (
    slug: string,
    page: number,
    pageSize: number,
  ) => {
    const section = await getSection(slug);
    if (!section) return null;

    const { items, total } = await getSectionArticles(
      section,
      pageSize,
      (page - 1) * pageSize,
    );
    return { section, items, total };
  };

  const getMoreSectionArticles = async (
    section: Section,
    pageSize: number,
    offset: number,
    shown: ArticleCollectionEntity[],
  ) => {
    const { items } = await getSectionArticles(section, pageSize, offset);
    const shownIds = new Set(shown.map((item) => item.id));
    return items.filter((item) => !shownIds.has(item.id));
  };

  return {
    getSection,
    getSectionArticles,
    getSectionPage,
    getMoreSectionArticles,
  };
};
