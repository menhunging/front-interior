import { isAxiosError } from "axios";
import { useApiClient } from "./client";

export type StaticPage = {
  id: number;
  title: string;
  template?: string;
  body: string;
  meta_title?: string | null;
  meta_description?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_type?: string | null;
};

export type PageDevice = "desktop" | "mobile";

export const usePagesApi = () => {
  const api = useApiClient();

  // verstka.org отдаёт для desktop и mobile разные макеты с фиксированной шириной (1280 / 320)
  const getStaticPage = async (slug: string, device: PageDevice): Promise<StaticPage | null> => {
    try {
      const { data } = await api.get<{ data: StaticPage }>(`/api/page/page/${encodeURIComponent(slug)}`, {
        params: { device },
      });
      return data.data ?? null;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) return null;
      throw error;
    }
  };

  return { getStaticPage };
};
