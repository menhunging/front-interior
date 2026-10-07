<template>
  <div v-if="section" class="category-page">
    <div class="category-page__header">
      <h1 class="caption caption--h2">{{ section.title }}</h1>
      <p v-if="section.description" class="category-page__description">{{ section.description }}</p>
    </div>

    <CategoryGridSection :batches="batches" />

    <div v-if="hasMore" class="category-page__more">
      <button type="button" class="btn" :disabled="isLoading" @click="loadMore">
        {{ isLoading ? "Загрузка..." : "Показать больше статей" }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useCategoriesApi } from "../../api/categories";

const FIRST_BATCH = 26;
const NEXT_BATCH = 25;

const route = useRoute();
const slug = computed(() => String(route.params.category));
const startPage = Math.max(1, Number(route.query.page) || 1);

const { getSectionPage, getMoreSectionArticles } = useCategoriesApi();

const { data } = await useAsyncData(
  () => `section-${slug.value}-${startPage}`,
  () => getSectionPage(slug.value, startPage, FIRST_BATCH),
);

if (!data.value) {
  throw createError({ statusCode: 404, statusMessage: "Раздел не найден", fatal: true });
}

const section = computed(() => data.value?.section);
const batches = ref([[...data.value.items]]);
const total = data.value.total;
const offset = ref(startPage * FIRST_BATCH);
const isLoading = ref(false);
const hasMore = computed(() => offset.value < total);

const loadMore = async () => {
  if (!section.value || isLoading.value) return;
  isLoading.value = true;

  try {
    const items = await getMoreSectionArticles(section.value, NEXT_BATCH, offset.value, batches.value.flat());
    if (items.length) batches.value.push(items);
    offset.value += NEXT_BATCH;
  } catch (error) {
    console.error("section articles load failed", error);
  } finally {
    isLoading.value = false;
  }
};

const canonical = computed(() =>
  `https://www.interior.ru/${slug.value}${startPage > 1 ? `?page=${startPage}` : ""}`,
);

useSeoMeta({
  title: () => {
    const s = section.value;
    const title = s?.meta_title || s?.title || "";
    return startPage > 1 ? `${title} | Страница ${startPage}` : title;
  },
  description: () => section.value?.meta_description || section.value?.description || "",
  ogTitle: () => section.value?.og_title || section.value?.meta_title || section.value?.title || "",
  ogDescription: () => section.value?.og_description || section.value?.meta_description || "",
  ogImage: () => section.value?.og_image || undefined,
});

useHead({
  link: [{ rel: "canonical", href: canonical }],
});
</script>

<style lang="scss" scoped>
.category-page {
  &__header {
    padding: 48px 0;

    @include responsive767 {
      padding: 24px 0;
    }

    .caption {
      font-size: 72px;
      line-height: 88px;
      font-weight: 200;
      display: block;
      text-align: center;
      text-transform: none;

      @include responsive1279 {
        font-size: 64px;
        line-height: 80px;
      }

      @include responsive1023 {
        font-size: 40px;
        line-height: 50px;
      }

    }
  }



  &__description {
    color: $colorDark;
    margin-left: auto;
    margin-right: auto;
    margin-top: 32px;
    max-width: 540px;
    text-align: center;
    font-size: 16px;
    font-weight: 300;
    line-height: 125%;
  }

  &__more {
    margin-top: 44px;

    .btn {
      width: 100%;
      max-width: 100%;
      display: flex;
      justify-content: center;
      font-weight: 600;
      text-transform: uppercase;
    }
  }
}
</style>
