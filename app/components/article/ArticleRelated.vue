<template>
  <section class="article-related">
    <h2 class="caption caption--h3 article-related__caption">Читайте также</h2>

    <div class="article-related__list">
      <div v-for="item in items" :key="item.id" class="article-related__item">
        <NuxtLink :to="item.url" class="article-related__media">
          <picture>
            <video v-if="isVideoUrl(item.image)" autoplay muted loop playsinline preload="metadata"
              :aria-label="item.title">
              <source :src="item.image" :type="getVideoMimeType(item.image)">
            </video>
            <img v-else-if="item.image" :src="item.image" :alt="item.title" loading="lazy">
          </picture>
        </NuxtLink>

        <NuxtLink :to="item.url" class="article-related__link">
          <span class="text-default">{{ item.title }}</span>
        </NuxtLink>
        <NuxtLink v-if="item.tag" :to="item.tag.url" class="article-related__tag">
          <span class="text-default">{{ item.tag.title }}</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ArticlePreview } from "../../api/articles";

const props = defineProps<{
  articles: ArticlePreview[];
}>();

const getImage = (article: ArticlePreview) => {
  const cover = article.cover_preview_narrow ?? article.cover_preview;
  if (!cover?.path) return getCoverMedia(article);
  if (isVideoUrl(cover.path) || !cover.rel_path) return cover.path;
  return getThumbUrl(cover.rel_path, 528, 396);
};

const items = computed(() =>
  props.articles.slice(0, 4).map((article) => ({
    id: article.id,
    title: article.title,
    url: getArticleUri(article),
    image: getImage(article),
    tag: article.main_tag ? { title: article.main_tag.name, url: `/${article.main_tag.slug}` } : null,
  })),
);
</script>

<style lang="scss" scoped>
.article-related {
  padding: 64px 0 48px;

  @include responsive767 {
    padding: 32px 0;
  }

  &__caption {
    margin-bottom: 24px;
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;

    @include responsive1023 {
      grid-template-columns: repeat(2, 1fr);
      gap: 24px 16px;
    }

    @include responsive767 {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      gap: 12px;
    }
  }

  &__item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    @include responsive767 {
      flex: 0 0 75%;
      scroll-snap-align: start;
    }
  }

  &__media {
    display: flex;
    width: 100%;

    &:hover + .article-related__link {
      &::before {
        transform: rotate(180deg);
      }

      .text-default {
        background-size: 100% 100%;
      }
    }
  }

  picture {
    position: relative;
    width: 100%;
    padding-top: 75%;

    img,
    video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__link {
    position: relative;
    padding-left: 15px;
    padding-top: 16px;
    font-size: 16px;
    line-height: 20px;
    color: $colorBlack;
    @include hoverDefault($colorDark, 1px, 0.3s);
    @include plusIconLeft;

    &::before {
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

  &__tag {
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
  }
}
</style>
