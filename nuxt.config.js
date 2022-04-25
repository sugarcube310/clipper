import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: 'penta - ペンタ -',
    title: 'penta - ペンタ -',
    htmlAttrs: {
      lang: 'ja'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      // OGP
      { hid: 'og:site_name', property: 'og:site_name', content: 'Gallery' },
      { hid: 'og:type', property: 'og:type', content: 'website'  },
      { hid: 'og:url', property: 'og:url', content: '' },
      { hid: 'og:title', property: 'og:title', content: 'Gallery' },
      { hid: 'og:description', property: 'og:description', content: '' },
      // { hid: 'og:image', property: 'og:image', content: '/ogp.png' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP&family=Noto+Sans&display=swap' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/common.css', // サイト全体の共通スタイル
    '@/assets/css/keyframes.css', // keyframes
    '@/assets/css/variables.css', // PostCSS 変数定義
    '@/assets/css/vcustom.css' // Vuetifyスタイルのカスタム
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/composition-api'
  ],

  router: {
    middleware: 'authenticated'
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: {
    dirs: [
      '~/components',
      '~/components/layouts',
      '~/components/parts',
      '~/components/pages/top'
    ]
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey: "AIzaSyCzqI2BUo5vpGKTdZX5wZxdYVCRGYxdpOw",
          authDomain: "penta-gallery.firebaseapp.com",
          projectId: "penta-gallery",
          storageBucket: "penta-gallery.appspot.com",
          messagingSenderId: "931114198562",
          appId: "1:931114198562:web:e823a428ac18999ff88c7b",
          measurementId: "G-TG3GYXKJD0"
        },
        services: {
          auth: true,
          firestore: true,
          functions: true,
        }
      }
    ]
  ],

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/css/variables.css'],
    theme: {
      dark: false,
      themes: {
        light: {
          primary: '#333',
          secondary: '#757575',
          accent: '#529E8F',
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: '#c00',
          success: '#529E8F'
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    postcss: {
      plugins: {
        'postcss-preset-env': {
          stage: 0,
          importFrom: './assets/css/variables.css'
        }
      },
      preset: {
        features: {
          'nesting-rules': true
        },
        autoprefixer: {
          grid: 'autoplace'
        }
      }
    },
    transpile: ['vuex-composition-helpers']
  },

  server: {
    host: '0.0.0.0'
  }
}
