// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", "@nuxt/image"],
  runtimeConfig: {
    public: {
      apiBase: "https://api.interior.ru",
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: "ru" },
      meta: [
        { name: "yandex-verification", content: "a0026256509dc43a" },
        { property: "og:site_name", content: "INTERIOR + DESIGN" },
        { property: "og:image", content: "https://www.interior.ru/pictures/share.png" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "msapplication-TileColor", content: "#ffffff" },
        { name: "msapplication-TileImage", content: "https://www.interior.ru/pictures/share.png" },
        { name: "theme-color", content: "#ffffff" },
        { name: "apple-mobile-web-app-status-bar-style", content: "black" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        ...[57, 60, 72, 76, 114, 120, 144, 152, 180].map((size) => ({
          rel: "apple-touch-icon",
          sizes: `${size}x${size}`,
          href: `/icons/apple-icon-${size}x${size}.png`,
        })),
        { rel: "icon", type: "image/png", sizes: "192x192", href: "/icons/android-icon-192x192.png" },
        ...[32, 96, 16].map((size) => ({
          rel: "icon",
          type: "image/png",
          sizes: `${size}x${size}`,
          href: `/icons/favicon-${size}x${size}.png`,
        })),
        { rel: "manifest", href: "/manifest.json" },
        { rel: "preconnect", href: "https://api.interior.ru" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400;500;600;700&display=swap",
        },
      ],
    },
  },
  components: [
    {
      path: "~/components/layout",
      pathPrefix: false,
    },
    {
      path: "~/components/home",
      pathPrefix: false,
    },
    {
      path: "~/components/category",
      pathPrefix: false,
    },
    {
      path: "~/components/article",
      pathPrefix: false,
    },
    {
      path: "~/components/news",
      pathPrefix: false,
    },
  ],
  css: ["swiper/css", "~~/assets/css/verstka.org_critical.css", "~~/assets/scss/global.scss"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:
            '@use "@@/assets/scss/_vars.scss" as *; @use "@@/assets/scss/_mixins.scss" as *;',
        },
      },
    },
  },
  routeRules: {
    // картинки контента verstka/setka приходят с относительными путями и лежат на бэке
    "/images/**": { proxy: "https://api.interior.ru/images/**" },
  },
  hooks: {
    // в dev vite кладёт define "module.hot" в window.module, из-за этого UMD-скрипты (domready в go.verstka.org/api.js)
    // уходят в module.exports и падают с "domready is not defined"
    "vite:extendConfig"(config, { isClient }) {
      if (isClient && config.define) delete config.define["module.hot"];
    },
  },
});
