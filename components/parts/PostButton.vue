<template>
  <div class="postButton">
    <v-btn
      class="ma-4"
      fixed
      bottom
      right
      fab
      color="white"
      @click="openDialog()"
    >
      <v-icon large color="secondary">
        mdi-plus
      </v-icon>
    </v-btn>

    <PostDialog ref="postDialogRef" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from '@vue/composition-api'

export default defineComponent({
  setup () {
    const postDialogRef = ref<any>(null)

    /** Reactive State **/
    const reactiveState = reactive({
    })

    /** Methods **/
    const methods = {
      openDialog () {
        if (postDialogRef.value) {
          postDialogRef.value.isOpenDialog = true
        }
      }
    }

    return {
      ...toRefs(reactiveState),
      ...methods,
      postDialogRef
    }
  }
})
</script>

<style lang="postcss" scoped>
</style>