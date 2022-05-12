<template>
  <v-dialog
    v-model="isOpenDialog"
    persistent
    width="560"
  >
  <div class="registerDialog__inner">
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
    <div class="registerDialog__head">
      <h2 class="text-center pt-2">
        あなたのアカウントを<br class="hidden-pc">作成しましょう
      </h2>
      <div class="registerDialog__head-icon text-center">
        <p v-if="formErrorMessage || $store.getters.registerErrorMessage" class="icon">:o</p>
        <p v-else class="icon">:)</p>
      </div>
    </div>
    <div class="form__wrapper">
      <v-form
        class="form -register"
        @submit.prevent
      >
        <v-row class="mb-6">
          <v-col cols="12">
            <v-text-field
              v-model="form.email"
              label="メールアドレス"
              hide-details
              outlined
              color="secondary"
              class="rounded-lg"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="form.password"
              label="パスワード"
              hide-details
              outlined
              color="secondary"
              class="rounded-lg"
              required
              autocomplete="on"
              :append-icon="isShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="isShowPassword ? 'text' : 'password'"
              @click:append="isShowPassword = !isShowPassword"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="form.name"
              label="ユーザー名"
              hide-details
              outlined
              color="secondary"
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

          <v-col cols="12" class="d-flex justify-center mt-2">
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
        class="login__text d-block text-center"
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
  padding: 32px 40px 48px;

  @media (--sp) {
    padding: 20px 20px 40px;
  }

  & .registerDialog__head {
    margin: -4px auto 40px;

    @media (--sp) {
      margin-bottom: 20px;
    }

    & h2 {
      color: var(--color-text-light);
      font-size: 20px;
      font-weight: 500;
      letter-spacing: .02em;
      line-height: 1.5;

      @media (--sp) {
        font-size: 16px;
      }
    }

    & .registerDialog__head-icon {
      & .icon {
        color: var(--color-text-light);
        display: inline-block;
        font-size: 20px;
        margin-top: 4px;
        letter-spacing: .1em;
        transform: rotate(90deg);

        @media (--sp) {
          font-size: 16px;
        }
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

    @media (--sp) {
      font-size: 11px;
    }

    @media (max-width: 359px) {
      font-size: 10px;
    }
  }

  & .login__text {
    color: var(--color-text-light);
    cursor: pointer;
    display: inline-block;
    font-size: 14px;
    margin-top: 32px;
    text-decoration: underline;
    text-decoration-color: transparent;
    text-underline-offset: 4px;
    transition: all .15s;

    @media (--sp) {
      font-size: 12px;
      margin: 24px 0 0;
    }

    @media (max-width: 359px) {
      font-size: 11px;
    }

    &:hover {
      @media (--not-sp) {
        text-decoration-color: var(--color-text-light);
      }
    }
  }
}
</style>