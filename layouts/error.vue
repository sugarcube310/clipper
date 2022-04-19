<template>
  <v-app dark>
    <h1 v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </h1>
    <h1 v-else>
      {{ otherError }}
    </h1>
    <NuxtLink to="/">
      Home page
    </NuxtLink>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'

export default defineComponent({
  setup () {
    /** Reactive State **/
    const reactiveState = reactive({
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    })

    return {
      ...toRefs(reactiveState)
    }
  }
})
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>