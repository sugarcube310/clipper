<template>
  <v-footer
    :absolute="!fixed"
    app
  >
    <span>&copy; {{ new Date().getFullYear() }}</span>
  </v-footer>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'

export default defineComponent({
  setup (_) {
    /** Reactive State **/
    const reactiveState = reactive({
      fixed: false,
    })

    /** Methods **/
    const methods = {
    }

    return {
      ...toRefs(reactiveState),
      ...methods
    }
  }
})
</script>

<style lang="postcss">
</style>
