<template>
  <v-dialog
    v-model="isOpenDialog"
    persistent
    width="480"
  >
    <div class="deleteAccountDialog__inner">
      <v-row>
        <v-col cols="12" class="d-flex flex-column justify-center">
          <p class="deleteAccountDialog__title text-center">
            アカウントを削除します。<br>本当によろしいですか？
          </p>
          <p class="deleteAccountDialog__text text-center">
            ※保存したクリップも削除されます。
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
            @click="deleteAccount()"
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
        <transition
          v-if="deletingMessage"
          name="fade"
          appear
        >
          <v-col cols="12" class="d-flex justify-center mt-5">
            <p class="deletingMessage text-center mb-0">
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
          reactiveState.deletingMessage = '削除中です。まもなくログアウトします。'

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
    letter-spacing: .04em;

    @media (--sp) {
      font-size: 12px;
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