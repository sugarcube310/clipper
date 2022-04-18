<template>
  <v-app-bar
    app
    fixed
    color="white"
  >
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>mdi-heart</v-icon>
    </v-btn>
    <v-app-bar-nav-icon></v-app-bar-nav-icon>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'

export default defineComponent({
  setup (_) {
    /** Reactive State **/
    const reactiveState = reactive({
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
.footer {
  background-color: #ccc;
}
.footer__copy {
  font-size: 11px;
  letter-spacing: .02em;
}
</style>
