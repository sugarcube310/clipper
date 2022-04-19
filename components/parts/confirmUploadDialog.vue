<template>
  <div class="confirmUpload">
    <v-dialog
      v-model="isOpenDialog"
      persistent
      width="400"
    >
      <div class="confirm__dialog-inner px-10 py-10">
        <v-row>
          <v-col cols="12" class="text-center">
            <p class="mb-0">
              投稿を作成しますか？
            </p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" class="d-flex justify-center">
            <v-btn
              color="accent"
              height="44"
              width="120"
            >
              作成
            </v-btn>
          </v-col>
          <v-col cols="6" class="d-flex justify-center">
            <v-btn
              color="gray"
              height="44"
              width="120"
              @click="onClose()"
            >
              キャンセル
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'

export default defineComponent({

  setup () {
    /** Reactive State **/
    const reactiveState = reactive({
      isOpenDialog: false
    })

    /** Methods **/
    const methods = {
      openDialog () {
        reactiveState.isOpenDialog = true
      },

      onClose () {
        reactiveState.isOpenDialog = false
      }
    }

    return {
      ...toRefs(reactiveState),
      ...methods
    }
  }
})
</script>

<style lang="postcss">
.confirm__dialog-inner {
  background-color: #fff;
}
</style>
