<template>
  <v-app>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api'
import { useRouter } from '@/plugins/use-router'
import { auth } from '@/plugins/firebase'

export default defineComponent({
  created () {
    /* ログイン認証状態のチェック */
    this.$store.dispatch('checkAuth')
  },

  setup () {
    const router = useRouter()

    onMounted(() => {
      /* ログイン済みの場合は一覧ページに遷移 */
      auth.onAuthStateChanged((user) => {
        if (user) {
          return router.push('/clips/')
        }
      })
    })
  }
})
</script>