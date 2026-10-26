import type { ArticlePreview } from "./articles";
import { useApiClient } from "./client";

const PAGE_SIZE = 20;

type SearchResponse = {
  data?: { resource?: string; data?: ArticlePreview }[];
  meta?: { total?: number };
};

export const useSearchApi = () => {
  const api = useApiClient();

  const getSearchCount = async (q: string) => {
    const { data } = await api.get<{ data?: number }>("/api/search/count", { params: { q } });
    return data.data ?? 0;
  };

  const searchArticles = async (q: string, page = 1, pageSize = PAGE_SIZE) => {
    const { data } = await api.get<SearchResponse>("/api/search/search/", {
      params: { resource: "article", q, page, page_size: pageSize },
    });

    return {
      items: (data.data ?? []).map((item) => item.data).filter((item): item is ArticlePreview => Boolean(item)),
      total: data.meta?.total ?? 0,
    };
  };

  return { getSearchCount, searchArticles, pageSize: PAGE_SIZE };
};
