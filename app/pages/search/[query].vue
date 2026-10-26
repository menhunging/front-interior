<template>
  <section class="search-page">
    <div class="search-page__header">
      <h1 class="caption">Поиск</h1>

      <form class="search-page__form" @submit.prevent="onSubmit">
        <div class="search-page__field">
          <input v-model="queryInput" type="text" placeholder="Поиск">
          <span v-if="queryInput.length" class="btn-clear" aria-label="Очистить" @click="queryInput = ''"></span>
        </div>
        <button class="btn" type="submit" :disabled="!queryInput.trim()">Найти</button>
      </form>

      <div class="search-page__row">
        <p v-if="total" class="search-page__count">
          Мы нашли <b>{{ total }}</b> {{ materialsWord }}
        </p>
        <p v-else-if="loaded" class="search-page__count">Мы ничего не нашли, попробуйте изменить запрос</p>

        <div v-if="articles.length" class="selectSearch">
          <button type="button" class="selectSearch__current" @click="sortOpen = !sortOpen">{{ sortLabel }}</button>
          <ul v-show="sortOpen" class="selectSearch__list">
            <li v-for="option in sortOptions" :key="option.value" @click="sort = option.value; sortOpen = false">
              {{ option.label }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <CategoryGridSection v-if="articles.length" :batches="visibleBatches" plain />

    <button v-if="hasMore" type="button" class="btn search-page__more" :disabled="loadingMore" @click="loadMore">
      {{ loadingMore ? "Загрузка..." : "Показать больше статей" }}
    </button>
  </section>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAsyncData, useSeoMeta } from "nuxt/app";
import type { ArticlePreview } from "../../api/articles";
import { useSearchApi } from "../../api/search";

const route = useRoute();
const router = useRouter();
const { searchArticles, pageSize } = useSearchApi();

const query = computed(() => {
  const raw = route.params.query;
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return "";
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
});

const queryInput = ref("");
const sort = ref<"relevance" | "date">("relevance");
const sortOpen = ref(false);
const page = ref(1);
const extra = ref<ArticlePreview[][]>([]);
const loadingMore = ref(false);

const sortOptions = [
  { value: "relevance" as const, label: "по релевантности" },
  { value: "date" as const, label: "по дате" },
];

const { data, status } = await useAsyncData(
  () => `search-${query.value}`,
  () => (query.value ? searchArticles(query.value, 1, pageSize) : Promise.resolve({ items: [], total: 0 })),
);

watch(query, (value) => {
  queryInput.value = value;
  page.value = 1;
  extra.value = [];
  sort.value = "relevance";
  sortOpen.value = false;
}, { immediate: true });

const articles = computed(() => [...(data.value?.items ?? []), ...extra.value.flat()]);
const total = computed(() => data.value?.total ?? 0);
const loaded = computed(() => status.value === "success" || status.value === "error");
const hasMore = computed(() => articles.value.length > 0 && articles.value.length < total.value);
const sortLabel = computed(() => sortOptions.find((option) => option.value === sort.value)?.label ?? "");

const materialsWord = computed(() => {
  const n = total.value;
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return "материал";
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return "материала";
  return "материалов";
});

const visibleBatches = computed(() => {
  if (sort.value === "relevance") {
    const first = data.value?.items ?? [];
    return first.length ? [first, ...extra.value] : extra.value;
  }

  return [[...articles.value].sort((a, b) =>
    (b.publication_start_datetime ?? "").localeCompare(a.publication_start_datetime ?? ""),
  )];
});

const onSubmit = () => {
  const q = queryInput.value.trim();
  if (!q || q === query.value) return;
  router.push(`/search/${encodeURIComponent(q)}`);
};

const loadMore = async () => {
  if (loadingMore.value || !hasMore.value) return;
  loadingMore.value = true;
  page.value += 1;
  try {
    const next = await searchArticles(query.value, page.value, pageSize);
    if (next.items.length) extra.value.push(next.items);
  } finally {
    loadingMore.value = false;
  }
};

useSeoMeta({ title: () => (query.value ? `Поиск: ${query.value}` : "Поиск") });
</script>

<style lang="scss" scoped>
.search-page {

  &__header {
    padding: 48px 0 32px;

    @include responsive767 {
      padding: 24px 0 16px;
    }
  }

  &__header .caption {
    display: block;
    font-size: 72px;
    line-height: 88px;
    font-weight: 200;
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

  &__form {
    display: flex;
    gap: 16px;
    max-width: 720px;
    margin: 32px auto 0;
  }

  &__field {
    position: relative;
    flex: 1;

    input {
      width: 100%;
      height: 36px;
      padding-right: 24px;
      border: 0;
      border-bottom: solid 1px $colorBlack;
      outline: none;
    }
  }

  &__form .btn {
    padding: 8px 16px;
  }

  .btn-clear {
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 0;
    width: 15px;
    height: 15px;
    opacity: 0.77;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z' fill='%230F1729'%3e%3c/path%3e%3c/svg%3e");
    background-position: center;
    background-repeat: no-repeat;
  }

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    max-width: 720px;
    margin: 24px auto 0;
  }

  &__count {
    margin: 0;
  }

  &__more {
    display: block;
    margin: 32px auto 0;
    width: 100%;
  }
}

.selectSearch {
  position: relative;
  margin-left: auto;

  &__current {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0;
    border: 0;
    background: none;
    font: inherit;
    text-transform: lowercase;
    cursor: pointer;

    &::after {
      content: "";
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 5px solid $colorBlack;
    }
  }

  &__list {
    position: absolute;
    right: 0;
    top: 100%;
    z-index: 2;
    min-width: 180px;
    margin: 8px 0 0;
    padding: 8px 0;
    list-style: none;
    background: $colorWhite;
    border: 1px solid rgba(0, 0, 0, 0.12);

    li {
      padding: 8px 16px;
      text-transform: lowercase;
      cursor: pointer;

      &:hover {
        background: rgba(0, 0, 0, 0.05);
      }
    }
  }
}
</style>
