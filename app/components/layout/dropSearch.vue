<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAsyncData } from "nuxt/app";
import { useArticlesApi } from "../../api/articles";
import { useSearchApi } from "../../api/search";
import { useTagsApi } from "../../api/tags";
import { getArticleSection, getArticleUri } from "../../utils/article";

const props = defineProps<{
    isOpenSearch: boolean;
    handleOpenSearch: (event: MouseEvent) => void;
}>();

const router = useRouter();
const { getTopTags } = useTagsApi();
const { getPopularArticles } = useArticlesApi();
const { getSearchCount } = useSearchApi();

const { data: tags } = useAsyncData("search-top-tags", () => getTopTags());
const { data: popularArticles } = useAsyncData("search-popular-articles", () => getPopularArticles());

const inputValue = ref("");
const searchCount = ref(1);
const searchedOnce = ref(false);
let searchTimer: ReturnType<typeof setTimeout> | null = null;

const articles = computed(() =>
    (popularArticles.value ?? []).map((article) => ({
        id: article.id,
        title: article.title,
        url: getArticleUri(article),
        image: article.cover_preview?.path ?? "",
        section: getArticleSection(article),
    })),
);

const onInputChange = () => {
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(async () => {
        const q = inputValue.value.trim();
        if (q.length <= 1) return;
        try {
            searchCount.value = await getSearchCount(q);
            searchedOnce.value = true;
        } catch {
            searchCount.value = 1;
        }
    }, 1000);
};

const onClickClearInput = () => {
    inputValue.value = "";
    searchCount.value = 1;
    searchedOnce.value = false;
    if (searchTimer) clearTimeout(searchTimer);
};

const onSubmit = () => {
    const q = inputValue.value.trim();
    if (!q || !searchCount.value) return;
    props.handleOpenSearch(new MouseEvent("click"));
    router.push(`/search/${encodeURIComponent(q)}`);
};
</script>

<template>
    <div class="dropSearch dropBlock" :class="{ opened: isOpenSearch }">

        <span class="close" @click="handleOpenSearch"></span>

        <div class="logo">
            <NuxtLink to="/" class="logo__link">
                <NuxtImg src="svg/logo.svg" alt="logo" />
            </NuxtLink>
        </div>

        <form class="dropSearch__controls" @submit.prevent="onSubmit">
            <input v-model="inputValue" type="text" placeholder="Поиск" @input="onInputChange">
            <button class="btn" type="submit" :disabled="!searchCount">Найти</button>

            <span v-if="inputValue.length" class="btn-clear" @click="onClickClearInput"></span>

            <span v-if="searchedOnce && !searchCount && inputValue.length" class="dropSearch__result">По вашему запросу
                ничего не найдено, попробуйте изменить запрос</span>
        </form>

        <div class="dropSearch__content">
            <div class="popular-tags">
                <h2 class="caption caption--h2">популярные теги</h2>

                <ul class="popular-tags__list">
                    <li v-for="tag in tags ?? []" :key="tag.id">
                        <NuxtLink :to="`/${tag.slug}`" class="btn">{{ tag.name }}</NuxtLink>
                    </li>
                </ul>
            </div>

            <div v-if="articles.length" class="popular-articles">
                <h2 class="caption caption--h2">популярные статьи</h2>

                <div class="popular-articles__list">
                    <div v-for="article in articles" :key="article.id" class="popular-articles__item">
                        <NuxtLink :to="article.url" class="popular-articles__invisLink">
                            <picture class="picture">
                                <img v-if="article.image" :src="article.image" :alt="article.title" />
                            </picture>
                        </NuxtLink>
                        <NuxtLink :to="article.url" class="popular-articles__link">
                            <span class="text-default">{{ article.title }}</span>
                        </NuxtLink>
                        <div v-if="article.section" class="popular-articles__desc">
                            <NuxtLink :to="article.section.url" class="popular-articles__cat">
                                <span class="text-default">{{ article.section.title }}</span>
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.dropSearch {
    height: 100dvh;
    overflow: auto;

    &__controls {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        gap: 14px 32px;
        margin-top: 100px;

        @include responsive1279 {
            margin-top: 60px;
        }

        @include responsive1023 {
            margin-top: 30px;
        }

        @include responsive767 {
            flex-direction: column;
            gap: 16px 24px;
            margin-top: 20px;
        }

        input {
            outline: none;
            width: 100%;
            height: 36px;
            flex: 1;
            border: 0;
            border-bottom: solid 1px $colorBlack;

            @include responsive767 {
                flex: initial
            }
        }

        .btn {
            padding: 8px 16px;
            max-width: 115px;
            margin-left: auto;
            margin-right: auto;
            width: 100%;

            @include responsive767 {
                order: 3;
            }
        }
    }

    &__content {
        margin-top: 120px;

        @include responsive1279 {
            margin-top: 60px;
        }

        @include responsive1023 {
            margin-top: 30px;
        }
    }

    &__result {
        width: 100%;

        @include responsive767 {
            order: 2;
            margin-top: -10px;
        }
    }

    .btn-clear {
        cursor: pointer;
        position: absolute;
        top: 10px;
        right: 150px;
        width: 15px;
        height: 15px;
        opacity: 0.77;
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z' fill='%230F1729'%3e%3c/path%3e%3c/svg%3e");
        background-position: center;
        background-repeat: no-repeat;

        @include responsive767 {
            right: 0;
        }
    }
}

.popular-tags {
    max-width: 100%;
    width: 100%;

    &__list {
        margin-top: 56px;
        display: flex;
        flex-wrap: wrap;
        gap: 32px 16px;

        @include responsive1279 {
            gap: 16px;
            margin-top: 30px;
        }

        @include responsive1023 {
            margin-top: 30px;
        }

        @include responsive767 {
            gap: 8px;
            margin-top: 16px;
        }
    }

    .btn {
        padding: 8px 16px;
        text-transform: uppercase;

        @include responsive767 {}
    }
}

.popular-articles {
    margin-top: 120px;

    @include responsive1279 {
        margin-top: 60px;
    }

    @include responsive1023 {
        margin-top: 30px;
    }

    &__list {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 32px;
        margin-top: 56px;

        @include responsive1279 {
            grid-template-columns: repeat(2, 1fr);
            margin-top: 30px;
        }

        @include responsive767 {
            grid-template-columns: 1fr;
            margin-top: 16px;
        }
    }

    &__item {
        width: 100%;

        picture {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: block;
            border: none;
            max-width: 100%;
        }
    }

    &__invisLink {
        position: relative;
        width: 100%;
        height: auto;
        z-index: 7;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        text-decoration: none;
        padding-top: calc(220 / 380 * 100%);

        &:hover {
            &+.popular-articles__link {
                .text-default {
                    background-size: 100% 100%;
                }
            }
        }
    }

    &__link {
        font-size: 16px;
        line-height: 20px;
        margin-top: 16px;
        display: inline-block;
        @include hoverDefault($colorBlack, 1px, 0.3s);

        @include responsive767 {
            font-size: 12px;
            line-height: 15px;
        }
    }

    &__desc {
        font-size: 12px;
        line-height: 15px;
        display: flex;
        gap: 8px;
        margin-top: 4px;
    }

    &__cat {
        opacity: 0.3;
        color: $colorBlack;
        @include hoverDefault($colorBlack, 1px, 0.3s);

        &:hover {
            opacity: 1;
        }
    }

    &__date {
        opacity: 0.3;
        color: $colorBlack;
    }

    &__result {}
}
</style>