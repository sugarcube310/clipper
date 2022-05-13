<template>
  <v-dialog
    v-model="isOpenDialog"
    persistent
    width="480"
  >
    <div class="deleteAccountDialog__inner">
      <v-row>
        <v-col
          cols="12"
          class="d-flex flex-column justify-center"
        >
          <p class="deleteAccountDialog__title text-center">
            アカウントを削除します。<br>本当によろしいですか？
          </p>
          <p class="deleteAccountDialog__text text-center">
            ※保存したクリップも削除されます。<br>
            ※削除すると、元には戻せません。
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
            @click="deleteAccount()"
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
        <transition
          v-if="deletingMessage"
          name="fade"
          appear
        >
          <v-col
            cols="12"
            class="d-flex justify-center mt-5"
          >
            <p class="deletingMessage text-center">
              {{ deletingMessage }}
            </p>
          </v-col>
        </transition>
      </v-row>
    </div>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { auth } from '@/plugins/firebase'

export default defineComponent({
  setup () {
    /** Reactive State **/
    const reactiveState = reactive({
      isOpenDialog: false,
      isLoading: false,
      deletingMessage: ''
    })

    /** Methods **/
    const methods = {
      /* アカウント削除ダイアログを閉じる */
      onClose () {
        reactiveState.isOpenDialog = false
      },

      /* アカウント削除 */
      deleteAccount () {
        reactiveState.isLoading = true

        const user = auth.currentUser
        if (user) {
          reactiveState.deletingMessage = '削除しています。まもなくログアウトします。'

          setTimeout(() => {
            // Authenticationからユーザーを削除
            user.delete()
            .then(() => {
              console.log('Successfully: deleted user from Authentication.')
              reactiveState.isLoading = false
            })
            .catch((error) => {
              console.log(error)
            })
          }, 3000)
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
.deleteAccountDialog__inner {
  background-color: #fff;
  padding: 60px 24px;

  @media (--sp) {
    padding: 40px 20px;
  }

  & .deleteAccountDialog__title {
    color: var(--color-error);
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 24px;
    letter-spacing: .04em;
    line-height: 1.75;

    @media (--sp) {
      font-size: 16px;
      margin-bottom: 16px;
      letter-spacing: .02em;
    }
  }

  & .deleteAccountDialog__text {
    color: var(--color-primary);
    font-size: 14px;
    margin: 20px 0 8px !important;
    letter-spacing: .08em;
    line-height: 1.75;

    @media (--sp) {
      font-size: 12px;
      margin: 16px 0 4px !important;
      letter-spacing: .02em;
    }
  }

  & .deletingMessage {
    color: var(--color-error);
    font-size: 13px;
    font-weight: bold;
    letter-spacing: .04em;

    @media (--sp) {
      font-size: 11px;
      letter-spacing: .02em;
    }
  }
}
</style>