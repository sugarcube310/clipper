<template>
  <v-dialog
    v-model="isOpenDeleteDialog"
    persistent
    width="400"
  >
    <div class="deleteClipDialog__inner">
      <v-row>
        <v-col
          cols="12"
          class="d-flex justify-center mb-5"
        >
          <p class="deleteClipDialog__text text-center">
            このクリップを削除しますか？
          </p>
        </v-col>
        <v-col
          cols="12"
          class="button-group"
        >
          <v-btn
            color="warning"
            depressed
            rounded
            class="button"
            :loading="isLoading"
            :disabled="isLoading"
            @click="deleteClip()"
          >
            削除
          </v-btn>
          <v-btn
            color="#e8e8e8"
            depressed
            rounded
            class="button -color-gray"
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
import { auth, storage, dbPicturesRef } from '@/plugins/firebase'

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
        const user = auth.currentUser
        if (user) {
          reactiveState.isLoading = true

          const uid = user.uid

          const storageRef = storage.ref()
          const fileUrl = `${ uid }/${ props.clip.file_name }`
          const deleteFileRef = storageRef.child(fileUrl)

          setTimeout(() => {
            // Storageからファイルを削除
            deleteFileRef
            .delete()
            .then(() => {
              // Storageからの削除に成功したら、Firestoreからデータを削除
              // Firestoreでは .where(条件).delete() ができないみたいなので、一度条件に合うドキュメントを取得してから削除する
              dbPicturesRef
              .where('user_id', '==', uid)
              .where('file_name', '==', props.clip.file_name)
              .get()
              .then((querySnapshot) => { // ※ 単一のドキュメント取得で.where(条件)は使えないみたいなのでquerySnapshotにしている
                const docs = [] as any[]

                querySnapshot.forEach((doc) => {
                  docs.push({
                    id: doc.id,
                    data: doc.data()
                  })
                })

                docs.forEach((doc) => {
                  dbPicturesRef
                  .doc(doc.id)
                  .delete()
                  .then(() => {
                    methods.onClose()

                    emit('close')

                    // ユーザー情報(公開クリップ件数)を更新
                    emit('update')

                    reactiveState.isLoading = false

                    console.log('Successfully: Deleted the Clip.')
                  })
                  .catch((error) => {
                    console.error('ERROR: Unable to delete from Firestore.', error)
                  })
                })
              })
              .catch((error) => {
                console.error('ERROR: Unable to get data from Firestore.', error)
              })
            })
            .catch((error) => {
              console.error('ERROR: Unable to delete from Storage.', error)
            })
          }, 1000)
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
    letter-spacing: .06em;

    @media (--sp) {
      font-size: 14px;
      letter-spacing: .04em;
    }
  }
}
</style>