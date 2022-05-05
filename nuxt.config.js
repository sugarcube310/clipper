import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: 'Clipper',
    title: 'Clipper',
    htmlAttrs: {
      lang: 'ja'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Clipper(クリッパー) | 自分だけのお気に入り画像を保存しておけるアプリ' },
      { name: 'format-detection', content: 'telephone=no' },
      // OGP
      { hid: 'og:site_name', property: 'og:site_name', content: 'Clipper' },
      { hid: 'og:type', property: 'og:type', content: 'website'  },
      { hid: 'og:url', property: 'og:url', content: '' },
      { hid: 'og:title', property: 'og:title', content: 'Clipper' },
      { hid: 'og:description', property: 'og:description', content: 'Clipper(クリッパー) | 自分だけのお気に入り画像を保存しておけるアプリ' },
      { hid: 'og:image', property: 'og:image', content: '/ogp.png' }
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
    '@/assets/css/vstyle.css' // Vuetifyスタイルのカスタマイズ
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/composition-api'
  ],

  router: {
    trailingSlash: true,
    middleware: [
      'slash-redirect',
      'authenticated'
    ]
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: {
    dirs: [
      '~/components',
      '~/components/layouts',
      '~/components/parts',
      '~/components/pages/login',
      '~/components/pages/clips',
      '~/components/pages/mypage'
    ]
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/date-fns'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey: "AIzaSyAhcGYCrZyapagts72zB8Hc8OEH0Eui8c8",
          authDomain: "your-clipper.firebaseapp.com",
          projectId: "your-clipper",
          storageBucket: "your-clipper.appspot.com",
          messagingSenderId: "719801788127",
          appId: "1:719801788127:web:c95bb6ef2b0bb457716b6a",
          measurementId: "G-E18WV4H76E"
        },
        services: {
          auth: true,
          firestore: true,
          functions: true
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
          primary: '#757575',
          secondary: '#999',
          accent: '#61ab9b',
          info: colors.teal.lighten1,
          warning: '#c4919d',
          error: '#bf3654',
          success: '#61ab9b'
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
