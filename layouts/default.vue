<template>
  <v-app>
    <Header v-show="!isPageLoading" />
    <v-main>
      <PageLoading v-if="isPageLoading" />
      <transition v-else name="fade-long" appear>
        <v-container>
          <Nuxt />
        </v-container>
      </transition>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted } from '@vue/composition-api'
import { useRouter } from '@/plugins/use-router'
import { auth } from '@/plugins/firebase'

export default defineComponent({
  created () {
    /* ログイン認証状態のチェック */
    this.$store.dispatch('checkAuth')
  },

  setup () {
    const router = useRouter()

    /** Reactive State **/
    const reactiveState = reactive({
      isPageLoading: false // true: ローディング画面を表示
    })

    onMounted(() => {
      reactiveState.isPageLoading = true

      setTimeout(() => {
        reactiveState.isPageLoading = false

        /* 未ログインの場合はログインページに遷移 */
        const user = auth.currentUser
        if (!user) {
          return router.push('/login/')
        }
      }, 3000)
    })

    return {
      ...toRefs(reactiveState)
    }
  }
})
</script>