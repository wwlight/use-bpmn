// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@element-plus/nuxt',
    '@unocss/nuxt',
    '@vueuse/nuxt',
  ],
  ssr: false,
  pages: {
    pattern: ['**/*.vue', '!**/_*'],
  },
  imports: {
    dirs: ['api'],
  },
  devtools: { enabled: false },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    baseURL: process.env.NUXT_PUBLIC_BASE_URL || '/', // 针对 GitHub Pages 做的路径适配
  },
  css: ['@/styles/var.scss'],
  // router: {
  //   options: {
  //     hashMode: true,
  //   },
  // },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },
  features: {
    inlineStyles: false, // For UnoCSS
  },
  compatibilityDate: '2025-07-15',
  nitro: {
    routeRules: {
      '*': {
        cors: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      },
    },
  },
  vite: {
    build: {
      minify: 'terser',
      terserOptions: {
        mangle: {
          // 禁止混淆 bpmn 中指定变量名
          reserved: [
            'propertiesPanel',
            'eventBus',
            'config',
          ],
        },
      },
    },
  },
  elementPlus: {
    importStyle: false,
  },
  eslint: {
    config: {
      standalone: false,
      nuxt: {
        sortConfigKeys: true,
      },
    },
  },
})
