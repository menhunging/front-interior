<template>
  <div class="article-view" :class="`_editor_${editor}`" itemscope itemtype="http://schema.org/Article">
    <link :href="absoluteUrl" itemprop="url mainEntityOfPage">
    <meta itemprop="datePublished" :content="article.publication_start_datetime || article.created_at">
    <meta itemprop="dateModified" :content="article.updated_at">

    <div v-if="wideCover && isFirst" class="article-view__wide-cover">
      <video v-if="isVideoUrl(wideCover)" :src="wideCover" autoplay loop muted playsinline itemprop="image" />
      <img v-else :src="wideCover" :alt="article.title" itemprop="image">
    </div>

    <div class="article-view__wrapper">
      <div v-if="article.template !== 'specproject'" class="article-view__header">
        <NuxtLink v-if="section" :to="section.url" class="article-view__category" itemprop="articleSection">
          <span class="text-default">{{ section.title }}</span>
        </NuxtLink>
        <h1 class="article-view__title" itemprop="name headline">{{ article.title }}</h1>
        <p v-if="date" class="article-view__date">{{ date }}</p>
        <span v-if="article.description" class="article-view__description" itemprop="description"
          v-html="article.description" />
      </div>

      <div v-if="!wideCover && defaultCover && article.template !== 'trend'" class="article-view__cover">
        <video v-if="isVideoUrl(defaultCover)" :src="defaultCover" autoplay loop muted playsinline itemprop="image" />
        <img v-else :src="defaultCover" :alt="article.title" itemprop="image">
      </div>

      <div class="article-view__body">
        <article ref="contentRef" :class="{ 'article-view__text': editor === 'default' }" itemprop="articleBody"
          :data-content-version="isMobile ? 'mobile' : 'desktop'" v-html="content" />
      </div>
    </div>

    <div class="article-view__footer">
      <div v-if="article.author" class="article-view__author">
        <span class="article-view__label">Автор:</span>
        <meta itemprop="author" :content="article.author.title">
        <NuxtLink :to="`/author/${article.author.slug}`" class="article-view__author-link">
          <span class="text-default">{{ article.author.title }}</span>
        </NuxtLink>
        <div v-if="article.author.avatar?.file?.path_string || article.author.speciality"
          class="article-view__author-info">
          <img v-if="article.author.avatar?.file?.path_string" :src="article.author.avatar.file.path_string"
            :alt="article.author.title">
          <strong v-if="article.author.speciality">{{ article.author.speciality }}</strong>
        </div>
      </div>

      <div v-for="(source, index) in article.source" :key="index" class="article-view__source">
        <span class="article-view__label">{{ source.type }}:</span>
        <a v-if="source.url" :href="source.url" target="_blank" rel="noopener">
          <span class="text-default">{{ source.title }}</span>
        </a>
        <span v-else>{{ source.title }}</span>
      </div>

      <div class="article-view__shares">
        <span class="article-view__label">Поделиться:</span>
        <a v-for="share in shares" :key="share.name" :href="share.href" target="_blank" rel="noopener"
          :class="`article-view__share article-view__share--${share.name}`">{{ share.name }}</a>
      </div>
    </div>

    <div v-if="tags.length" class="article-view__tags offset-block">
      <div class="article-view__tags-track">
        <div v-for="list in 2" :key="list" class="article-view__tags-list" :aria-hidden="list === 2 || undefined">
          <NuxtLink v-for="tag in tags" :key="tag.slug" :to="`/${tag.slug}`" class="article-view__tag"
            :itemprop="list === 1 ? 'about' : undefined">
            <span class="text-default">#{{ tag.name }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <ArticleRelated v-if="article.related?.length" :articles="article.related" />

    <ArticleNext v-if="article.next" :article="article.next" @click="emit('next')" />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css/pagination";
import type { Article } from "../../api/articles";
import type { ArticleEditor } from "../../utils/article";

const props = defineProps<{
  article: Article;
  isFirst: boolean;
}>();

const emit = defineEmits<{
  next: [];
  mounted: [editor: ArticleEditor];
}>();

const appConfig = useAppConfig();
const isMobile = useIsMobile();

const content = computed(() => prepareArticleContent(props.article.content, isMobile));
const editor = computed(() => getArticleEditor(content.value));

