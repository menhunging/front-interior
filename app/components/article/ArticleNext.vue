<template>
  <div class="article-next">
    <button type="button" class="article-next__item article-next__label" @click="emit('click')">
      <span class="text-default">Далее</span>
    </button>
    <NuxtLink v-if="section" :to="section.url" class="article-next__item article-next__category">
      <span class="text-default">{{ section.title }}</span>
    </NuxtLink>
    <button type="button" class="article-next__item article-next__title" @click="emit('click')">
      <span class="text-default">{{ article.title }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ArticlePreview } from "../../api/articles";

const props = defineProps<{
  article: ArticlePreview;
}>();

const emit = defineEmits<{
  click: [];
}>();

const section = computed(() => getArticleSection(props.article));
</script>

<style lang="scss" scoped>
.article-next {
  position: sticky;
  bottom: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 15vw;
  min-height: 56px;
  background-color: rgba(250, 250, 250, 0.5);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);

  @media (max-width: 600px) {
    gap: 16px;
  }

  &__item {
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    text-align: left;
    text-decoration: none;
    color: $colorBlack;
    cursor: pointer;
    @include hoverDefault($colorBlack, 1px, 0.3s);
  }

  &__label {
    flex-shrink: 0;
  }

  &__category {
    flex-shrink: 0;

    @media (max-width: 600px) {
      display: none;
    }
  }

  &__title {
    font-weight: 700;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
</style>
