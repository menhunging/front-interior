<template>
  <div>
    <section class="grettings">

      <div v-if="slides.length" class="grettings__media">
        <Swiper v-if="isHeroSlider" class="grettings__slider" v-bind="heroSwiperConfig">
          <SwiperSlide v-for="(slide, index) in slides" :key="slide.id" class="grettings__slide">
            <video v-if="isVideoUrl(slide.image)" autoplay muted loop playsinline :aria-label="slide.title">
              <source :src="slide.image" :type="getVideoMimeType(slide.image)">
            </video>
            <img v-else :src="index === 0 || imagesReady ? slide.image : undefined" :alt="slide.title"
              :title="slide.title" :fetchpriority="index === 0 ? 'high' : 'low'" decoding="async">
            <NuxtLink :to="slide.url" class="grettings__invisLink" />
            <NuxtLink :to="slide.url" class="grettings__link">
              <span class="text-default">{{ slide.title }}</span>
            </NuxtLink>
          </SwiperSlide>
          <div class="grettings__dots"></div>
          <button type="button" class="grettings__prev" aria-label="Предыдущий слайд"></button>
          <button type="button" class="grettings__next" aria-label="Следующий слайд"></button>
        </Swiper>

        <template v-else>
          <video v-if="isVideoUrl(slides[0]!.image)" autoplay muted loop playsinline :aria-label="slides[0]!.title">
            <source :src="slides[0]!.image" :type="getVideoMimeType(slides[0]!.image)">
          </video>
          <img v-else :src="slides[0]!.image" :alt="slides[0]!.title" :title="slides[0]!.title" fetchpriority="high">
          <NuxtLink :to="slides[0]!.url" class="grettings__invisLink" />
          <NuxtLink :to="slides[0]!.url" class="grettings__link">
            <span class="text-default">{{ slides[0]!.title }}</span>
          </NuxtLink>
        </template>
      </div>

      <div class="news">
        <span class="caption caption--h3">новости</span>
        <div class="news__list">
          <div class="news__item" v-for="item in newsItems" :key="item.id">
            <NuxtLink :to="item.url">
              <span class="text-default">{{ item.title }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section v-if="specProjects.length" class="special-projects offset-block">
      <div class="section-title">
        <h2 class="caption caption--h2">Спецпроекты</h2>
      </div>
      <Swiper class="special-projects__slider" v-bind="swiperConfig">
        <SwiperSlide v-for="item in specProjects" :key="item.id">
          <NuxtLink :to="item.url" class="special-projects__invisLink">
            <picture class="picture">
              <video v-if="item.video" autoplay muted loop playsinline preload="metadata"
                :poster="item.image || undefined" :aria-label="item.title">
                <source :src="item.video" :type="getVideoMimeType(item.video)">
              </video>
              <img v-else :src="item.image" :srcset="`${item.image2x} 2x`" :alt="item.title" loading="lazy" />
            </picture>
          </NuxtLink>
          <div class="special-projects__content">
            <NuxtLink :to="item.url" class="special-projects__link">
              <span class="text-default">{{ item.title }}</span>
            </NuxtLink>
            <NuxtLink v-if="item.tag" :to="item.url" class="special-projects__cat">
              <span class="text-default">{{ item.tag }}</span>
            </NuxtLink>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>

    <!-- TODO это баннеры с рекламой, пока ствим заглушку как в дизайне -->
    <!-- <section class="full-block">
      <a href="#" class="full-block__media">
        <picture>
          <img src="https://api.interior.ru/media/thumb/1650x930_5/lavrikova/Obl1920x1100_292.jpg" alt="">
        </picture>
      </a>
    </section> -->

    <GridArticleSection :items="homeItems" :start="0" :end="8" />

    <section class="news news--mobile">
      <span class="caption caption--h3">новости</span>
      <div class="news__list">
        <div class="news__item" v-for="item in newsItems" :key="item.id">
          <NuxtLink :to="item.url">
            <span class="text-default">{{ item.title }}</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <TickerSection />

    <GridArticleSection :items="homeItems" :start="8" :end="16" />

    <section v-if="events.length" class="events-moscow offset-block">
      <div class="section-title">
        <h2 class="caption caption--h2">События в Москве</h2>
      </div>

      <ClientOnly>
        <Swiper class="events-moscow__slider" v-bind="swiperEventsConfig">
          <SwiperSlide v-for="event in events" :key="event.id">
            <NuxtLink :to="event.url" class="events-moscow__invisLink">
              <picture class="picture">
                <img :src="event.image" :alt="event.title" loading="lazy" />
              </picture>
            </NuxtLink>
            <div class="events-moscow__content">
              <NuxtLink :to="event.url" class="events-moscow__link">
                <span class="text-default">{{ event.title }}</span>
              </NuxtLink>

              <span v-if="event.dates" class="events-moscow__date">{{ event.dates }}</span>
              <span v-if="event.place" class="events-moscow__name">{{ event.place }}</span>
              <span v-if="event.address" class="events-moscow__adress">{{ event.address }}</span>
            </div>
          </SwiperSlide>
        </Swiper>
      </ClientOnly>
    </section>

    <GridArticleSection :items="homeItems" :start="16" :end="24" :show-more="true" @expanded="showArticleMore = true" />

    <!-- это просто подгрузка статей в конце списка по клику на кнопку "Показать больше статей" -->
    <ArticleMoreSection v-if="showArticleMore" :initial-items="[]" :initial-offset="51" :batch-size="50" />

    <PrintJournalSection />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";

import type { ArticleCollectionItem } from "../api/articles";
import { getNewsUrl, useArticlesApi } from "../api/articles";
import { useSpecProjectsApi } from "../api/specProjects";
import { useGuideApi } from "../api/guide";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

const appConfig = useAppConfig();

useSeoMeta({
  title: appConfig.title,
  description: appConfig.description,
  ogTitle: appConfig.title,
  ogDescription: appConfig.description,
  ogImage: `${appConfig.hostCanonical}${appConfig.ogImage}`,
  ogType: "website",
  ogUrl: appConfig.hostCanonical,
  twitterTitle: appConfig.title,
  twitterDescription: appConfig.description,
  twitterImage: `${appConfig.hostCanonical}${appConfig.ogImage}`,
});

useHead({
  link: [{ rel: "canonical", href: `${appConfig.hostCanonical}/` }],
});

const { getArticlesHome, getCollectionItems, getNews } = useArticlesApi();
const { getSpecProjects } = useSpecProjectsApi();
const { getCurrentEvents } = useGuideApi();

type HeroSlide = { id: number | string; title: string; url: string; image: string };
type SlideMedia = { path?: string | null; rel_path?: string | null } | null | undefined;

const heroThumb = useIsMobile() ? ([540, 540] as const) : ([1650, 930] as const);

const toSitePath = (url: string) => url.replace(/^https?:\/\/(www\.)?interior\.ru/, "") || "/";

const slideMedia = (media: SlideMedia) => {
  const path = media?.path ?? "";
  const rel = media?.rel_path || (path.startsWith(appConfig.apiHost) ? path.slice(appConfig.apiHost.length) : "");
  const source = path || rel;
  if (!source) return "";
  if (isVideoUrl(source)) return path || `${appConfig.apiHost}${rel}`;
  if (!rel.startsWith("/")) return path;
  return encodeURI(getThumbUrl(rel, heroThumb[0], heroThumb[1]));
};

// закреп home_top целиком: каждый пин — слайд, картинка пина или cover_preview
const { data: slides } = await useAsyncData(
  "home-hero",
  async () => {
    const items = (await getCollectionItems("home_top")).data ?? [];
    return items
      .map((item): HeroSlide => {
        const entity = item.entity as typeof item.entity & {
          cover_preview?: SlideMedia;
        };
        const url = item.url || entity.url || "#";
        return {
          id: entity.id,
          title: item.title || entity.title,
          url: toSitePath(url),
          image: slideMedia(item.image as SlideMedia) || slideMedia(entity.cover_preview) || getCoverMedia(entity),
        };
      })
      .filter((slide) => slide.image);
  },
  { default: () => [] as HeroSlide[] },
);

const isHeroSlider = computed(() => slides.value.length > 1);
const imagesReady = ref(false);

onMounted(() => {
  const enableRestImages = () => {
    imagesReady.value = true;
  };

  if (document.readyState === "complete") {
    setTimeout(enableRestImages, 0);
    return;
  }

  window.addEventListener("load", enableRestImages, { once: true });
});

// ответ тяжелый в каждой новости полный content, в payload оставляем только нужное
const { data: newsItems } = await useAsyncData(
  "home-news",
  async () =>
    ((await getNews(30)).data ?? []).map((item) => ({
      id: item.id,
      title: item.title,
      url: getNewsUrl(item),
    })),
  { default: () => [] },
);

// спецпроекты
const { data: specProjects } = await useAsyncData("home-spec-projects", () => getSpecProjects(20), {
  default: () => [],
});

// события в Москве
const { data: events } = await useAsyncData("home-events", () => getCurrentEvents("moskva", 20), {
  default: () => [],
});

const homeItems = ref<ArticleCollectionItem[]>([]);

const showArticleMore = ref(false);

onMounted(async () => {
  try {
    const response = await getArticlesHome("article_list");
    homeItems.value = response.data ?? [];
  } catch (error) {
    console.error("api home articles", error);
  }
});

const heroSwiperConfig = {
  modules: [Autoplay, Pagination, Navigation],
  slidesPerView: 1,
  loop: true,
  speed: 600,
  autoplay: {
    delay: 6000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  pagination: {
    el: ".grettings__dots",
    clickable: true,
    type: "bullets" as const,
    bulletClass: "grettings__dot",
    bulletActiveClass: "is-active",
  },
  navigation: {
    prevEl: ".grettings__prev",
    nextEl: ".grettings__next",
    disabledClass: "is-disabled",
  },
  breakpoints: {
    0: {
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
    },
    768: {
      autoplay: {
        delay: 6000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
    },
  },
};

const swiperConfig = {
  slidesPerView: "auto" as const,
  spaceBetween: 32,
  // breakpoints: {
  //   0: {
  //     slidesPerView: 1.5,
  //     spaceBetween: 12
  //   },
  //   360: {
  //     slidesPerView: 1.75,
  //     spaceBetween: 12
  //   },
  //   480: {
  //     slidesPerView: 2.5,
  //     spaceBetween: 12
  //   },
  //   640: {
  //     slidesPerView: 3.2,
  //     spaceBetween: 12
  //   },
  //   768: {
  //     slidesPerView: 4,
  //     spaceBetween: 16
  //   },
  //   1024: {
  //     slidesPerView: 4,
  //     spaceBetween: 24
  //   },
  //   1280: {
  //     slidesPerView: 4.5,
  //     spaceBetween: 24
  //   },
  //   1500: {
  //     slidesPerView: 5.5,
  //     spaceBetween: 0
  //   },
  //   1800: {
  //     slidesPerView: 6.5,
  //     spaceBetween: 0
  //   },
  //   2000: {
  //     slidesPerView: 7.5,
  //     spaceBetween: 0
  //   }
  // }
}

const swiperEventsConfig = {
  slidesPerView: 4.5,
  spaceBetween: 32,
  breakpoints: {
    0: {
      slidesPerView: 1.15,
      spaceBetween: 16
    },
    360: {
      slidesPerView: 1.35,
      spaceBetween: 16
    },
    480: {
      slidesPerView: 1.8,
      spaceBetween: 16
    },
    640: {
      slidesPerView: 2.5,
      spaceBetween: 16
    },
    768: {
      slidesPerView: 2.8,
      spaceBetween: 16
    },
    1024: {
      slidesPerView: 3.25,
      spaceBetween: 24
    },
    1280: {
      slidesPerView: 4.2,
      spaceBetween: 32
    },
    2000: {
      slidesPerView: 5.5,
      spaceBetween: 32
    },
  }
}

</script>

<style lang="scss" scoped>
// grettings
.grettings {
  display: flex;
  height: calc(100dvh - 56px);
  padding: 0;

  @include responsive1279 {
    height: auto;
  }

  @include responsive767 {
    margin-bottom: 50px;
  }

  &__invisLink {
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 7;
    overflow: hidden;
    text-indent: 200%;
    white-space: nowrap;

    &:hover {
      &+.grettings__link {

        &::before {
          transform: rotate(180deg);
        }

        .text-default {
          background-size: 100% 100%;
        }
      }
    }
  }

  &__media {
    width: calc(100% - 208px);
    left: -35px;
    position: relative;


    @include responsive1279 {
      width: calc(100% + 70px);
      left: 0;
      margin: 0 -35px;
      padding-top: calc(680 / 1280* 100%);
    }

    @include responsive1023 {
      padding-top: calc(650 / 1024* 100%);
    }

    @include responsive767 {
      width: calc(100% + 32px);
      margin: 0 -16px;
      padding-top: calc(320 / 320 * 100%);
    }

    img,
    video {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;

      @include responsive1279 {
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }

  &__slider,
  &__slide {
    width: 100%;
    height: 100%;
  }

  &__slider {
    overflow: hidden;
    position: relative;

    @include responsive1279 {
      position: absolute;
      inset: 0;
    }

    @include responsive767 {
      overflow: visible;
    }

    :deep(.swiper-slide) {
      height: 100%;
    }

    :deep(.swiper-pagination) {
      top: 16px;
      bottom: auto;
      z-index: 9;
    }

    .grettings__link {
      padding-bottom: 56px;
      padding-right: 155px;

      @include responsive767 {
        padding: 10px 25px;
      }

      .text-default {
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        text-decoration: none;
        background-image: none;

        @include responsive767 {
          -webkit-line-clamp: 3;
        }
      }
    }
  }

  &__slide {
    position: relative;
  }

  &__link {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 2;
    padding: 16px;
    font-size: 48px;
    line-height: 60px;
    color: $colorWhite;
    text-decoration: none;
    padding-left: 75px;
    background: linear-gradient(0deg, rgba(255, 255, 255, 0.35) 0%, rgba(0, 0, 0, 0.2) 130%);
    background-blend-mode: multiply;
    backdrop-filter: blur(5px);
    @include hoverDefault($colorWhite, 3px, 0.6s);
    @include plusIconLeft;

    @include responsive1599 {
      font-size: 40px;
      line-height: 50px;
    }

    @include responsive1439 {
      font-size: 32px;
      line-height: 40px;
    }

    @include responsive1023 {
      font-size: 24px;
      line-height: 30px;
    }

    @include responsive767 {
      font-size: 18px;
      font-weight: 400;
      line-height: 20px;
    }

    @include responsive639 {
      font-size: 14px;
      line-height: 20px;
      padding: 10px 25px;
    }
  }

  &__dots {
    position: absolute;
    bottom: 16px;
    left: 0;
    z-index: 99999;
    width: 100%;
    display: flex;
    gap: 8px;
    padding: 0 40px;

    @include responsive767 {
      bottom: -45px;
      padding: 16px;
    }

    :deep(.grettings__dot) {
      cursor: pointer;
      height: 24px;
      width: 100%;
      flex: 1;
      position: relative;
      display: block;

      &.is-active::before {
        background-color: $colorWhite;

        @include responsive767 {
          background-color: rgba(0, 0, 0, 1);
        }
      }

      &:hover::before {
        background-color: $colorWhite;
        opacity: 0.76;

        @include responsive767 {
          background-color: rgba(0, 0, 0, 1);
        }
      }

      &::before {
        content: "";
        position: absolute;
        top: 50%;
        margin-top: -1.5px;
        left: 0;
        transition: all 0.3s;
        width: 100%;
        height: 3px;
        opacity: 1;
        background-color: rgba(255, 255, 255, 0.5);

        @include responsive767 {
          background-color: rgba(0, 0, 0, 0.5);
        }
      }
    }
  }

  &__prev {
    right: 100px;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='7' height='12' viewBox='0 0 7 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M6 0.75L0.75 6L6 11.25' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' stroke='white'/%3e%3c/svg%3e ");

    @include responsive1279 {
      right: 90px;
    }
  }

  &__next {
    right: 40px;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='7' height='12' viewBox='0 0 7 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M0.75 0.75L6 6L0.75 11.25' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' stroke='white'/%3e%3c/svg%3e ");
  }

  &__prev,
  &__next {
    position: absolute;
    bottom: 80px;
    z-index: 99999;
    width: 48px;
    height: 48px;
    backdrop-filter: blur(5px);
    background-color: rgba(0, 0, 0, 0.2);
    border: solid 1px $colorWhite;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;

    @include responsive1279 {
      width: 38px;
      height: 38px;
      bottom: 60px;
    }

    @include responsive767 {
      display: none;
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.5);
    }

    &::after {
      content: none;
    }
  }
}

.news {
  width: 208px;
  height: 100%;
  overflow: hidden;

  @include responsive1279 {
    display: none;
  }

  .caption {
    margin-bottom: 16px;
    display: block;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    height: calc(100% - 16px - 20px);
    overflow: auto;
    padding-bottom: 16px;
    font-size: 14px;
    line-height: 20px;
    color: $colorDark;

    &::-webkit-scrollbar,
    &::-webkit-scrollbar-track,
    &::-webkit-scrollbar-thumb {
      background: transparent;
      width: 0;
    }
  }

  &__item {}

  a {
    text-decoration: none;
    @include hoverDefault($colorDark, 1px, 0.3s);
  }

  &--mobile {
    display: none;
    position: relative;

    .caption {
      padding-left: 32px;
      padding-right: 32px;

      @include responsive767 {
        padding-left: 16px;
        padding-right: 16px;
      }
    }

    @include responsive1279 {
      display: block;
      width: calc(100% + 64px);
      left: -32px;
    }

    @include responsive767 {
      width: calc(100% + 32px);
      left: -16px;
    }

    .news__list {
      height: auto;
      width: 100%;
      flex-direction: row;
      padding-bottom: 0;

      @include responsive1279 {
        padding-left: 32px;
        padding-right: 32px;
        gap: 4px;
      }

      @include responsive767 {
        padding-left: 16px;
        padding-right: 16px;
      }
    }

    .news__item {
      width: 156px;
      min-width: 156px;
    }
  }
}

// special-projects
.special-projects {
  margin: 0 auto;
  overflow: hidden;

  .caption {}

  .swiper {
    overflow: visible;
  }

  &__slider {
    width: 100%;
    max-width: 100%;
    margin-top: 16px;
    overflow: visible;

    :deep(.swiper-wrapper) {
      width: 100%;
      max-width: 100%;
    }

    :deep(.swiper-slide) {
      width: auto;
      position: relative;
      display: flex;
      flex-direction: column;
    }
  }

  .picture {
    border-radius: 50%;
    width: 256px;
    height: 256px;
    overflow: hidden;
    position: relative;
    display: block;

    @include responsive1023 {
      width: 200px;
      height: 200px;
    }

    @include responsive767 {
      width: 176px;
      height: 176px;
    }

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

  &__content {
    padding-left: 16px;
    margin-top: 16px;
    max-width: 240px;
    width: 100%;

    @include responsive767 {
      margin-top: 8px;
      max-width: 160px;
    }
  }

  &__invisLink {
    width: 100%;
    z-index: 7;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    text-decoration: none;

    &:hover {
      &+.special-projects__content {
        .special-projects__link {

          &::before {
            transform: rotate(180deg);
          }

          .text-default {
            background-size: 100% 100%;
          }
        }
      }
    }
  }

  &__link {
    font-size: 16px;
    line-height: 20px;
    display: block;
    color: $colorDark;
    @include hoverDefault($colorDark, 1px, .3s);
    @include plusIconLeft;

    &:before {
      left: 0;

      @include responsive767 {
        left: 0;
      }
    }

    @include responsive1023 {
      font-size: 14px;
      line-height: 16px;
    }

    @include responsive767 {
      font-size: 12px;
      line-height: 18px;
    }
  }

  &__cat {
    font-size: 12px;
    line-height: 18px;
    margin-top: 4px;
    color: $colorDark-a5;
    display: block;
    @include hoverDefault($colorDark, 1px, .3s);
    transition: all .3s;

    &:hover {
      color: $colorDark;
    }

    @include responsive767 {
      margin-top: 0;
    }
  }
}

// events moscow
.events-moscow {
  &__slider {
    margin-top: 16px;
    overflow: visible;

    :deep(.swiper-slide) {
      border-radius: 10px;
      overflow: hidden;
      height: auto;
    }

    .picture {
      display: flex;
      position: relative;
      width: 100%;
      height: 267px;

      @include responsive1599 {
        height: 230px;
      }

      @include responsive1439 {
        height: 180px;
      }

      @include responsive767 {
        height: 190px;
      }

      img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        object-fit: cover;
      }
    }
  }

  &__invisLink {
    width: 100%;
    z-index: 7;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    text-decoration: none;

    &:hover {
      &+.events-moscow__content {
        .events-moscow__link {

          &::before {
            transform: rotate(180deg);
          }

          .text-default {
            background-size: 100% 100%;
          }
        }
      }
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    font-size: 12px;
    line-height: 16px;
    gap: 2px;
    padding: 16px 6px 16px 32px;
    background-color: rgba(242, 242, 242);
    height: 100%;

    @include responsive767 {
      padding: 12px 6px 12px 32px;
      font-size: 10px;
      line-height: 14px;
    }
  }

  &__link {
    @include hoverDefault($colorDark, 1px, 0.3s);
    @include plusIconLeft;
    margin-bottom: 15px;
    display: flex;
    font-size: 12px;
    line-height: 16px;

    &:before {
      left: 16px;

      @include responsive767 {
        left: 16px;
      }
    }

  }

  &__date {}

  &__name {
    font-weight: 600;
  }

  &__adress {}
}
</style>
