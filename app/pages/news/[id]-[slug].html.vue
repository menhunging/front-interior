<template>
  <div class="news-page">
    <div class="news-page__header">
      <div class="news-page__heading">Новости</div>
    </div>

    <div class="news-page__list">
      <div v-for="(note, index) in notes" :key="note.id" :ref="(el) => setNoteRef(el, index)" class="news-page__item"
        :data-index="index">
        <NewsNote :note="note" :is-first="index === 0" @mounted="onNoteMounted" />
      </div>
    </div>

    <div ref="sentinelRef" class="news-page__sentinel" />
    <p v-if="isLoading" class="news-page__loading">Загрузка...</p>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type ComponentPublicInstance } from "vue";
import { getNewsUrl, useArticlesApi, type NewsNoteItem } from "../../api/articles";
import type { ArticleEditor } from "../../utils/article";

const PAGE_SIZE = 10;
const DEFAULT_DESCRIPTION =
  "Ежедневно обновляемый информационный интернет-ресурс, посвящённый актуальным тенденциям в дизайне, архитектуре и арте";

const route = useRoute();
const appConfig = useAppConfig();
const device = useIsMobile() ? "mobile" : "desktop";
const newsId = String(route.params.id);

const { getArticle, getNewsFeed, incrementArticleViews } = useArticlesApi();
const { enableVerstka } = useContentEditors();

const settlementUrl = (uri: string) => `${appConfig.hostCanonical}${uri}`;

// открытая новость первой, дальше лента свежих новостей — как в старом фиде
const { data } = await useAsyncData(`news-${newsId}-${device}`, async () => {
  const [initial, feed] = await Promise.all([
    getArticle(newsId, device, settlementUrl(route.path)),
    getNewsFeed(PAGE_SIZE, 0),
  ]);
  return { initial, feed };
});

if (!data.value?.initial) {
  throw createError({ statusCode: 404, statusMessage: "Новость не найдена или перемещена!", fatal: true });
}

const initial = data.value.initial;
const notes = ref<NewsNoteItem[]>([initial, ...data.value.feed.data.filter((item) => item.id !== initial.id)]);
const offset = ref(data.value.feed.meta.to ?? PAGE_SIZE);
const total = ref(data.value.feed.meta.total);
const activeIndex = ref(0);
const isLoading = ref(false);
const active = computed(() => notes.value[activeIndex.value] ?? notes.value[0]!);

const isEnded = computed(() => offset.value >= total.value);
const isSecret = initial.id !== Number(newsId);

const loadMore = async () => {
  if (isLoading.value || isEnded.value) return;

  isLoading.value = true;
  try {
    const feed = await getNewsFeed(PAGE_SIZE, offset.value);
    const known = new Set(notes.value.map((item) => item.id));
    notes.value.push(...feed.data.filter((item) => !known.has(item.id)));
    offset.value = feed.meta.to ?? offset.value + PAGE_SIZE;
    total.value = feed.meta.total;
  } catch (error) {
    console.error("news feed load failed", error);
  } finally {
    isLoading.value = false;
  }
};

const noteEls = new Map<number, HTMLElement>();
const sentinelRef = ref<HTMLElement | null>(null);
let activeObserver: IntersectionObserver | undefined;
let sentinelObserver: IntersectionObserver | undefined;

const setNoteRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const prev = noteEls.get(index);
  if (el instanceof HTMLElement) {
    if (prev === el) return;
    noteEls.set(index, el);
    activeObserver?.observe(el);
  } else if (prev) {
    activeObserver?.unobserve(prev);
    noteEls.delete(index);
  }
};

// IntersectionObserver не шлёт событие, пока sentinel остаётся в зоне — переподписка отдаёт текущее состояние
const recheckSentinel = () => {
  if (!sentinelObserver || !sentinelRef.value) return;
  sentinelObserver.unobserve(sentinelRef.value);
  sentinelObserver.observe(sentinelRef.value);
};

const onNoteMounted = (editor: ArticleEditor) => {
  if (editor === "verstka") enableVerstka(".news-note__content");
};

onMounted(() => {
  incrementArticleViews(initial.id, settlementUrl(route.path));

  activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activeIndex.value = Number((entry.target as HTMLElement).dataset.index);
      });
    },
    { rootMargin: "-50% 0px -50% 0px" },
  );
  noteEls.forEach((el) => activeObserver!.observe(el));

  sentinelObserver = new IntersectionObserver(
    async ([entry]) => {
      if (!entry?.isIntersecting) return;
      await loadMore();
      await nextTick();
      if (!isEnded.value) recheckSentinel();
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
  const note = notes.value[index];
  const uri = note ? getNewsUrl(note) : "";
  if (isSecret || !uri || uri === window.location.pathname) return;
  window.history.replaceState({ ...window.history.state, current: uri }, "", uri);
});

const metaTitle = computed(() => active.value.meta_title || active.value.og_title || active.value.title);
const metaDescription = computed(() => active.value.meta_description || DEFAULT_DESCRIPTION);
const ogImage = computed(() => {
  const path = active.value.share_image?.path || active.value.cover_preview?.path;
  return path && !isVideoUrl(path) ? path : undefined;
});

useSeoMeta({
  title: () => `${metaTitle.value} • Интерьер+Дизайн`,
  description: metaDescription,
  ogTitle: () => active.value.og_title || metaTitle.value,
  ogDescription: () => active.value.og_description || metaDescription.value,
  ogType: "article",
  ogImage,
  robots: () => (active.value.search_exclude || Number.isNaN(Number(newsId)) ? "noindex, follow" : undefined),
});

const canonical = computed(() => settlementUrl(getNewsUrl(active.value)));
const keywords = computed(() => active.value.meta_keywords || undefined);

useHead({
  link: [{ rel: "canonical", href: canonical }],
  meta: [{ name: "keywords", content: keywords }],
});
</script>

<style lang="scss" scoped>
.news-page {
  max-width: 948px;
  margin: 0 auto;
  padding: 0 32px 64px;
  box-sizing: content-box;

  @include responsive767 {
    padding: 0 16px 40px;
  }

  &__header {
    padding: 48px 0;

    @include responsive767 {
      padding: 32px 0;
    }
  }

  &__heading {
    font-size: 72px;
    line-height: 88px;
    font-weight: 200;
    text-align: center;

    @include responsive767 {
      font-size: 40px;
      line-height: 125%;
    }
  }

  &__item {
    scroll-margin-top: 56px;

    & + & {
      margin-top: 96px;

      @include responsive767 {
        margin-top: 48px;
      }
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
