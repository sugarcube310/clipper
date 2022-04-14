<template>
  <div class="page-container -list">
    list
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, SetupContext } from '@vue/composition-api'
import { useRouter } from '../plugins/use-router'

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

<style lang="postcss">
</style>