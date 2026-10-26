import { useApiClient } from "./client";

export type TopTag = {
  id: number;
  name: string;
  slug: string;
};

export const useTagsApi = () => {
  const api = useApiClient();

  const getTopTags = async (limit = 10) => {
    const { data } = await api.get<{ data: TopTag[] }>("/api/tag/tags_top", {
      params: { limit },
    });

    return data.data ?? [];
  };

  return { getTopTags };
};
