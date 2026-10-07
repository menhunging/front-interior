<template>
  <section class="print-journal">
    <div class="print-journal__left">
      <div class="print-journal__caption">вы ждали — <br>мы сделали</div>
      <div class="print-journal__subcaption">оформите подписку <br>на ваш любимый журнал</div>
    </div>
    <div class="print-journal__right">
      <div v-for="item in journalCards" :key="item.image" class="print-journal__subscribe">
        <picture class="picture">
          <img :src="item.image" :alt="item.title" />
        </picture>

        <div class="print-journal__content">
          <div class="print-journal__title">{{ item.title }}</div>
          <div class="print-journal__description">{{ item.description }}</div>
          <NuxtLink :to="item.buttonLink" class="btn">{{ item.buttonText }}</NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed } from "vue";

type JournalNumberItem = {
  image?: string;
};

type JournalCard = {
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
};

// @ts-ignore Nuxt auto-import
const appConfig = useAppConfig();

const journalNumbers = computed(
  () => (appConfig.journalNumbers ?? []) as JournalNumberItem[],
);

const newJournalNumber = computed(() => appConfig.newJournalNumber);

const journalCards = computed<JournalCard[]>(() => {
  const firstImage = journalNumbers.value[0]?.image ?? "";
  const secondImage = journalNumbers.value[1]?.image ?? "";

  return [
    {
      image: firstImage,
      title: newJournalNumber.value?.title ?? "",
      description: newJournalNumber.value?.description ?? "",
      buttonText: "Где купить журнал",
      buttonLink: "#", // TODO надо поставить будет ссылку куда переадресуем
    },
    {
      image: secondImage,
      title: "Подписка на год",
      description:
        "Доставка по Москве осуществляется курьером в почтовый ящик или офис. В регионы РФ доставка осуществляется «Почтой России» в почтовый ящик/почтовое отделение",
      buttonText: "Подписаться",
      buttonLink: "https://www.ural-press.ru/contact/",
    },
  ].filter((item) => Boolean(item.image));
});
</script>

<style lang="scss" scoped>
.print-journal {
  display: flex;
  justify-content: space-between;

  @include responsive1023 {
    flex-direction: column;
  }

  &__left {
    max-width: 562px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 20px;

    @include responsive1279 {
      gap: 10px;
    }

    @include responsive1023 {
      max-width: 100%;
      width: 100%;
    }
  }

  &__caption {
    font-size: 72px;
    line-height: 72px;
    font-weight: 800;
    text-transform: uppercase;

    @include responsive1439 {
      font-size: 50px;
      line-height: 60px;
    }

    @include responsive1279 {
      font-size: 40px;
      line-height: 50px;
    }

    @include responsive1023 {
      font-size: 30px;
      line-height: 40px;
    }

    @include responsive767 {
      font-size: 24px;
      line-height: 30px;
    }
  }

  &__subcaption {
    font-size: 32px;
    line-height: 32px;
    font-weight: 300;
    text-transform: uppercase;

    @include responsive1439 {
      font-size: 24px;
      line-height: 30px;
    }

    @include responsive1279 {
      font-size: 24px;
      line-height: 30px;
    }
  }

  &__right {
    max-width: 880px;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 62px;

    @include responsive1599 {
      gap: 42px;
      max-width: 710px;
    }

    @include responsive1023 {
      gap: 20px;
      max-width: 100%;
      margin-top: 30px;
    }

    @include responsive639 {
      grid-template-columns: 1fr;
      gap: 40px;
    }
  }

  &__content {
    font-size: 14px;
    line-height: 20px;
    color: $colorDark;

    @include responsive1279 {
      font-size: 12px;
    }
  }

  &__title {
    font-size: 16px;
    display: block;
    margin-bottom: 3px;

    @include responsive1279 {
      font-size: 14px;
    }
  }

  &__description {
    min-height: 100px;

    @include responsive639 {
      min-height: initial;
    }
  }

  .picture {
    box-shadow: 0 11px 20px 4px rgba(0, 0, 0, 0.3);
    width: 392px;
    height: 504px;
    position: relative;
    display: block;
    margin-bottom: 30px;

    @include responsive1599 {
      width: 320px;
      height: 450px;
    }

    @include responsive1279 {
      width: 280px;
      height: 360px;
    }

    @include responsive1023 {
      width: 100%;
      height: auto;
      padding-top: calc(325 / 257 * 100%);
    }

    @include responsive639 {
      max-width: 70%;
      padding-top: calc(231 / 257 * 100%);
      margin-left: auto;
      margin-right: auto;
    }

    img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .btn {
    width: 100%;
    margin-top: 10px;

    @include responsive639 {
      max-width: 100%;
    }
  }
}
</style>
