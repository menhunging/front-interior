import { isAxiosError } from "axios";
import { useApiClient } from "./client";

export type ProjectApplication = {
  author_name: string;
  author_portrait_link: string;
  author_email: string;
  author_phone: string;
  author_facebook: string;
  author_site: string;
  author_city: string;
  project_description: string;
  project_publications: string;
  project_brands: string;
  project_photo_link: string;
  project_location: string;
  project_object_area: string;
  project_year: string;
  project_photographer: string;
  project_stylist: string;
};

export class PublishError extends Error {}

const fieldLabel: Record<string, string> = {
  author_name: "Фамилия и имя автора",
  author_portrait_link: "Ссылка на портрет",
  author_email: "Почта",
  author_city: "Город",
  project_description: "Описание проекта",
  project_photo_link: "Ссылка на фото",
  project_year: "Год реализации",
};

export const usePublishApi = () => {
  const api = useApiClient();

  const submitProjectApplication = async (fields: ProjectApplication) => {
    let token = "";
    try {
      const { data } = await api.get<{ data?: string }>("/session/csrf-token", { withCredentials: true });
      token = data.data ?? "";
    } catch {
      token = "";
    }

    const year = String(fields.project_year ?? "").trim();
    const body = {
      ...fields,
      type: "articles",
      project_year: year !== "" && !Number.isNaN(Number(year)) ? Number(year) : year,
      _token: token,
    };

    try {
      await api.post("/api/application/application", body, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      if (!isAxiosError(error)) throw new PublishError("Не удалось отправить анкету");

      const status = error.response?.status;
      if (status === 419) throw new PublishError("Сессия истекла, отправьте форму ещё раз");

      const errors = error.response?.data?.errors;
      if (errors && typeof errors === "object") {
        const [field, messages] = Object.entries(errors)[0] ?? [];
        const text = Array.isArray(messages) ? messages[0] : "";
        const label = field ? fieldLabel[field] : "";
        if (label && typeof text === "string" && /valid email/i.test(text)) {
          throw new PublishError("Некорректный адрес почты");
        }
        if (label) throw new PublishError(`Проверьте поле «${label}»`);
      }

      throw new PublishError("Не удалось отправить анкету");
    }
  };

  return { submitProjectApplication };
};
