<template>
  <div v-if="page" class="static-page">
    <div class="static-page__body vms_article_parent" v-html="page.body" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { usePagesApi } from "../api/pages";

const route = useRoute();
const slug = computed(() => String(route.params.page_slug));
const device = useIsMobile() ? "mobile" : "desktop";

const { getStaticPage } = usePagesApi();

const { data: page } = await useAsyncData(
  () => `static-page-${slug.value}-${device}`,
  () => getStaticPage(slug.value, device),
);

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: "Страница не найдена", fatal: true });
}

useSeoMeta({
  title: () => page.value?.meta_title || page.value?.title || "",
  description: () => page.value?.meta_description || "",
  ogTitle: () => page.value?.og_title || page.value?.meta_title || page.value?.title || "",
  ogDescription: () => page.value?.og_description || page.value?.meta_description || "",
  ogType: () => (page.value?.og_type as "website" | "article" | undefined) || "website",
});

const { enableVerstka } = useContentEditors();

onMounted(() => enableVerstka(".static-page__body"));
</script>

<style lang="scss" scoped>
.static-page {
  &__body {
    :deep(.body--desktop) {
      position: relative !important;
      padding: 50px 0;
    }
  }
}
</style>
