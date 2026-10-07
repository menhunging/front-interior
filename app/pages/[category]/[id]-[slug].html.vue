<template>
  <div class="article-page">
    <div v-for="(article, index) in articles" :key="article.id" :ref="(el) => setArticleRef(el, index)"
      class="article-page__item" :data-index="index">
      <ArticleView :article="article" :is-first="index === 0" @next="goToNext(index)"
        @mounted="onArticleMounted" />
    </div>

    <div ref="sentinelRef" class="article-page__sentinel" />
    <p v-if="isLoading" class="article-page__loading">Загрузка...</p>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type ComponentPublicInstance } from "vue";
import { useArticlesApi, type Article } from "../../api/articles";
import type { ArticleEditor } from "../../utils/article";

const route = useRoute();
const appConfig = useAppConfig();
const device = useIsMobile() ? "mobile" : "desktop";
const articleId = String(route.params.id);

const { getArticle, incrementArticleViews } = useArticlesApi();
const { enableVerstka } = useContentEditors();

const settlementUrl = (uri: string) => `${appConfig.hostCanonical}${uri}`;

const { data: first } = await useAsyncData(
  () => `article-${articleId}-${device}`,
  () => getArticle(articleId, device, settlementUrl(route.path)),
);

if (!first.value) {
  throw createError({ statusCode: 404, statusMessage: "Статья не найдена или перемещена!", fatal: true });
}

const articles = ref<Article[]>([first.value]);
const activeIndex = ref(0);
const isLoading = ref(false);
const active = computed(() => articles.value[activeIndex.value] ?? articles.value[0]!);

// бэк может отдать по id другую (скрытую) статью — тогда адрес в строке не трогаем
const isSecret = first.value.id !== Number(articleId);

const loadNext = async () => {
  const next = articles.value[articles.value.length - 1]?.next;
  if (!next || isLoading.value || articles.value.some((item) => item.id === next.id)) return;

  isLoading.value = true;
  try {
    const nextUrl = settlementUrl(getArticleUri(next) || route.path);
    const article = await getArticle(next.id, device, nextUrl);
    if (article) {
      articles.value.push(article);
      incrementArticleViews(article.id, nextUrl);
    }
  } catch (error) {
    console.error("next article load failed", error);
  } finally {
    isLoading.value = false;
  }
};

const articleEls = new Map<number, HTMLElement>();
const sentinelRef = ref<HTMLElement | null>(null);
let activeObserver: IntersectionObserver | undefined;
let sentinelObserver: IntersectionObserver | undefined;

const setArticleRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const prev = articleEls.get(index);
  if (el instanceof HTMLElement) {
    if (prev === el) return;
    articleEls.set(index, el);
    activeObserver?.observe(el);
  } else if (prev) {
    activeObserver?.unobserve(prev);
    articleEls.delete(index);
  }
};

// IntersectionObserver не шлёт событие, пока sentinel остаётся в зоне — переподписка отдаёт текущее состояние
const recheckSentinel = () => {
  if (!sentinelObserver || !sentinelRef.value) return;
  sentinelObserver.unobserve(sentinelRef.value);
  sentinelObserver.observe(sentinelRef.value);
};

const goToNext = async (index: number) => {
  if (!articles.value[index + 1]) await loadNext();
  await nextTick();
  articleEls.get(index + 1)?.scrollIntoView({ behavior: "smooth" });
};

const onArticleMounted = (editor: ArticleEditor) => {
  if (editor === "verstka") enableVerstka(".article-view__body");
};

onMounted(() => {
  incrementArticleViews(first.value!.id, settlementUrl(route.path));

  // активной считается статья, которая пересекает середину экрана
  activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activeIndex.value = Number((entry.target as HTMLElement).dataset.index);
      });
    },
    { rootMargin: "-50% 0px -50% 0px" },
  );
  articleEls.forEach((el) => activeObserver!.observe(el));

  sentinelObserver = new IntersectionObserver(
    async ([entry]) => {
      if (!entry?.isIntersecting) return;
      await loadNext();
      await nextTick();
      if (articles.value[articles.value.length - 1]?.next) recheckSentinel();
    },
    { rootMargin: "0px 0px 150% 0px" },
  );
  if (sentinelRef.value) sentinelObserver.observe(sentinelRef.value);
});

onBeforeUnmount(() => {
  activeObserver?.disconnect();
  sentinelObserver?.disconnect();
});

// replaceState, а не router.replace: смена роута перемонтирует страницу и сбросит ленту
watch(activeIndex, (index) => {
  const article = articles.value[index];
  const uri = article ? getArticleUri(article) : "";
  if (isSecret || !uri || uri === window.location.pathname) return;
  window.history.replaceState({ ...window.history.state, current: uri }, "", uri);
});

const pickCover = (article: Article) =>
  [article.share_image, article.cover_default, article.cover_wide, article.cover_preview].find(
    (cover) => cover?.path && !isVideoUrl(cover.path),
  );

const ogImage = computed(() => {
  const cover = pickCover(active.value);
  if (!cover) return undefined;
  return cover.rel_path ? encodeURI(getThumbUrl(cover.rel_path, 1280, 720)) : cover.path;
});

const metaTitle = computed(() => active.value.meta_title || active.value.og_title || active.value.title);
const metaDescription = computed(() => active.value.meta_description || active.value.description || "");

useSeoMeta({
  title: metaTitle,
  description: metaDescription,
  ogTitle: () => active.value.og_title || metaTitle.value,
  ogDescription: () => active.value.og_description || metaDescription.value,
  ogType: () => (active.value.og_type as "article" | "website" | undefined) || "article",
  ogImage,
  robots: () => (active.value.search_exclude || Number.isNaN(Number(articleId)) ? "noindex, follow" : undefined),
});

const canonical = computed(() => settlementUrl(getArticleUri(active.value)));
const keywords = computed(() => active.value.meta_keywords || undefined);

useHead({
  link: [{ rel: "canonical", href: canonical }],
  meta: [{ name: "keywords", content: keywords }],
});
</script>

<style lang="scss" scoped>
.article-page {
  &__item {
    min-height: 98vh;
    scroll-margin-top: 56px;

    & + & {
      margin-top: 64px;
    }
  }

  &__sentinel {
    height: 1px;
  }

  &__loading {
    padding: 32px 0;
    text-align: center;
    font-size: 14px;
    color: $colorGray;
  }
}
</style>
