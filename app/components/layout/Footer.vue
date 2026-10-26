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
      <SubscribeForm />
    </div>

    <div class="project-publication" :class="{ opened: isOpenPublic }">
      <div class="logo">
        <NuxtLink to="/" class="logo__link">
          <NuxtImg src="/svg/logo.svg" alt="logo" />
        </NuxtLink>
      </div>

      <div class="project-publication__content">
        <span class="caption">Анкета для публикации проекта</span>

        <div v-if="sent" class="project-publication-success">
          <span class="project-publication-success__title">
            Спасибо! Редакция рассмотрит проект и обязательно свяжется с вами. INTERIOR.RU
          </span>
          <p>Срок рассмотрения: 2–3 недели</p>
        </div>

        <form v-else class="project-publication__form" @submit.prevent="onSubmit">
          <span class="project-publication__title">контакты</span>

          <div class="input-list">
            <div class="input-item">
              <label for="author_name">Фамилия и имя автора / название бюро <span class="imp">*</span> </label>
              <input id="author_name" v-model="form.author_name" type="text" name="author_name" required>
            </div>
            <div class="input-item">
              <label for="author_portrait_link">Ссылка на портрет автора <span class="imp">*</span> </label>
              <input id="author_portrait_link" v-model="form.author_portrait_link" type="text" name="author_portrait_link" required>
            </div>
            <div class="input-item">
              <label for="author_email">Почта <span class="imp">*</span> </label>
              <input id="author_email" v-model="form.author_email" type="email" name="author_email" required>
            </div>
            <div class="input-item">
              <label for="author_phone">Телефон</label>
              <input id="author_phone" v-model="form.author_phone" type="tel" name="author_phone">
            </div>
            <div class="input-item">
              <label for="author_facebook">Страницы автора в социальных сетях</label>
              <input id="author_facebook" v-model="form.author_facebook" type="text" name="author_facebook">
            </div>
            <div class="input-item">
              <label for="author_site">Сайт</label>
              <input id="author_site" v-model="form.author_site" type="text" name="author_site">
            </div>
            <div class="input-item">
              <label for="author_city">Город <span class="imp">*</span> </label>
              <input id="author_city" v-model="form.author_city" type="text" name="author_city" required>
            </div>
          </div>

          <span class="project-publication__title">Проект</span>

          <div class="input-list">
            <div class="input-item input-item--full">
              <label for="project_description">Описание проекта <span class="imp">*</span> </label>
              <textarea id="project_description" v-model="form.project_description" name="project_description" required></textarea>
            </div>
            <div class="input-item">
              <label for="project_publications">Был ли где-то опубликован проект?</label>
              <textarea id="project_publications" v-model="form.project_publications" name="project_publications"></textarea>
            </div>
            <div class="input-item">
              <label for="project_brands">Бренды в проекте</label>
              <textarea id="project_brands" v-model="form.project_brands" name="project_brands"></textarea>
            </div>
            <div class="input-item">
              <label for="project_photo_link">Ссылка на фото проекта <span class="imp">*</span> </label>
              <textarea id="project_photo_link" v-model="form.project_photo_link" name="project_photo_link"
                placeholder="Пожалуйста, проведите предварительный отбор фотографий. Мы принимаем только LowRes — 30 фотографий максимум"
                required></textarea>
            </div>
            <div class="input-item">
              <label for="project_location">Локация проекта</label>
              <input id="project_location" v-model="form.project_location" type="text" name="project_location">
            </div>
            <div class="input-item">
              <label for="project_object_area">Площадь объекта, м2</label>
              <input id="project_object_area" v-model="form.project_object_area" type="text" name="project_object_area">
            </div>
            <div class="input-item">
              <label for="project_year">Год реализации проекта <span class="imp">*</span></label>
              <input id="project_year" v-model="form.project_year" type="number" name="project_year" required>
            </div>
            <div class="input-item">
              <label for="project_photographer">Фотограф съемки</label>
              <input id="project_photographer" v-model="form.project_photographer" type="text" name="project_photographer">
            </div>
            <div class="input-item">
              <label for="project_stylist">Стилист съемки</label>
              <input id="project_stylist" v-model="form.project_stylist" type="text" name="project_stylist">
            </div>
          </div>

          <div class="project-publication__text">
            <p>
              Нажимая кнопку «Отправить», вы подтверждаете, что ознакомились и принимаете условия
              <NuxtLink to="/litsenzionnii-dogovor-oferta.html" target="_blank">пользовательского соглашения</NuxtLink>
            </p>
          </div>

          <p v-if="error" class="project-publication__error">{{ error }}</p>
          <button class="btn" type="submit" :disabled="pending || !canSubmit">
            {{ pending ? "Отправка…" : "Отправить" }}
          </button>
        </form>
      </div>

      <button class="btn-close" @click="handleOpenPublic"></button>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from "vue";
import { PublishError, usePublishApi } from "../../api/publish";

const props = defineProps<{
  isOpenPublic: boolean;
  handleOpenPublic: (event: MouseEvent) => void;
}>();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const { submitProjectApplication } = usePublishApi();

const form = reactive({
  author_name: "",
  author_portrait_link: "",
  author_email: "",
  author_phone: "",
  author_facebook: "",
  author_site: "",
  author_city: "",
  project_description: "",
  project_publications: "",
  project_brands: "",
  project_photo_link: "",
  project_location: "",
  project_object_area: "",
  project_year: "",
  project_photographer: "",
  project_stylist: "",
});

const pending = ref(false);
const sent = ref(false);
const error = ref("");

const filled = (value: string | number) => String(value ?? "").trim();

const canSubmit = computed(() =>
  [
    form.author_name,
    form.author_portrait_link,
    form.author_city,
    form.project_description,
    form.project_photo_link,
    form.project_year,
  ].every((value) => filled(value)) && EMAIL_RE.test(form.author_email.trim()),
);

watch(() => props.isOpenPublic, (open) => {
  if (!open) {
    sent.value = false;
    error.value = "";
  }
});

const onSubmit = async () => {
  if (pending.value || !canSubmit.value) return;
  pending.value = true;
  error.value = "";
  try {
    await submitProjectApplication({ ...form });
    sent.value = true;
  } catch (err) {
    error.value = err instanceof PublishError ? err.message : "Не удалось отправить анкету";
  } finally {
    pending.value = false;
  }
};

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

    :deep(.caption) {
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

  .project-publication-success {
    margin-top: 32px;

    &__title {
      display: block;
      max-width: 660px;
      margin-bottom: 16px;
      font-size: 16px;
      font-weight: 800;
      text-transform: uppercase;
    }

    p {
      margin: 0;
      font-size: 14px;
    }
  }

  .project-publication__error {
    margin: 0 0 16px;
    font-size: 12px;
    line-height: 16px;
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