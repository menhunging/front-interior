<template>
  <section class="grid-article" v-if="nodes.length">
    <template v-for="node in nodes" :key="node.key">
      <TickerSection v-if="node.type === 'ticker'" class="grid-article__ticker" />

      <div v-else :class="node.className">
        <NuxtLink :to="getArticleUrl(node.item)" class="grid-article__media">
          <picture>
            <video v-if="isVideoUrl(getArticleImage(node.item))" autoplay muted loop playsinline preload="metadata"
              :aria-label="getArticleTitle(node.item)">
              <source :src="getArticleImage(node.item)" :type="getVideoMimeType(getArticleImage(node.item))">
            </video>
            <img v-else :src="getArticleImage(node.item)" :alt="getArticleTitle(node.item)">
          </picture>
        </NuxtLink>

        <div class="grid-article__content">
          <NuxtLink :to="getArticleUrl(node.item)" class="grid-article__link">
            <span class="text-default">{{ getArticleTitle(node.item) }}</span>
          </NuxtLink>
          <NuxtLink :to="getCategoryUrl(node.item)" class="grid-article__desc">
            <span class="text-default">{{ getArticleCategory(node.item) }}</span>
          </NuxtLink>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";

type CategoryArticle = {
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

type GridNode =
  | { type: "article"; key: string; item: CategoryArticle; className: string }
  | { type: "ticker"; key: string };

const props = defineProps<{
  // каждая порция подгрузки — отдельный массив: последний элемент порции всегда на всю ширину
  batches: CategoryArticle[][];
}>();

// big + small, half + half, small + big, half + half — элементы идут парами,
// поэтому тикер и полноширинные блоки ставим только на чётную позицию
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

const getArticleEntity = (item: CategoryArticle) => item.entity ?? item;

const getArticleId = (item: CategoryArticle) => {
  const entity = getArticleEntity(item);
  return entity.id ?? entity.slug;
};

const getArticleTitle = (item: CategoryArticle) => getArticleEntity(item).title ?? "Без названия";
const getArticleCategory = (item: CategoryArticle) =>
  getArticleEntity(item).main_tag?.name ?? "Без категории";

const getArticleImage = (item: CategoryArticle) => getCoverMedia(getArticleEntity(item));

const getArticleUrl = (item: CategoryArticle) => toSiteUri(getArticleEntity(item).url);
const getCategoryUrl = (item: CategoryArticle) => {
  const slug = getArticleEntity(item).main_tag?.slug;
  return slug ? `/${slug}` : "";
};

const articleNode = (item: CategoryArticle, key: string, ...modifiers: string[]): GridNode => ({
  type: "article",
  key: `grid-${key}-${getArticleId(item) ?? ""}`,
  item,
  className: ["grid-article__item", ...modifiers].filter(Boolean).join(" "),
});

const nodes = computed<GridNode[]>(() =>
  props.batches.flatMap((batch, batchIndex) => {
    const result: GridNode[] = [];
    let middle = batch;

    if (batchIndex === 0 && middle[0]) {
      result.push(articleNode(middle[0], "0-first", "grid-article__item--full", "grid-article__item--first"));
      middle = middle.slice(1);
    }

    const last = middle.length ? middle[middle.length - 1] : undefined;
    middle = middle.slice(0, -1);

    const tickerAt = Math.floor(middle.length / 4) * 2;

    middle.forEach((item, index) => {
      if (index === tickerAt && tickerAt > 0) result.push({ type: "ticker", key: `ticker-${batchIndex}` });
      result.push(articleNode(item, `${batchIndex}-${index}`, gridItemModifiers[index % gridItemModifiers.length] ?? ""));
    });

    if (last) {
      result.push(articleNode(last, `${batchIndex}-last`, "grid-article__item--full", "grid-article__item--last"));
    }

    return result;
  }),
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

  &__ticker {
    flex-shrink: 0;
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

    &--full {
      width: 100%;

      picture {
        height: 720px;

        @include responsive1279 {
          height: 480px;
        }

        @include responsive1023 {
          height: 360px;
        }

        @include responsive767 {
          height: auto;
        }
      }

      .grid-article__link {
        max-width: 760px;
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

    &:hover {
      opacity: 1;
    }

    &:first-letter {
      text-transform: uppercase;
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

  &__content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
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

  .grid-article__item--last,
  .grid-article__item--full {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    align-content: center;
    padding-left: 100px;

    @include responsive1599 {
      padding-left: 50px;
    }

    @include responsive1439 {
      padding-left: 0;
      grid-template-columns: 1fr 1fr;
    }

    @include responsive1023 {
      display: flex;
      flex-direction: column;
    }

    picture {
      height: auto;
      padding-top: calc(1440 / 1920 * 100%);
    }

    .grid-article__media {
      grid-column: 2/5;
      grid-row: 1/5;

      @include responsive1023 {
        width: 100%;
      }
    }

    .grid-article__content {
      grid-column: 1/2;
      grid-row: 2/3;

      @include responsive1023 {
        position: absolute;
        left: 0;
        backdrop-filter: blur(10px);
        background: rgba(0, 0, 0, .1);
        background: linear-gradient(180deg, rgba(0, 0, 0, .1) 0, rgba(0, 0, 0, .5));
        bottom: 0;
        transform: translateY(0);
        width: 100%;
        padding: 10px;
        color: $colorWhite;
      }
    }

    .grid-article__link {
      font-size: 32px;
      padding-left: 30px;
      max-width: 450px;
      margin-top: auto;


      @include responsive1599 {
        font-size: 20px;
        line-height: 24px;
        padding-left: 20px;
      }

      @include responsive1023 {
        font-size: 16px;
        line-height: 20px;
        margin: 0;
        padding-top: 0;
      }
    }

    .grid-article__desc {
      padding-left: 32px;

      @include responsive1599 {
        padding-left: 21px;
      }

      @include responsive1023 {
        color: $colorWhite;
        opacity: 1;
        margin-top: 5px;
      }
    }
  }
}
</style>
