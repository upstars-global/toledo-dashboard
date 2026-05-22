import { getNitroRouteRules } from './config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxtjs/google-fonts',
    'nuxt-auth-utils',
    '@nuxt/eslint'
  ],
  ssr: process.env.SSR_ENABLE === 'true',
  devtools: { enabled: process.env.DEVTOOLS === 'true' },
  css: ['~/assets/css/tailwind.css'],
  colorMode: {
    preference: 'system', // default value of $colorMode.preference
    fallback: 'dark', // fallback value if not system preference found
    classPrefix: '',
    classSuffix: ''
  },
  runtimeConfig: {
    session: {
      maxAge: 60 * 60 * 24 * 7, // 1 week
      password: process.env.NUXT_SESSION_PASSWORD || ''
    },
    public: {
      isDev: process.env.NODE_ENV === 'development'
    }
  },
  compatibilityDate: '2025-07-15',
  nitro: {
    serveStatic: true,
    routeRules: getNitroRouteRules()
  },
  vite: {
    optimizeDeps: {
      include: ['mitt']
    }
  },
  eslint: {
    config: {
      stylistic: true
    }
  },
  googleFonts: {
    display: 'swap',
    families: {
      'DM Sans': [400, 700]
    }
  },
  i18n: {
    locales: [{ code: 'en', language: 'en-US', file: 'en.ts' }],
    strategy: 'no_prefix',
    defaultLocale: 'en',
    vueI18n: 'i18n.config.ts'
  },
  icon: {
    customCollections: [
      {
        prefix: 'custom',
        dir: './app/assets/icons'
      }
    ]
  },
  pinia: { storesDirs: ['./app/stores/**'] }
})
