import { useApiClient } from "./client";

type Cover = { path?: string; rel_path?: string } | null;

type SpecProjectEntity = {
  id: number;
  title: string;
  url?: string;
  category?: { title?: string; slug?: string } | null;
  main_tag?: { name?: string; slug?: string } | null;
  cover_square?: Cover;
  cover_preview?: Cover;
};

export type SpecProject = {
  id: number;
  title: string;
  url: string;
  tag: string;
  image: string;
  image2x: string;
  video: string;
};

const toSpecProject = (entity: SpecProjectEntity): SpecProject => {
  // слайдер квадратный, поэтому square в приоритете; /media/thumb видео не режет — его отдаём как есть
  const covers = [entity.cover_square, entity.cover_preview];
  const video = covers.find((cover) => isVideoUrl(cover?.path))?.path ?? "";
  const cover = covers.find((c) => c?.path && !isVideoUrl(c.path));
  const relPath = cover?.rel_path;

  return {
    id: entity.id,
    title: entity.title,
    url: (entity.url ?? "#").replace(/^https?:\/\/(www\.)?interior\.ru/, ""),
    tag: entity.main_tag?.name ?? entity.category?.title ?? "",
    image: relPath ? getThumbUrl(relPath, 256, 256) : (cover?.path ?? ""),
    image2x: relPath ? getThumbUrl(relPath, 512, 512) : (cover?.path ?? ""),
    video,
  };
};

export const useSpecProjectsApi = () => {
  const api = useApiClient();

  const getSpecProjects = async (limit = 20) => {
    const [pinned, latest] = await Promise.all([
      api.get<{ data: { entity?: SpecProjectEntity }[] }>(
        "/api/articles/collections/spec_projects/items",
      ),
      api.get<{ data: SpecProjectEntity[] }>("/api/articles/article", {
        params: { category: "specprojects", limit },
      }),
    ]);

    const pinnedEntities = (pinned.data.data ?? [])
      .map((item) => item.entity)
      .filter((entity): entity is SpecProjectEntity => !!entity);
    const pinnedIds = new Set(pinnedEntities.map((entity) => entity.id));

    return [
      ...pinnedEntities,
      ...(latest.data.data ?? []).filter((entity) => !pinnedIds.has(entity.id)),
    ]
      .slice(0, limit)
      .map(toSpecProject);
  };

  return { getSpecProjects };
};
