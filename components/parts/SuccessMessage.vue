<template>
  <div class="successMessage">
    <v-alert
      color="accent"
      type="success"
    >
      新しい投稿を追加しました！
    </v-alert>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'

export default defineComponent({
  setup () {
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

<style lang="postcss" scoped>
.successMessage {
  position: fixed;
  top: 64px;
  right: 20px;
  z-index: 5;
}
</style>