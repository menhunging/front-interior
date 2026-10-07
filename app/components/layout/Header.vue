<template>
  <header class="header" :class="{ scroll: isScroll }">

    <div class="logo">
      <NuxtLink v-if="!isScroll" to="/" class="logo__link logo__link--static">
        <NuxtImg src="/svg/logo.svg" alt="logo" />
      </NuxtLink>
      <NuxtLink v-else to="/" class="logo__link logo__link--fixed">
        <NuxtImg src="/svg/logo_small.svg" alt="logo" />
      </NuxtLink>
    </div>

    <div class="social">

      <span class="social__invis">Соцсети</span>

      <div class="social__list">
        <div class="social__item" v-for="item in social" :key="item.name">
          <a :href="item.link" :itemprop="item.itemprop" target="_blank" rel="noopener noreferrer">{{ item.name }}</a>
        </div>
      </div>

    </div>

    <div class="header-special-button">
      <NuxtLink :to="`https://www.interior.ru/I-D_30_years/main?utm_source=button`" target="_blank"></NuxtLink>
      <NuxtImg src="/img/30years_button.webp" />
    </div>

    <div class="header-design">
      <ul class="header-design__links">
        <li v-for="item in additionalLinks" :key="item.link">
          <NuxtLink :to="item.link">{{ item.title }}</NuxtLink>
        </li>
      </ul>
      <NuxtImg src="/img/dn_button.webp" />
    </div>

    <nav class="menu">
      <ul class="menu__list">
        <li class="menu__item" v-for="item in menu" :key="item.name">
          <NuxtLink class="menu__link" active-class="active" :to="item.link">
            {{ item.name }}
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <div class="header-controls">
      <span class="btn-search" @click="handleOpenSearch"></span>

      <span class="burger" @click="handleDropHeader">
        <span class="burger-line"></span>
        <span class="burger-line"></span>
        <span class="burger-line"></span>
      </span>
    </div>

  </header>
</template>

<script lang="ts" setup>

import { computed, onBeforeUnmount, onMounted, ref } from "vue";

defineProps<{
  handleDropHeader: (event: MouseEvent) => void;
  handleOpenSearch: (event: MouseEvent) => void;
}>();

// @ts-ignore Nuxt auto-import
const appConfig = useAppConfig();

const menu = computed(() =>
  (appConfig.mainMenu ?? []).map((item: { uri?: string; title?: string }) => ({
    link: `/${item.uri ?? ""}`,
    name: item.title ?? "",
  })),
);

const social = computed(() =>
  (
    appConfig.socialMenu ?? []
  ).map((item: { link?: string; title?: string; itemprop?: string }) => ({
    link: item.link ?? "#",
    name: item.title ?? "",
    itemprop: item.itemprop ?? "sameAs",
  })),
);

const additionalLinks = computed(() =>
  (appConfig.additionalMainLinks ?? [])
    .filter((item: { active?: boolean }) => item.active !== false)
    .map((item: { link?: string; title?: string }) => ({
      link: item.link ?? "#",
      title: item.title ?? "",
    })),
);

// scroll header
const isScroll = ref(false);

const handleScroll = () => {
  isScroll.value = window.scrollY > 0;
};
// /scroll header

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: $colorWhite;
  display: flex;
  align-items: center;
  padding: 0 32px;
  transition: all 0.3s;
  font-size: 14px;
  line-height: 17px;
  color: $colorBlack;
  z-index: 9;

  @include responsive767 {
    padding: 0 16px;
  }

  &.scroll {
    backdrop-filter: blur(25px);
    background-color: rgba(255, 255, 255, 0.5);
    background-blend-mode: multiply;

    .logo {
      width: 25px;
    }
  }

  &-controls {
    display: flex;
    align-items: center;
    gap: 32px;
    order: 10;
    margin-left: auto;
  }

  a:not(.logo__link,.header-special-button a) {
    position: relative; 
    white-space: nowrap;
    text-decoration: none;
    text-transform: uppercase;

    &.active,
    &:hover {
      &::after {
        width: 100%;
      }
    }

    @include after {
      position: relative;
      background-image: url(/img/color-underline.jpg);
      background-size: 100% 100%;
      width: 0;
      height: 1px;
      transition: width 0.3s;
      margin: auto;
      display: block;
      top: 2px;
    }
  }
}

