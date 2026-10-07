<template>
  <div class="news-note" :class="`_editor_${editor}`">
    <div class="news-note__header">
      <NuxtLink v-if="mark" :to="mark.url" class="news-note__mark">
        <span class="text-default">{{ mark.title }}</span>
      </NuxtLink>
      <component :is="isFirst ? 'h1' : 'h2'" class="news-note__title" v-html="note.title" />
      <template v-if="image">
        <video v-if="isVideoUrl(image)" :src="image" class="news-note__image" autoplay loop muted playsinline />
        <img v-else :src="image" :alt="note.title" :title="note.title" class="news-note__image">
      </template>
    </div>

    <div class="news-note__content" v-html="content" />

    <div v-if="related.length" class="news-note__related">
      <div v-for="item in related" :key="item.id" class="news-note__related-item">
        <span class="news-note__related-title">Смотреть полный материал: </span>
        <NuxtLink :to="getRelatedUri(item)" class="news-note__related-link">
          <span class="text-default">{{ item.title }}</span>
        </NuxtLink>
      </div>
    </div>

    <div class="news-note__footer">
      <div class="news-note__shares">
        <span class="news-note__shares-title">Поделиться:</span>
        <a v-for="share in shares" :key="share.name" :href="share.href" target="_blank" rel="noopener"
          :class="`news-note__share news-note__share--${share.name}`">{{ share.name }}</a>
      </div>
      <div v-if="note.tags?.length" class="news-note__tags">
        <NuxtLink v-for="tag in note.tags" :key="tag.slug" :to="`/${tag.slug}`" class="news-note__tag">
          <span class="text-default">#{{ tag.name }}</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted } from "vue";
import { getNewsUrl, type NewsNoteItem } from "../../api/articles";
import type { ArticleEditor } from "../../utils/article";

type RelatedItem = NonNullable<NewsNoteItem["related"]>[number];

const props = defineProps<{
  note: NewsNoteItem;
  isFirst: boolean;
}>();

const emit = defineEmits<{
  mounted: [editor: ArticleEditor];
}>();

const appConfig = useAppConfig();
const isMobile = useIsMobile();

const uri = computed(() => getNewsUrl(props.note));
const content = computed(() => prepareArticleContent(props.note.description || props.note.content, isMobile));
const editor = computed(() => getArticleEditor(content.value));

const mark = computed(() => {
  const section = getArticleSection(props.note);
  return section ? { ...section, title: section.title.charAt(0).toUpperCase() + section.title.slice(1) } : null;
});

const image = computed(() => {
  const cover = props.note.cover_preview;
  if (!cover?.path) return "";
  if (isVideoUrl(cover.path) || !cover.rel_path) return cover.path;
  return encodeURI(getThumbUrl(cover.rel_path, 948, 550));
});

const related = computed(() =>
  props.note.related_material?.length ? props.note.related_material : props.note.related ?? [],
);

const getRelatedUri = (item: RelatedItem) => {
  if (item.entity_name === "Events") return `/guide/${item.city_slug}/events/${item.slug}?mode=list`;
  if (item.entity_name === "Places") return `/guide/${item.city_slug}/places/${item.slug}?mode=list`;
  return getArticleUri(item) || "/";
};

const shares = computed(() => {
  const url = encodeURIComponent(`${appConfig.hostCanonical}${uri.value}`);
  return [
    { name: "vk", href: `https://vk.com/share.php?url=${url}` },
    { name: "tg", href: `https://t.me/share/url?url=${url}` },
    { name: "pinterest", href: `https://pinterest.com/pin/create/link/?url=${url}` },
  ];
});

onMounted(async () => {
  await nextTick();
  (window as Window & { instgrm?: { Embeds: { process: () => void } } }).instgrm?.Embeds.process();
  emit("mounted", editor.value);
});
</script>

<style lang="scss" scoped>
.news-note {
  &__mark {
    display: inline-block;
    margin-bottom: 8px;
    font-size: 14px;
    line-height: 125%;
    color: $colorBlack;
    @include hoverDefault($colorBlack, 1px, 0.3s);
  }

  &__title {
    margin: 0 0 48px;
    font-size: 68px;
    line-height: 125%;
    font-weight: 400;
    text-transform: none;

    @include responsive1279 {
      font-size: 48px;
    }

    @include responsive767 {
      margin-bottom: 24px;
      font-size: 32px;
    }
  }

  &__image {
    display: block;
    width: 100%;
    height: auto;
    margin-bottom: 48px;

    @include responsive767 {
      margin-bottom: 24px;
    }
  }

  &__content {
    font-family: "EBGaramond", serif;
    font-size: 21px;
    line-height: 125%;

    :deep(img) {
      max-width: 100%;
      height: auto;
    }

    :deep(iframe) {
      max-width: 100%;
    }

    :deep(.stk-post) {
      padding-left: 0 !important;
      padding-right: 0 !important;

      & > .stk-grid:last-child {
        margin-bottom: 0 !important;
      }
    }
  }

  &__related {
    margin-top: 56px;
    display: flex;
    flex-direction: column;
    gap: 32px;

    @include responsive767 {
      margin-top: 24px;
    }
  }

  &__related-item {
    font-size: 16px;
    line-height: 125%;

    &::before {
      content: "";
      display: block;
      width: 72px;
      height: 12px;
      margin-bottom: 6px;
      background: $colorBlack;
    }

    @include responsive767 {
      font-size: 14px;
    }
  }

  &__related-title {
    font-weight: 600;
  }

  &__related-link {
    font-weight: 200;
    color: rgba($colorBlack, 0.5);
    transition: color 0.3s;
    @include hoverDefault($colorBlack, 1px, 0.3s);

    &:hover {
      color: $colorBlack;
    }
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 64px;
    margin-top: 56px;

    @include responsive1023 {
      flex-direction: column-reverse;
      gap: 24px;
    }

    @include responsive767 {
      margin-top: 24px;
    }
  }

  &__shares {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    gap: 12px;
    font-size: 16px;
    line-height: 20px;
  }

  &__share {
    width: 24px;
    height: 20px;
    font-size: 0;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    transition: transform 0.3s;

    &:hover {
      transform: scale(0.9);
    }

    &--vk {
      background-image: url("/svg/share-vk2.svg");
    }

    &--tg {
      background-image: url("/svg/share-tg.svg");
    }

    &--pinterest {
      background-image: url("/svg/pn.svg");
      background-size: 16px;
    }
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px 16px;

    @include responsive1023 {
      justify-content: flex-start;
    }
  }

  &__tag {
    font-size: 14px;
    line-height: 125%;
    text-transform: uppercase;
    color: $colorBlack;
    @include hoverDefault($colorBlack, 1px, 0.3s);
  }
}
</style>
