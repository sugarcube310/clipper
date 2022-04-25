<template>
  <v-app>
    <h1>
      404 Not Found
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