<template>
  <div
    class="pageBack-button"
    @click="pageBack()"
  >
    <span class="mdi mdi-arrow-left"></span>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { useRouter } from '@/plugins/use-router'

export default defineComponent({
  setup () {
    const router = useRouter()

    /** Reactive State **/
    const reactiveState = reactive({
    })

    /** Methods **/
    const methods = {
      pageBack () {
        history.back()
      }
    }

    return {
      ...toRefs(reactiveState),
      ...methods
    }
  }
})
</script>

<style lang="postcss" scoped>
.pageBack-button {
  cursor: pointer;
  transition: all .3s;

  &:hover {
    @media (--not-sp) {
      opacity: .8;
    }
  }

  & .mdi {
    color: var(--color-primary);
    font-size: 28px !important;
  }
}
</style>