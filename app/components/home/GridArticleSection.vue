<template>
  <section class="grid-article" v-if="displayItems.length">

    <div v-for="(item, index) in displayItems" :key="`grid-${start}-${getArticleId(item, index)}`"
      :class="getGridItemClass(index)">
      <NuxtLink :to="getArticleUrl(item)" class="grid-article__media">
        <picture>
          <video v-if="isVideoUrl(getArticleImage(item))" autoplay muted loop playsinline preload="metadata"
            :aria-label="getArticleTitle(item)">
            <source :src="getArticleImage(item)" :type="getVideoMimeType(getArticleImage(item))">
          </video>
          <img v-else :src="getArticleImage(item)" :alt="getArticleTitle(item)">
        </picture>
      </NuxtLink>

      <NuxtLink :to="getArticleUrl(item)" class="grid-article__link">
        <span class="text-default">{{ getArticleTitle(item) }}</span>
      </NuxtLink>
      <NuxtLink :to="getCategoryUrl(item)" class="grid-article__desc">
        <span class="text-default">{{ getArticleCategory(item) }}</span>
      </NuxtLink>
    </div>

    <button v-if="showMore && remainingArticlesCount > 0" type="button" class="btn" @click="handleShowMore">
      Показать больше статей
    </button>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

type HomeArticle = {
  id?: number;
  slug?: string;
  title?: string;
  url?: string;
  category?: { title?: string };
  main_tag?: { name?: string; slug?: string } | null;
  cover_preview?: { path?: string } | null;
  cover_square?: { path?: string } | null;
  entity?: {
    id?: number;
    slug?: string;
    title?: string;
    url?: string;
    category?: { title?: string };
    main_tag?: { name?: string; slug?: string } | null;
    cover_preview?: { path?: string } | null;
    cover_square?: { path?: string } | null;
  };
};

const props = withDefaults(
  defineProps<{
    items: HomeArticle[];
    start: number;
    end: number;
    showMore?: boolean;
  }>(),
  {
    showMore: false,
  },
);
const emit = defineEmits<{
  expanded: [];
}>();

const gridItemModifiers = [
  "grid-article__item--big",
  "grid-article__item--small",
  "",
  "",
  "grid-article__item--small",
  "grid-article__item--big",
  "",
  "",
];

const expanded = ref(false);

const getArticleEntity = (item: HomeArticle) => item.entity ?? item;

const getArticleId = (item: HomeArticle, index: number) => {
  const entity = getArticleEntity(item);
  return entity.id ?? entity.slug ?? index;
};

const getArticleTitle = (item: HomeArticle) => {
  const entity = getArticleEntity(item);
  return entity.title ?? "Без названия";
};

const getArticleCategory = (item: HomeArticle) => {
  const entity = getArticleEntity(item);
  return entity.main_tag?.name ?? "";
};

const getArticleImage = (item: HomeArticle) => getCoverMedia(getArticleEntity(item));

const getArticleUrl = (item: HomeArticle) => {
  return toSiteUri(getArticleEntity(item).url);
};

const getCategoryUrl = (item: HomeArticle) => {
  const slug = getArticleEntity(item).main_tag?.slug;
  return slug ? `/${slug}` : "";
};

const getGridItemClass = (index: number) => {
  const modifier =
    gridItemModifiers[index % gridItemModifiers.length] ?? "";
  return modifier ? `grid-article__item ${modifier}` : "grid-article__item";
};

const handleShowMore = () => {
  expanded.value = true;
  emit("expanded");
};

const visibleEnd = computed(() =>
  expanded.value ? props.items.length : props.end,
);
const displayItems = computed(() => props.items.slice(props.start, visibleEnd.value));
const remainingArticlesCount = computed(() =>
  Math.max(props.items.length - visibleEnd.value, 0),
);
</script>

<style lang="scss" scoped>
.grid-article {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 44px 0;

  @include responsive767 {
    gap: 12px 0;
  }

  &__item {
    display: flex;
    flex-direction: column;
    width: calc(45% - 5px);

    @include responsive767 {
      width: 100%;
    }

    &--big {
      width: 58%;

      @include responsive767 {
        width: 100%;
      }
    }

    &--small {
      width: 34%;

      @include responsive767 {
        width: 100%;
      }
    }
  }

  &__link {
    position: relative;
    @include hoverDefault($colorDark, 1px, 0.3s);
    @include plusIconLeft;
    padding-left: 15px;
    padding-top: 16px;
    max-width: 455px;

    &:before {
      left: 0;

      @include responsive767 {
        left: 0;
      }
    }

    @include responsive1023 {
      font-size: 14px;
      line-height: 18px;
    }

    @include responsive767 {
      font-size: 12px;
      line-height: 16px;
      padding-top: 8px;
    }
  }

  &__desc {
    font-size: 12px;
    color: $colorBlack;
    opacity: 0.5;
    margin-top: 5px;
    padding-left: 15px;
    @include hoverDefault($colorDark, 1px, 0.3s);

    &:first-letter {
      text-transform: uppercase;
    }

    &:hover {
      opacity: 1;
    }

    @include responsive767 {
      margin-top: 0;
    }
  }

  &__media {
    display: flex;
    width: 100%;

    &:hover {
      &+.grid-article__link {
        &::before {
          transform: rotate(180deg);
        }

        .text-default {
          background-size: 100% 100%;
        }
      }
    }
  }

  .btn {
    width: 100%;
    max-width: 100%;
    display: flex;
    justify-content: center;
    font-weight: 600;
    text-transform: uppercase;
  }

  picture {
    width: 100%;
    height: 549px;
    position: relative;

    @include responsive1279 {
      height: 330px;
    }

    @include responsive1023 {
      height: 250px;
    }

    @include responsive767 {
      height: auto;
      padding-top: calc(244 / 326 * 100%);
    }

    img,
    video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-position: center;
      object-fit: cover;
    }
  }
}
</style>
