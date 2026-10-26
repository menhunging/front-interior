<template>
  <div v-if="subscribed" class="subscribe-form__success">
    <h2 class="caption caption--h2">Спасибо!</h2>
    <p>Осталось подтвердить вашу почту — письмо мы выслали</p>
  </div>

  <template v-else>
    <h2 class="caption caption--h2">Подписывайтесь на нашу рассылку</h2>

    <form class="subscribe-from__form" @submit.prevent="onSubmit">
      <input v-model="email" type="email" name="_member_email" placeholder="Ваша почта" autocomplete="email" required />
      <button class="btn" type="submit" :disabled="pending || !canSubmit">
        {{ pending ? "Отправка…" : "Подписаться" }}
      </button>
    </form>

    <p v-if="error" class="subscribe-form__error">{{ error }}</p>

    <div class="block-more-text">
      Нажимая на кнопку, вы соглашаетесь с
      <a href="/email-consent">Политикой конфиденциальности</a>
    </div>
  </template>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { SubscribeError, subscribeEmail } from "../../api/subscribe";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const email = ref("");
const pending = ref(false);
const subscribed = ref(false);
const error = ref("");
const canSubmit = computed(() => EMAIL_RE.test(email.value.trim()));

const onSubmit = async () => {
  if (pending.value || !canSubmit.value) return;

  error.value = "";
  pending.value = true;

  try {
    await subscribeEmail(email.value);
    subscribed.value = true;
  } catch (caught) {
    error.value =
      caught instanceof SubscribeError
        ? caught.message
        : "Не получилось подписаться. Попробуйте ещё раз.";
  } finally {
    pending.value = false;
  }
};
</script>

<style lang="scss" scoped>
.subscribe-form__success {
  p {
    max-width: 400px;
    font-weight: 200;
    font-size: 22px;
    line-height: 125%;
  }
}

.subscribe-form__error {
  margin-top: 12px;
  font-size: 14px;
  line-height: 18px;
}
</style>
