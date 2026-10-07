<template>
  <div class="site-wrapper">
    <Header :handleDropHeader="handleDropHeader" :handleOpenSearch="handleOpenSearch" />

    <DropHeader :isOpenHeader="isOpenHeader" :handleOpenPublic="handleOpenPublic"
      :handleDropHeader="handleDropHeader" />

    <DropSearch :isOpenSearch="isOpenSearch" :handleOpenSearch="handleOpenSearch" />

    <main class="main">
      <slot />
    </main>

    <Footer :isOpenPublic="isOpenPublic" :handleOpenPublic="handleOpenPublic" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

const isOpenHeader = ref(false);
const isOpenSearch = ref(false);
const isOpenPublic = ref(false);

// @ts-ignore Nuxt auto-import
const route = useRoute();

watch(
  () => route.fullPath,
  () => {
    isOpenHeader.value = false;
    isOpenSearch.value = false;
  },
);

const handleDropHeader = () => {
  isOpenHeader.value = !isOpenHeader.value
};

const handleOpenSearch = () => {
  isOpenSearch.value = !isOpenSearch.value
};

const handleOpenPublic = () => {
  isOpenSearch.value = false
  isOpenHeader.value = false
  isOpenPublic.value = !isOpenPublic.value
};
</script>

<style scoped></style>
