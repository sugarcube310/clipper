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
            アカウントの削除
          </p>
          <p class="deleteAccountDialog__text text-center">
            アカウントを削除すると、<br>保存したクリップも削除されます。
            <span>※削除すると元には戻せません。</span>
          </p>
        </v-col>
      </v-row>
      <v-row>
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
import { auth, functions } from '@/plugins/firebase'

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
        reactiveState.deletingMessage = '削除しています。まもなくログアウトします。'

        const user = auth.currentUser
        if (user) {
          const uid = user.uid
          const args = {
            uid: uid
          }

          // Authenticationからユーザーを削除
          const deleteAuth = functions.httpsCallable('deleteAuth')
          deleteAuth(args)

          setTimeout(() => {
            (this as any).$store.dispatch('logout')
            reactiveState.isLoading = false
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
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 24px;
    letter-spacing: .04em;
    line-height: 1.75;

    @media (--sp) {
      font-size: 18px;
      margin-bottom: 16px;
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

    & span {
      color: var(--color-error);
      display: block;
      font-size: 12px;
      margin-top: 8px;

      @media (--sp) {
        font-size: 11px;
      }
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