const absoluteUrl = computed(() => `${appConfig.hostCanonical}${getArticleUri(props.article)}`);
const date = computed(() => formatArticleDate(props.article.publication_start_datetime));
const wideCover = computed(() => props.article.cover_wide?.path ?? "");
const defaultCover = computed(() => props.article.cover_default?.path ?? "");
const tags = computed(() => props.article.tags ?? []);

const section = computed(() => getArticleSection(props.article));

const shares = computed(() => {
  const url = encodeURIComponent(absoluteUrl.value);
  return [
    { name: "vk", href: `https://vk.com/share.php?url=${url}` },
    { name: "tg", href: `https://t.me/share/url?url=${url}` },
    { name: "pinterest", href: `https://pinterest.com/pin/create/link/?url=${url}` },
  ];
});

const contentRef = ref<HTMLElement | null>(null);
const sliders: Swiper[] = [];

// галереи старого редактора приходят плоским списком .slide — оборачиваем в разметку swiper
const initGalleries = (root: HTMLElement) => {
  root.querySelectorAll<HTMLElement>(".gallery").forEach((gallery) => {
    gallery.innerHTML =
      `<div class="swiper"><div class="swiper-wrapper">${gallery.innerHTML}</div><div class="swiper-pagination"></div></div>` +
      '<div class="swiper-button-prev"></div><div class="swiper-button-next"></div>';

    sliders.push(
      new Swiper(gallery.querySelector<HTMLElement>(".swiper")!, {
        modules: [Navigation, Pagination],
        slideClass: "slide",
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        navigation: {
          nextEl: gallery.querySelector<HTMLElement>(".swiper-button-next"),
          prevEl: gallery.querySelector<HTMLElement>(".swiper-button-prev"),
        },
        pagination: { el: gallery.querySelector<HTMLElement>(".swiper-pagination"), type: "progressbar" },
      }),
    );
  });
};

// горизонтальные фото в старом редакторе растягиваются шире колонки текста
const markWideImages = (root: HTMLElement) => {
  root.querySelectorAll<HTMLImageElement>("figure.image img, div.photo img, p img").forEach((img) => {
    if (img.closest(".gallery")) return;

    const mark = () => {
      if (img.naturalWidth > img.naturalHeight) img.closest("figure, div.photo, p")?.classList.add("wide-image");
    };
    if (img.complete) mark();
    else img.addEventListener("load", mark, { once: true });
  });
};

const PIN_MIN_SIZE = 200;

const addPinterestButton = (img: HTMLImageElement) => {
  if (img.clientWidth < PIN_MIN_SIZE || img.clientHeight < PIN_MIN_SIZE || img.closest(".pinterest-wrapper")) return;

  const wrapper = document.createElement("div");
  wrapper.className = "pinterest-wrapper";
  wrapper.style.marginBottom = getComputedStyle(img).marginBottom;
  img.style.marginBottom = "0";
  img.replaceWith(wrapper);
  wrapper.append(img);

  const params = new URLSearchParams({ url: absoluteUrl.value, media: img.currentSrc || img.src });
  const description = img.alt || img.title;
  if (description) params.set("description", description);

  const pin = document.createElement("a");
  pin.className = "pinterest-link font-icons_pinterest";
  pin.href = `https://pinterest.com/pin/create/button/?${params}`;
  pin.target = "_blank";
  pin.rel = "noopener";
  wrapper.append(pin);
};

// размер известен только после загрузки, а lazy-картинки грузятся по мере скролла
const initPinterest = (root: HTMLElement) => {
  root.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
    if (img.complete) addPinterestButton(img);
    else img.addEventListener("load", () => addPinterestButton(img), { once: true });
  });
};

onMounted(async () => {
  await nextTick();
  const root = contentRef.value;
  if (!root) return;

  if (editor.value === "default") {
    initGalleries(root);
    markWideImages(root);
  }

  if (editor.value !== "verstka" && !props.article.hide_pinterest && !props.article.is_banners_disabled) {
    initPinterest(root);
  }

  (window as Window & { instgrm?: { Embeds: { process: () => void } } }).instgrm?.Embeds.process();
  window.dispatchEvent(new Event("resize"));
  emit("mounted", editor.value);
});

