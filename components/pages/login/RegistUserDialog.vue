<template>
  <v-dialog
    v-model="isOpenDialog"
    persistent
    width="560"
  >
  <div class="registerDialog__inner px-10 pt-8 pb-10">
    <v-btn
      icon
      color="primary"
      height="40"
      width="40"
      class="d-flex ml-auto"
      @click="onClose()"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <div class="registerDialog__head mb-8">
      <h2 class="text-center pt-2">
        あなたのアカウントを作成しましょう
      </h2>
      <div class="registerDialog__head-icon text-center mt-1">
        <p v-if="formErrorMessage || $store.getters.registerErrorMessage" class="icon mb-0">:o</p>
        <p v-else class="icon mb-0">:)</p>
      </div>
    </div>
    <div class="form__wrapper">
      <v-form
        class="form -register"
        @submit.prevent
      >
        <v-row class="mb-8">
          <v-col cols="12" class="py-1">
            <v-text-field
              v-model="form.email"
              label="メールアドレス"
              outlined
              class="rounded-lg"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="py-1">
            <v-text-field
              v-model="form.password"
              label="パスワード"
              outlined
              class="rounded-lg"
              required
              :append-icon="isShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="isShowPassword ? 'text' : 'password'"
              @click:append="isShowPassword = !isShowPassword"
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="py-1">
            <v-text-field
              v-model="form.name"
              label="ユーザー名"
              outlined
              class="rounded-lg"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" class="py-0">
            <p
              v-if="formErrorMessage && !$store.getters.registerErrorMessage"
              class="form__error-text text-center"
            >
              {{ formErrorMessage }}
            </p>
            <p
              v-if="$store.getters.registerErrorMessage"
              class="form__error-text text-center py-0"
            >
              {{ $store.getters.registerErrorMessage }}
            </p>
          </v-col>

          <v-col cols="12" class="form__submit text-center">
            <v-btn
              color="accent"
              depressed
              class="rounded-lg"
              height="44"
              width="180"
              type="submit"
              :loading="$store.getters.loading"
              :disabled="$store.getters.loading"
              @click="onRegister()"
            >
              アカウント登録
            </v-btn>
          </v-col>
        </v-row>
      </v-form>

      <v-divider />

      <p
        class="login__text d-block mt-8 text-center"
        @click="onClose()"
      >
        すでにアカウントをお持ちの方はこちら
      </p>
    </div>
  </div>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'

export default defineComponent({
  setup (_) {
    /** Reactive State **/
    const reactiveState = reactive({
      isOpenDialog: false,
      form: {
        email: '',
        password: '',
        name: ''
      },
      isShowPassword: false,
      formErrorMessage: ''
    })

    /** Methods **/
    const methods = {
      /* アカウントの新規登録 */
      onRegister () {
        if (reactiveState.form.email === '' && reactiveState.form.password === '') {
          reactiveState.formErrorMessage = '上記項目は必須です。'
        } else if (reactiveState.form.email === '' && reactiveState.form.password !== '' && reactiveState.form.name !== '') {
          reactiveState.formErrorMessage = 'メールアドレスを入力してください。'
        } else if (reactiveState.form.email !== '' && reactiveState.form.password === '' && reactiveState.form.name !== '') {
          reactiveState.formErrorMessage = 'パスワードを入力してください。'
        } else if (reactiveState.form.email !== '' && reactiveState.form.password !== '' && reactiveState.form.name === '') {
          reactiveState.formErrorMessage = 'ユーザー名を入力してください。'
        }

        if (reactiveState.form.email !== '' && reactiveState.form.password !== '' && reactiveState.form.name !== '') {
          if (!methods.checkEmail(reactiveState.form.email)) {
            reactiveState.formErrorMessage = '無効なメールアドレスです。'
          } else if (!methods.checkPassword(reactiveState.form.password)) {
            reactiveState.formErrorMessage = 'パスワードは半角英数字を含む8文字以上で設定してください。'
          } else {
            (this as any).$store.dispatch('register', { email: reactiveState.form.email, password: reactiveState.form.password, name: reactiveState.form.name })
            reactiveState.formErrorMessage = ''
            return
          }
        }
      },

      /* メールアドレスのバリデーション */
      checkEmail (email: string) {
        const mailRule = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return mailRule.test(email)
      },

      /* パスワードのバリデーション */
      checkPassword (password: string) {
        const passwordRule = /^(?=.*?[-_a-zA-Z0-9])(?=.*?\d)[-_a-zA-Z0-9\d]{8,100}$/i
        return passwordRule.test(password)
      },

      /* フォームクリア */
      clearForm () {
        reactiveState.form.email = ''
        reactiveState.form.password = ''
        reactiveState.form.name = ''
      },

      /* アカウント新規登録ダイアログを閉じる */
      onClose () {
        reactiveState.isOpenDialog = false
        setTimeout(() => {
          methods.clearForm()
          reactiveState.formErrorMessage = ''
        }, 500)
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
.registerDialog__inner {
  background-color: #fff;

  & .registerDialog__head {
    margin-top: -4px;

    & h2 {
      color: #555;
      font-size: 19px;
      font-weight: 500;
      letter-spacing: .02em;
      line-height: 1.5;
    }

    & .registerDialog__head-icon {
      & .icon {
        color: #333;
        display: inline-block;
        font-size: 20px;
        letter-spacing: .1em;
        transform: rotate(90deg);
      }
    }
  }

  & .form__error-text {
    color: #c00;
    font-size: 12px;
    letter-spacing: .01em;
    line-height: 1.75;
    white-space: pre-line;
    margin-top: -24px;
  }

  & .login__text {
    color: var(--color-secondary);
    cursor: pointer;
    display: inline-block;
    font-size: 14px;
    text-decoration: underline;
    text-decoration-color: transparent;
    text-underline-offset: 4px;
    transition: all .15s;

    &:hover {
      @media (--not-sp) {
        text-decoration-color: var(--color-secondary);
      }
    }
  }
}
</style>