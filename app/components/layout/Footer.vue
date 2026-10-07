<template>
  <footer class="footer">
    <div class="logo">
      <NuxtLink to="/" class="logo__link">
        <NuxtImg src="/svg/logo.svg" alt="logo" />
      </NuxtLink>
    </div>

    <div class="footer-menu">
      <div class="footer-menu__col">
        <NuxtLink v-for="item in mainMenuItems" :key="item.id ?? item.uri ?? item.title" :to="`/${item.uri ?? ''}`">
          <span class="text-default">{{ item.title }}</span>
        </NuxtLink>

        <a href="#" class="link-publish" @click.prevent="handleOpenPublic">
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
        <a v-for="item in socialMenuItems" :key="item.link ?? item.title" :href="item.link ?? '#'" target="_blank"
          rel="noopener noreferrer">
          <span class="text-default">{{ item.title }}</span>
        </a>
      </div>
    </div>

    <span class="not-project">Анкета для публикации проекта доступна только в десктопной версии сайта</span>

    <div class="copyRight">
      <p>
        &copy; Общество с ограниченной ответственностью «И+Д», 2024. Все права защищены. Использование
        материалов
        сайта interior.ru разрешается только с письменного согласия редакции и при наличии гиперссылки
        на interior.ru.
      </p>
    </div>

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

    <div class="project-publication" :class="{ opened: isOpenPublic }">
      <div class="logo">
        <NuxtLink to="/" class="logo__link">
          <NuxtImg src="/svg/logo.svg" alt="logo" />
        </NuxtLink>
      </div>

      <div class="project-publication__content">
        <span class="caption">Анкета для публикации проекта</span>

        <div class="project-publication__form">
          <span class="project-publication__title">контакты</span>

          <div class="input-list">
            <div class="input-item">
              <label for="">Фамилия и имя автора / название бюро <span class="imp">*</span> </label>
              <input type="text">
            </div>
            <div class="input-item">
              <label for="">Ссылка на портрет автора <span class="imp">*</span> </label>
              <input type="text">
            </div>
            <div class="input-item">
              <label for="">Почта <span class="imp">*</span> </label>
              <input type="email">
            </div>
            <div class="input-item">
              <label for="">Телефон</label>
              <input type="text">
            </div>
            <div class="input-item">
              <label for="">Страницы автора в социальных сетях</label>
              <input type="text">
            </div>
            <div class="input-item">
              <label for="">Сайт</label>
              <input type="text">
            </div>
            <div class="input-item">
              <label for="">Город <span class="imp">*</span> </label>
              <input type="text">
            </div>
          </div>

          <span class="project-publication__title">Проект</span>

          <div class="input-list">
            <div class="input-item input-item--full">
              <label for="">Описание проекта <span class="imp">*</span> </label>
              <textarea></textarea>
            </div>
            <div class="input-item">
              <label for="">Был ли где-то опубликован проект?</label>
              <textarea></textarea>
            </div>
            <div class="input-item">
              <label for="">Бренды в проекте</label>
              <textarea></textarea>
            </div>
            <div class="input-item">
              <label for="">Ссылка на фото проекта <span class="imp">*</span> </label>
              <textarea></textarea>
            </div>
            <div class="input-item">
              <label for="">Локация проекта</label>
              <input type="text">
            </div>
            <div class="input-item">
              <label for="">Площадь объекта, м2</label>
              <input type="text">
            </div>
            <div class="input-item">
              <label for="">Год реализации проекта</label>
              <input type="text">
            </div>
            <div class="input-item">
              <label for="">Фотограф съемки</label>
              <input type="text">
            </div>
            <div class="input-item">
              <label for="">Стилист съемки</label>
              <input type="text">
            </div>
          </div>

          <div class="project-publication__text">
            <p>
              Нажимая кнопку «Отправить», вы подтверждаете, что ознакомились и принимаете условия <a
                href="#">пользовательского соглашения</a>
            </p>
          </div>

          <button class="btn" type="submit">Отправить</button>
        </div>
      </div>

      <button class="btn-close" @click="handleOpenPublic"></button>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { computed } from "vue";

