<template>
  <v-dialog
    v-model="isOpenDeleteDialog"
    persistent
    width="400"
  >
    <div class="deleteClipDialog__inner">
      <v-row>
        <v-col cols="12" class="d-flex justify-center">
          <p class="deleteClipDialog__text text-center">
            このクリップを削除しますか？
          </p>
        </v-col>
        <v-col
          cols="12"
          class="d-flex justify-center"
        >
          <v-btn
            color="warning"
            depressed
            class="rounded-lg mr-3"
            height="44"
            width="120"
            :loading="isLoading"
            :disabled="isLoading"
            @click="deleteClip()"
          >
            削除
          </v-btn>
          <v-btn
            color="#e8e8e8"
            depressed
            class="rounded-lg ml-3 color-gray__button"
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
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { dbPicturesRef } from '@/plugins/firebase'

export default defineComponent({
  props: {
    clip: {
      type: Object,
      required: true
    }
  },
  setup (props, { emit }) {
    /** Reactive State **/
    const reactiveState = reactive({
      isOpenDeleteDialog: false,
      isLoading: false
    })

    /** Methods **/
    const methods = {
      /* クリップ削除ダイアログを閉じる */
      onClose () {
        reactiveState.isOpenDeleteDialog = false
      },

      /* クリップ削除 */
      deleteClip () {
        reactiveState.isLoading = true

        setTimeout(() => {
          const clip_id = props.clip.id

          dbPicturesRef
          .doc(clip_id)
          .delete()
          .then(() => {
            reactiveState.isLoading = false
          }).catch((error) => {
            console.error(error)
          })

          reactiveState.isLoading = false
          methods.onClose()
          emit('close')
        }, 1000)
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
.deleteClipDialog__inner {
  background-color: #fff;
  padding: 60px 20px;

  & .deleteClipDialog__text {
    color: var(--color-text-light);
    font-size: 18px;
    font-weight: bold;
    letter-spacing: .025em;

    @media (--sp) {
      font-size: 17px;
    }
  }
}
</style>