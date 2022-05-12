<template>
  <v-app>
    <v-main>
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  created () {
    /* ログイン認証状態のチェック */
    this.$store.dispatch('checkAuth')
  }
})
</script>