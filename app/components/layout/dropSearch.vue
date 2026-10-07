<script lang="ts" setup>
defineProps<{
    isOpenSearch: boolean;
    handleOpenSearch: (event: MouseEvent) => void;
}>();
</script>

<template>
    <div class="dropSearch dropBlock" :class="{ opened: isOpenSearch }">

        <span class="close" @click="handleOpenSearch"></span>

        <div class="logo">
            <NuxtLink to="/" class="logo__link">
                <NuxtImg src="svg/logo.svg" alt="logo" />
            </NuxtLink>
        </div>

        <div class="dropSearch__controls">
            <input type="text" placeholder="Поиск">
            <button class="btn">Найти</button>
            <span class="dropSearch__result">По вашему запросу ничего не найдено, попробуйте изменить запрос</span>
        </div>

        <div class="dropSearch__content">
            <div class="popular-tags">
                <h2 class="caption caption--h2">популярные теги</h2>

                <ul class="popular-tags__list">
                    <li>
                        <a href="#" class="btn">НОвостидизайна</a>
                    </li>
                    <li>
                        <a href="#" class="btn">интерьеры</a>
                    </li>
                    <li>
                        <a href="#" class="btn">Limited Edition</a>
                    </li>
                    <li>
                        <a href="#" class="btn">архитектура</a>
                    </li>
                    <li>
                        <a href="#" class="btn">Разговор</a>
                    </li>
                    <li>
                        <a href="#" class="btn">события</a>
                    </li>
                    <li>
                        <a href="#" class="btn">тенденции</a>
                    </li>
                    <li>
                        <a href="#" class="btn">Арт</a>
                    </li>
                    <li>
                        <a href="#" class="btn">имя</a>
                    </li>
                    <li>
                        <a href="#" class="btn">тренды</a>
                    </li>
                    <li>
                        <a href="#" class="btn">Марка</a>
                    </li>
                    <li>
                        <a href="#" class="btn">дизайн</a>
                    </li>
                </ul>
            </div>

            <div class="popular-articles">
                <h2 class="caption caption--h2">популярные статьи</h2>

                <div class="popular-articles__list">
                    <div class="popular-articles__item" v-for="item in 4" :key="item">
                        <a href="#" class="popular-articles__invisLink">
                            <picture class="picture">
                                <img src="https://api.interior.ru/media/thumb/976x549_5/images/es/tesla/tesla-robotaxi-reveal-12.jpg"
                                    alt="" />
                            </picture>
                        </a>
                        <a href="#" class="popular-articles__link"><span class="text-default">Departo: новый бренд для
                                глобальных кочевников</span></a>
                        <div class="popular-articles__desc">
                            <a href="#" class="popular-articles__cat"><span class="text-default">Дизайн</span></a>
                            <!-- <span class="popular-articles__date">6 ноября, 2024</span> УБРАЛИ ПО ТРЕБОВАНИЮ ДАТУ-->
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
}

.popular-tags {
    max-width: 946px;
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

    &__invisLink {
        width: 100%;
        z-index: 7;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        text-decoration: none;

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