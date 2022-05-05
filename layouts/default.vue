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

export default defineComponent({
  created () {
    /* ログイン認証状態のチェック */
    this.$store.dispatch('checkAuth')
  },

  setup () {
    /** Reactive State **/
    const reactiveState = reactive({
      isPageLoading: false // true: ローディング画面を表示
    })

    onMounted(() => {
      reactiveState.isPageLoading = true

      setTimeout(() => {
        reactiveState.isPageLoading = false
      }, 3000)
    })

    return {
      ...toRefs(reactiveState)
    }
  }
})
</script>