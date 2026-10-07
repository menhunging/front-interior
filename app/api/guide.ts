import { useApiClient } from "./client";

type GuideEventEntity = {
  id: number;
  slug: string;
  title: string;
  url?: string | null;
  images?: string | null;
  dates?: { date_start: string; date_end: string }[];
  address?: { title?: string | null; address?: string | null } | null;
};

export type GuideEvent = {
  id: number;
  title: string;
  url: string;
  image: string;
  dates: string;
  place: string;
  address: string;
};

const API_HOST = "https://api.interior.ru";
const GUIDE_EVENTS_URL = "https://www.interior.ru/guide/moskva/events";

const todayInMoscow = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Moscow" }).format(new Date());

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("ru", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${date}T00:00:00Z`))
    .replace(" г.", "");

const toGuideEvent = (entity: GuideEventEntity): GuideEvent => {
  const period = entity.dates?.[0];
  const image = entity.images ?? "";

  return {
    id: entity.id,
    title: entity.title,
    // events without a linked article live only in the old guide section
    url: entity.url
      ? entity.url.replace(/^https?:\/\/(www\.)?interior\.ru/, "")
      : `${GUIDE_EVENTS_URL}/${entity.slug}`,
    image: image.startsWith(API_HOST) ? getThumbUrl(image.slice(API_HOST.length), 640, 480) : image,
    dates: period ? `${formatDate(period.date_start)} — ${formatDate(period.date_end)}` : "",
    place: entity.address?.title ?? "",
    address: entity.address?.address ?? "",
  };
};

export const useGuideApi = () => {
  const api = useApiClient();

  // data_start + data_end returns events whose period covers the whole range,
  // so passing the same day gives "running today"; data_start alone ignores limit
  const getCurrentEvents = async (city = "moskva", limit = 20) => {
    const today = todayInMoscow();
    const { data } = await api.get<{ data: GuideEventEntity[] }>("/api/guide/events", {
      params: { cities: city, data_start: today, data_end: today, limit },
    });

    return (data.data ?? []).map(toGuideEvent);
  };

  return { getCurrentEvents };
};
