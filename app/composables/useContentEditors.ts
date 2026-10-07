import { onBeforeUnmount } from "vue";

type VmsWindow = Window & {
  VMS_API?: { Article: { enable: (options: Record<string, unknown>) => void; disable?: () => void } };
};

// стили темы и рантайм редакторов (verstka.org + setka) нужны только страницам с контентом из редактора
export const useContentEditors = () => {
  useHead({
    link: [{ rel: "stylesheet", href: "/css/5039_interior_design_1_239.min.css" }],
    script: [
      {
        src: "https://api.interior.ru/modules/multieditor/setka/editor/plugins/37d7f0390ec87a1e51041d986291791a/public.js",
        tagPosition: "bodyClose",
      },
      { src: "https://go.verstka.org/api.js", async: true, tagPosition: "bodyClose" },
    ],
  });

  const timers = new Set<ReturnType<typeof setInterval>>();

  // api.js грузится async: ждём VMS_API, иначе анимации и масштабирование блоков не запустятся
  const enableVerstka = (observeSelector: string) => {
    const win = window as VmsWindow;
    let attempts = 0;

    const timer = setInterval(() => {
      attempts += 1;
      if (win.VMS_API) {
        clearInterval(timer);
        timers.delete(timer);
        win.VMS_API.Article.enable({ auto_mobile_detect: false, observe_selector: observeSelector });
      } else if (attempts > 50) {
        clearInterval(timer);
        timers.delete(timer);
      }
    }, 100);
    timers.add(timer);
  };

  onBeforeUnmount(() => {
    timers.forEach(clearInterval);
    (window as VmsWindow).VMS_API?.Article.disable?.();
  });

  return { enableVerstka };
};