defineProps<{
  isOpenPublic: boolean;
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

<style lang="scss" scoped>
.footer {
  padding: 32px;
  font-size: 14px;
  line-height: 17px;
  color: $colorBlack;
  display: grid;
  grid-template-columns: 1fr minmax(665px, 35%);

  @include responsive1599 {
    grid-template-columns: 1fr minmax(500px, 35%);
  }

  @include responsive1279 {
    grid-template-columns: 1fr;
  }

  @include responsive767 {
    padding: 16px;
  }

  .footer-menu {
    grid-row: 2/3;

    @include responsive1279 {
      grid-row: initial;
    }
  }

  .subscribe-from {
    grid-column: 2/3;
    grid-row: 2/3;

    .caption {
      max-width: 400px;
    }

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

.logo {
  position: relative;
  height: 56px;
  width: 193px;
  transition: width 0.2s;

  @include responsive1279 {
    order: 1
  }

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

.copyRight {
  font-size: 16px;
  line-height: 20px;
  width: 100%;
  max-width: 800px;
  margin-top: 36px;
  grid-row: 3/3;

  @include responsive1279 {
    order: 10;
    font-size: 14px;
    line-height: 20px;
    grid-row: initial;
  }

  @include responsive767 {
    font-size: 10px;
    line-height: 14px;
    margin-top: 16px;
  }

}

.not-project {
  order: 3;
  margin-top: 16px;
}

// project-publication
.project-publication {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  background-color: $colorWhite;
  z-index: 9;
  padding: 32px;
  overflow: auto;
  transform: translateY(-100%);
  transition: transform 0.3s;

  @include responsive1279 {
    display: none;
  }

  &.opened {
    transform: translateY(0%);
  }

  .logo {}

  .caption {
    font-size: 20px;
  }

  .project-publication__content {
    max-width: 664px;
    width: 100%;
    margin: 0 auto;
  }

  .project-publication__form {
    margin-top: 32px;
  }

  .project-publication__title {
    font-size: 16px;
    font-weight: 800;
    text-transform: uppercase;
    display: block;
  }

  .project-publication__text {
    font-size: 12px;
    line-height: 20px;
    margin-top: 44px;
    margin-bottom: 28px;
    display: block;

    a {
      text-decoration: underline;
      transition: text-decoration 0.3s;

      &:hover {
        text-decoration-color: transparent;
      }
    }
  }

  .input-list {
    display: grid;
    align-items: flex-end;
    grid-template-columns: 1fr 1fr;
    gap: 20px 64px;
    margin-top: 20px;

    &+.project-publication__title {
      margin-top: 32px;
    }
  }

  .input-item {

    &.input-item--full {
      grid-column: 1/3;
    }

    label {
      font-size: 12px;
      line-height: 30px;
      display: block;
    }

    input {
      width: 100%;
      height: 30px;
      border: 0;
      border-bottom: solid 1px #7B7B7B;
      outline: none;
    }

    textarea {
      width: 100%;
      height: 101px;
      outline: none;
      border: solid 1px $colorBlack;
      padding: 16px;
      resize: vertical;
    }

    .imp {
      color: #F14C4C;
    }
  }

  .btn {
    padding: 8px 16px;
  }

  .btn-close {
    cursor: pointer;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='14' height='13' viewBox='0 0 14 13' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cline y1='-0.5' x2='16.722' y2='-0.5' transform='matrix(0.696455 -0.717601 0.696455 0.717601 1.35376 12.9998)' stroke='black'/%3e%3cline y1='-0.5' x2='16.722' y2='-0.5' transform='matrix(0.696455 0.717601 -0.696455 0.717601 1 1.00024)' stroke='black'/%3e%3c/svg%3e ");
    background-position: center;
    background-repeat: no-repeat;
    position: absolute;
    right: 32px;
    top: 32px;
    width: 12px;
    height: 12px;
  }





}
</style>