onBeforeUnmount(() => {
  sliders.forEach((slider) => slider.destroy(true));
});
</script>

<style lang="scss">
@mixin garamond {
  font-family: "EBGaramond", serif;
}

.article-view {
  position: relative;

  &__wide-cover {
    margin: 32px 0;

    img,
    video {
      display: block;
      width: 100%;
      height: auto;
      object-fit: cover;
      object-position: center;

      @media (min-width: 1440px) {
        height: 590px;
      }

      @media (min-width: 1680px) {
        height: 790px;
      }
    }
  }

  &__wrapper {
    max-width: 1280px;
    margin: 0 auto;
  }

  &__header {
    position: relative;
    width: 100%;
    padding-top: 32px;

    @include responsive767 {
      padding-top: 16px;
    }

    @media (min-width: 1280px) {
      width: 884px;
    }

    @media (min-width: 1440px) {
      width: 950px;
    }
  }

  &__category {
    font-size: 16px;
    line-height: 20px;
    text-decoration: none;
    color: $colorBlack;
    @include hoverDefault($colorDark, 1px, 0.3s);
  }

  &__title {
    font-size: 7.5vw;
    line-height: 125%;
    font-weight: 400;
    text-transform: none;
    margin: 8px 0;

    @media (min-width: 768px) {
      font-size: 32px;
      margin-bottom: 16px;
    }

    @media (min-width: 1024px) {
      font-size: 48px;
    }

    @media (min-width: 1280px) {
      font-size: 56px;
      margin-bottom: 24px;
    }

    @media (min-width: 1440px) {
      font-size: 68px;
      margin-bottom: 32px;
    }
  }

  &__date {
    font-size: 16px;
    line-height: 20px;

    @include responsive767 {
      font-size: 14px;
      margin-bottom: 10px;
    }

    @media (min-width: 1280px) {
      position: absolute;
      top: 32px;
      right: -10px;
    }

    @media (min-width: 1500px) {
      right: -10%;
    }
  }

  &__description {
    display: block;
    font-weight: 200;
    font-size: 12px;
    line-height: 125%;
    margin-top: 16px;
    margin-bottom: 48px;

    @media (min-width: 1024px) {
      font-size: 16px;
    }

    @media (min-width: 1440px) {
      font-size: 24px;
    }
  }

  &__cover {
    display: flex;
    justify-content: center;
    margin: 32px 0;

    img,
    video {
      width: 100%;
      height: auto;
      max-width: 768px;
      max-height: 514px;
      object-fit: cover;
    }
  }

  &__body {
    width: 100%;
    margin-top: 32px;

    img {
      max-width: 100%;
      height: auto;
    }
  }

  // ========== стандартный редактор ==========
  &__text {
    width: 100%;
    margin: 0 auto;

    @media (min-width: 425px) {
      width: 425px;
    }

    @media (min-width: 768px) {
      width: 494px;
    }

    @media (min-width: 1024px) {
      width: 664px;
    }

    @media (min-width: 1280px) {
      width: 610px;
    }

    @media (min-width: 1440px) {
      width: 542px;
    }

    @media (min-width: 1680px) {
      width: 662px;
    }

    p,
    .slide,
    figure.image,
    .gallery {
      margin: 40px 0;

      @media (min-width: 425px) {
        margin: 48px 0;
      }
    }

    p {
      @include garamond;
      font-size: 21px;
      line-height: 135%;
    }

    a {
      font-weight: bold;

      &:visited {
        color: #999;
      }

      &:hover {
        text-decoration: underline;
        color: $colorBlack;
      }
    }

    iframe {
      width: 100%;
    }

    figure.image,
    .slide .photo,
    .slide .photo span.name {
      @include garamond;
      font-style: italic;
      font-size: 16px;
      line-height: 125%;
      text-align: right;
      margin-top: 8px;
      display: block;

      @media (min-width: 768px) {
        display: flex;
        flex-direction: column;
      }
    }

    figure.wide-image,
    div.wide-image {
      width: 100%;
      max-width: none;

      img {
        width: 100%;
        max-width: none;
        margin-bottom: 8px;
      }
    }

    p.related {
      font-family: $fontMain;
      font-weight: bold;
      font-size: 16px;
      line-height: 125%;
      background-image: url("/img/article/related.png");
      background-size: 73px;
      background-repeat: no-repeat;
      padding-top: 16px;

      a {
        font-family: $fontMain;
        font-weight: 400;
        font-size: 14px;
        color: #888;
      }
    }

    blockquote {
      background-image: url("/img/article/quotes.svg");
      background-repeat: no-repeat;
      background-size: 80px;
      padding-top: 30px;

      p {
        font-family: $fontMain;
        text-transform: uppercase;
        font-weight: 200;
        font-size: 24px;
        line-height: 125%;
      }
    }

    aside {
      text-align: left;
      overflow: hidden;
      font-size: 14px;

      .photo {
        display: flex;
        flex-direction: column;
        margin-bottom: 8px;
      }

      .pic {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        margin-bottom: 8px;
      }

      span.name {
        font-family: $fontMain;
        font-weight: bold;
        font-style: normal;
      }

      .prof {
        @include garamond;
        font-style: italic;
      }

      p.txt {
        font-family: $fontMain;
        font-size: 16px;
        margin: 8px 0;
      }

      @media (min-width: 768px) {
        float: left;
        clear: both;
        width: 136px;
        margin-left: -160px;
      }

      @media (min-width: 1440px) {
        width: 194px;
        margin-left: -230px;
      }
    }

    .gallery {
      position: relative;
      width: 100%;

      @include responsive767 {
        width: 80vw;
        margin-left: auto;
        margin-right: auto;
      }

      .swiper-wrapper {
        justify-content: flex-start;
      }

      .swiper-wrapper > p {
        display: none;
      }

      .slide {
        flex-shrink: 0;
        width: 100%;
        margin: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .name {
        @include garamond;
        font-style: italic;
        font-size: 17px;
        line-height: 125%;
        text-align: right;
        align-self: flex-end;
      }

      .swiper-button-prev,
      .swiper-button-next {
        --swiper-navigation-size: 25px;
        color: $colorBlack;
        top: 40%;
      }

      .swiper-button-prev {
        left: -35px;
      }

      .swiper-button-next {
        right: -35px;
      }

      .swiper-pagination {
        --swiper-theme-color: #{$colorBlack};
      }
    }
  }

  .tohka {
    display: inline-block;
    margin-right: 5px;
  }

  // ========== setka: тема рассчитана на css-grid, переводим колонки на flex ==========
  :not(#stk) .stk-post.stk-post {
    display: block !important;
    max-width: initial !important;
    grid-template-columns: auto !important;

    &.stk-post {
      .stk-grid {
        display: flex !important;
        justify-content: center;
        grid-column: initial;
        min-width: initial;
        max-width: initial;
        gap: 24px;
        grid-template-columns: auto !important;
      }

      .stk-grid-col {
        grid-column: initial;
        min-width: initial;
        flex-basis: initial;

        &[data-col-width="8"] + [data-col-width="2"] {
          width: 180px;

          &.stk-grid-col_last {
            margin-left: -220px;

            @media (max-width: 1639px) {
              margin-left: 50px;
            }

            @include responsive1279 {
              margin-left: 0;
              width: auto;
            }
          }
        }

        a,
        strong {
          display: inline !important;
        }

        .pinterest-link {
          display: flex !important;
        }

        &.stk-grid-col_empty {
          display: none !important;
        }
      }

      [class*="__separator_"] {
        display: flex !important;
      }

      [data-col-width="12"] {
        width: 100%;
        max-width: 100%;
        flex-basis: initial;
      }

      [data-col-width="2"] {
        width: 180px;
      }

      [data-col-width="8"] {
        max-width: 850px;
        margin-left: auto;
        margin-right: auto;
        flex-basis: initial;
      }

      [data-col-width="5"] {
        max-width: 520px;
      }

      [data-col-width="6"] {
        max-width: 100%;
        width: calc(50% - 20px);
        margin-left: 0;
        margin-right: 0;
        flex-basis: initial;

        .stk-image-figure .figcaption {
          display: none !important;
        }
      }
    }

    .stk-image-figure {
      display: flex;
      grid-template-rows: initial;
      grid-template-columns: initial;

      & > :first-child {
        grid-column: initial;
        grid-row: initial;
      }
    }

    &.stk-post > * {
      grid-column: initial;
      min-width: initial;
      max-width: initial;
    }

    [class*="overhangs"] {
      grid-column-start: initial;
      grid-column-end: initial;
      max-width: initial;
    }

    .stk-code_keep-ratio .stk-code[style*="stk-embed-height-ratio"] > iframe {
      position: relative;
    }

    @media (max-width: 768px) {
      &.stk-post {
        [data-col-width="6"],
        [data-col-width="2"],
        .stk-grid-col[data-col-width="8"] + [data-col-width="2"].stk-grid-col_last {
          flex-basis: auto;
          margin-left: 0;
          margin-right: 0;
          max-width: 100%;
          width: 100%;
        }

        .stk-grid {
          margin-left: 0 !important;
          margin-right: 0 !important;
          padding-left: 0 !important;
          padding-right: 0 !important;

          figure,
          .stk-mask {
            margin-left: 0 !important;
            margin-right: 0 !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }

          [data-col-width="12"] {
            flex-basis: auto;
            margin-left: auto;
            margin-right: 0;
            max-width: 100%;
            width: 100%;
          }
        }

        [data-col-width="12"] figure,
        .stk-grid-col[data-col-width="8"] figure {
          margin: 0 -10px !important;
          padding: 0 !important;
          width: calc(100% + 20px) !important;
        }
      }
    }
  }

  // в Safari у setka слетает grid — принудительно раскладываем блоки
  &._editor_setka &__body * :not([href], .swiper-button-prev, .swiper-button-next, .swiper, .swiper-wrapper,
  script, iframe, .stk-gallery.stk-gallery_init, .stk-gallery_arrow, .stk-gallery_counter,
  .stk-gallery_counter__current, .stk-gallery_counter__divider, .stk-gallery_counter__total, .stk-gallery_dots,
  .stk-gallery_dot, .tohka, span.stk-reset, a.stk-reset, em, style, img) {
    display: block !important;
    width: 100%;
  }

  &._editor_setka &__body em {
    margin-right: 5px;
  }

  // verstka.org сама задаёт ширину макета
  &._editor_verstka &__wrapper {
    max-width: none;
  }

  &._editor_verstka &__header {
    max-width: 1280px;
    margin-left: auto;
    margin-right: auto;
  }

  &._editor_verstka &__body {
    display: flex;
    justify-content: center;
    overflow: visible;
  }

  // ========== подвал статьи ==========
  &__footer {
    margin: 90px 0 0;

    @media (min-width: 1920px) {
      padding: 0 156px;
    }

    @include responsive767 {
      margin-top: 40px;
    }
  }

  &__label {
    display: inline-block;
    margin-right: 10px;
    font-size: 16px;
    line-height: 135%;
  }

  &__author,
  &__source {
    margin-bottom: 5px;
    font-weight: 600;

    a {
      color: $colorBlack;
      @include hoverDefault($colorDark, 1px, 0.3s);
    }
  }

  &__author-info {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 6px 0;
    font-size: 14px;

    @include responsive767 {
      font-size: 11px;
      line-height: 14px;
    }

    img {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      object-fit: cover;
    }

    strong {
      font-weight: 300;
      max-width: 240px;
    }
  }

  &__shares {
    display: flex;
    align-items: center;
    margin: 50px 0 64px;

    @include responsive767 {
      margin: 32px 0 40px;
    }
  }

  &__share {
    width: 50px;
    height: 50px;
    font-size: 0;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 25px;
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
      background-size: 20px;
    }
  }

  &__tags {
    padding-top: 16px;
    padding-bottom: 16px;
    background-color: $colorBlack;
  }

  &__tags-track {
    display: flex;
    width: max-content;
    animation: marquee 60s linear infinite;

    &:hover {
      animation-play-state: paused;
    }
  }

  &__tags-list {
    display: flex;
    flex-shrink: 0;
    gap: 16px;
    padding-right: 16px;
  }

  &__tag {
    white-space: nowrap;
    font-size: 14px;
    line-height: 17px;
    text-transform: uppercase;
    text-decoration: none;
    color: $colorWhite;
    @include hoverDefault($colorWhite, 1px, 0.3s);
  }
}
</style>