.social {
  order: 9;
  margin-left: auto;
  position: relative;
  min-height: 56px;
  display: flex;
  align-items: center;

  @include after {
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='14' height='10' viewBox='0 0 14 10' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M1 1L7.18182 9L13 1' stroke='black' stroke-linecap='round'/%3e%3c/svg%3e ");
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    width: 16px;
    height: 16px;
    right: -32px;
    top: 50%;
    transform: translateY(-50%);
  }

  @include responsive1279 {
    display: none;
  }

  &__invis {
    display: flex;
    align-items: center;
    opacity: 1;
    transition: all 0.3s;
  }

  &__list {
    display: flex;
    align-items: center;
    gap: 32px;
    position: absolute;
    right: -30px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s, right 0.5s;
  }

  &__item {
    display: flex;
    align-items: center;
    min-height: 56px;
  }

  a {
    font-size: 12px;
    line-height: 15px;

  }

  &:hover {

    &::after {
      transform: translateY(-50%) rotate(-90deg);
    }

    .social__list {
      opacity: 1;
      pointer-events: initial;
      right: 0px;
    }

    .social__invis {
      opacity: 0;
    }

    &+.header-design {

      @include responsive1599 {
        opacity: 0;
      }

      &+.menu {
        @include responsive1599 {
          opacity: 0;
        }
      }
    }
  }
}

.header-design {
  position: relative;
  z-index: 3;
  min-height: 56px;
  min-width: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  order: 3;

  @include after {
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='14' height='10' viewBox='0 0 14 10' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M1 1L7.18182 9L13 1' stroke='black' stroke-linecap='round'/%3e%3c/svg%3e ");
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    width: 16px;
    height: 16px;
    right: -16px;
    top: 50%;
    transform: translateY(-50%);
  }

  @include responsive1279 {
    display: none;
  }

  &__links {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-50%);
    gap: 32px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s, right 0.5s;

    a {
      font-weight: bold;
    }
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 150px;
    height: 100%;
    object-fit: contain;
    object-position: center;
    transition: all 0.3s;
    z-index: -1;
  }

  &:hover {

    &::after {
      transform: translateY(-50%) rotate(-90deg);
    }

    .header-design__links {
      opacity: 1;
      pointer-events: initial;
      right: 45px;
    }

    img {
      opacity: 0;
    }

    &+.menu {
      opacity: 0;
      pointer-events: none;
    }
  }
}

.header-special-button {
  position: relative;
  z-index: 3;
  min-height: 56px;
  min-width: 114px;
  order: 4;
  margin-left: auto;
  margin-right: auto;

  a {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    display: block;
    text-decoration: none;
    color: transparent;
    font-size: 0;
    line-height: 0;
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 150px;
    height: 100%;
    object-fit: contain;
    object-position: center;
    transition: all 0.3s;
    z-index: -1;
  }
}

.logo {
  position: relative;
  height: 56px;
  width: 193px;
  transition: width 0.2s;

  @include responsive767 {
    width: 130px;
  }


  &__link {
    width: 193px;
    height: 100%;
    display: flex;

    @include responsive767 {
      width: 130px;
    }

    &--static {}

    &--fixed {
      width: 25px;
    }
  }

  &:hover {}

  picture {
    width: 100%;
    height: 100%;
    display: block;
    position: relative;
  }

  img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.menu {
  margin-left: 32px;
  margin-right: 32px;
  transition: opacity 0.3s;

  @include responsive1279 {
    display: none;
  }

  &__list {
    display: flex;
    align-items: center;
    gap: 32px;
  }
}

.btn-search {
  cursor: pointer;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M11.9163 11.9163C11.8605 11.9721 11.7907 12 11.7209 12C11.6512 12 11.5814 11.9721 11.5256 11.9163L7.57674 7.96744C7.71628 7.84186 7.84186 7.71628 7.96744 7.57674L11.9163 11.5256C12.0279 11.6372 12.0279 11.8047 11.9163 11.9163ZM4.32558 0C1.93953 0 0 1.93953 0 4.32558C0 6.71163 1.93953 8.65116 4.32558 8.65116C6.71163 8.65116 8.65116 6.71163 8.65116 4.32558C8.65116 1.93953 6.71163 0 4.32558 0Z' fill='black'/%3e%3c/svg%3e ");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 16px;
  height: 16px;
  display: flex;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.3);
  }
}

.burger {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  width: 12px;
  height: 16px;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.3);
  }

  &-line {
    width: 1.6px;
    height: 100%;
    background-color: $colorBlack;
    display: block;
  }
}
</style>