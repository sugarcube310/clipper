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
import { auth, dbUsersRef, dbPicturesRef } from '@/plugins/firebase'

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

        const clip_id = props.clip.id

        dbPicturesRef
        .doc(clip_id)
        .delete()
        .then(() => {
          console.log('Successfully: Deleted the Clip.')

          reactiveState.isLoading = false
          methods.onClose()

          emit('close')

          // ユーザー情報(公開クリップ件数)を更新
          methods.updateUser()
        })
        .catch((error) => {
          console.error(error)
        })
      },

      /* ユーザー情報を更新 */
      updateUser () {
        const user = auth.currentUser
        if (user) {
          const uid = user.uid

          dbPicturesRef
          .where('user_id', '==', uid)
          .where('private_setting', '==', false)
          .onSnapshot((querySnapshot) => {
            const docs = [] as any[]

            querySnapshot.forEach((doc) => {
              docs.push(doc)
            })

            dbUsersRef
            .doc(uid)
            .set({
              releases: docs.length,
              updated_time: new Date()
            }, { merge: true })
            .then(() => {
              // Storeのユーザー情報を更新
              emit('update')

              console.log('Successfully: Updated user data. (from DeleteClip)')
            })
            .catch((error) => {
              console.error(error)
            })
          })
        } else {
          return
        }
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
    color: var(--color-primary);
    font-size: 18px;
    font-weight: bold;
    letter-spacing: .04em;

    @media (--sp) {
      font-size: 16px;
      letter-spacing: .02em;
    }
  }
}
</style>