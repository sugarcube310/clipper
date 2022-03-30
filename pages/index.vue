<template>
  <div class="container">
    <p class="text">{{ text }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, SetupContext } from '@vue/composition-api'

export default defineComponent({
  setup (_) {
    /** Reactive State **/
    const reactiveState = reactive({
      text: 'Hello!'
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
.container {
  & .text {
    color: var(--color-primary);

    @media (--sp) {
      color: var(--color-secondary);
    }
  }
}
</style>