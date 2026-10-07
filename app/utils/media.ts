const VIDEO_EXTENSIONS = ["mp4", "mov", "webm", "m4v", "ogv"];

const getExtension = (url: string) =>
  url.split(/[?#]/)[0]?.split(".").pop()?.toLowerCase() ?? "";

export const isVideoUrl = (url?: string | null) =>
  !!url && VIDEO_EXTENSIONS.includes(getExtension(url));

type CoverLike = { path?: string | null } | null | undefined;

// редакция кладёт видео то в cover_preview, то только в cover_square (а в preview — статичную картинку)
export const getCoverMedia = (entity: { cover_preview?: CoverLike; cover_square?: CoverLike }) => {
  const covers = [entity.cover_preview?.path, entity.cover_square?.path];
  return covers.find((path) => isVideoUrl(path)) ?? covers.find(Boolean) ?? "";
};

export const getThumbUrl = (relPath: string, width: number, height: number) =>
  `https://api.interior.ru/media/thumb/${width}x${height}_5${relPath}`;

export const getVideoMimeType = (url: string) => {
  const ext = getExtension(url);
  if (ext === "webm") return "video/webm";
  if (ext === "ogv") return "video/ogg";
  return "video/mp4";
};
