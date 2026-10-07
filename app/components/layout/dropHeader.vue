<script lang="ts" setup>
import { computed } from "vue";

defineProps<{
    isOpenHeader: boolean;
    handleDropHeader: (event: MouseEvent) => void;
    handleOpenPublic: (event: MouseEvent) => void;
}>();

type MainMenuItem = {
    id?: number;
    title?: string;
    uri?: string;
};

type StaticMenuItem = {
    caption?: string;
    link?: string;
    itemKey?: string;
    important?: boolean;
};

type SocialMenuItem = {
    title?: string;
    link?: string;
};

type AdditionalMainLinkItem = {
    title?: string;
    link?: string;
};

// @ts-ignore Nuxt auto-import
const appConfig = useAppConfig();

const mainMenuItems = computed(() => (appConfig.mainMenu ?? []) as MainMenuItem[]);
const staticMenuItems = computed(() => (appConfig.staticMenu ?? []) as StaticMenuItem[]);
const socialMenuItems = computed(() => (appConfig.socialMenu ?? []) as SocialMenuItem[]);
const additionalMainLinks = computed(
    () => (appConfig.additionalMainLinks ?? []) as AdditionalMainLinkItem[],
);
</script>

<template>
    <div class="dropHeader dropBlock" :class="{ opened: isOpenHeader }">

        <span class="close" @click="handleDropHeader"></span>

        <div class="logo">
            <NuxtLink to="/" class="logo__link">
                <NuxtImg src="svg/logo.svg" alt="logo" />
            </NuxtLink>
        </div>

        <div class="footer-menu">
            <div class="footer-menu__col">
                <NuxtLink v-for="item in mainMenuItems" :key="item.id ?? item.uri ?? item.title"
                    :to="`/${item.uri ?? ''}`">
                    <span class="text-default">{{ item.title }}</span>
                </NuxtLink>

                <a href="" class="link-publish" @click.prevent="handleOpenPublic">
                    <strong>
                        <span class="text-default">
                            ОПУБЛИКОВАТЬ ПРОЕКТ
                        </span>
                    </strong>
                </a>
            </div>
            <div class="footer-menu__col">
                <NuxtLink v-for="item in additionalMainLinks" :key="item.link ?? item.title" :to="item.link ?? ''">
                    <span class="text-default">{{ item.title }}</span>
                </NuxtLink>
            </div>
            <div class="footer-menu__col">
                <NuxtLink v-for="item in staticMenuItems" :key="item.link ?? item.caption" :to="item.link ?? ''">
                    <template v-if="item.important">
                        <strong><span class="text-default">{{ item.caption }}</span></strong>
                    </template>
                    <template v-else>
                        <span class="text-default">{{ item.caption }}</span>
                    </template>
                </NuxtLink>
            </div>
            <div class="footer-menu__col">
                <a v-for="item in socialMenuItems" :key="item.link ?? item.title" :href="item.link ?? '#'"
                    target="_blank" rel="noopener noreferrer">
                    <span class="text-default">{{ item.title }}</span>
                </a>
            </div>
        </div>

        <span class="not-project">Анкета для публикации проекта доступна только в десктопной версии сайта</span>

        <div class="subscribe-from">
            <h2 class="caption caption--h2">Подписывайтесь на нашу
                рассылку</h2>

            <form class="subscribe-from__form">
                <input type="email" placeholder="Ваша почта" />
                <button type="submit" class="btn" disabled>Подписаться</button>
            </form>

            <div class="block-more-text"> Нажимая на кнопку, вы соглашаетесь с
                <a href="/email-consent">Политикой конфиденциальности</a>
            </div>

        </div>
    </div>
</template>

<style lang="scss" scoped>
.dropHeader {
    display: grid;
    grid-template-columns: 1fr minmax(665px, 35%);
    background-color: $colorWhite;

    @include responsive1599 {
        grid-template-columns: 1fr minmax(500px, 35%);
    }

    @include responsive1279 {
        grid-template-columns: 1fr;
    }

    .footer-menu {
        grid-row: 2/3;
    }

    .subscribe-from {
        grid-column: 2/3;
        grid-row: 2/4;

        @include responsive1279 {
            grid-column: initial;
            grid-row: initial;
            order: 4;
            margin-top: 32px;
            max-width: 70%;
        }

        @include responsive767 {
            max-width: 100%;
            margin-top: 16px;
        }
    }
}
</style>