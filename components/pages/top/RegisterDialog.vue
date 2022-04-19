<template>
  <v-dialog
    v-model="isOpenDialog"
    persistent
    width="560"
  >
  <div class="register__dialog-inner px-10 pt-8 pb-10">
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
    <div class="register__head mb-8">
      <h2 class="text-center">
        pentaへようこそ！
      </h2>
      <div class="register__icon text-center mt-1">
        <p v-if="formErrorMessage || $store.getters.registerErrorMessage" class="icon mb-0">:o</p>
        <p v-else class="icon mb-0">:)</p>
      </div>
    </div>
    <div class="register__form-wrapper">
      <v-form @submit.prevent class="register__form">
        <v-row class="mb-8">
          <v-col cols="12" class="py-1">
            <v-text-field
              v-model="form.email"
              label="メールアドレス"
              outlined
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="py-1">
            <v-text-field
              v-model="form.password"
              label="パスワード"
              outlined
              required
              :append-icon="password_show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="password_show ? 'text' : 'password'"
              @click:append="password_show = !password_show"
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="py-1">
            <v-text-field
              v-model="form.name"
              label="ユーザー名"
              outlined
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" class="py-0">
            <p
              v-if="formErrorMessage && !$store.getters.registerErrorMessage"
              class="form__error-text -empty text-center"
            >
              {{ formErrorMessage }}
            </p>
            <p
              v-if="$store.getters.registerErrorMessage"
              class="form__error-text -message text-center py-0"
            >
              {{ $store.getters.registerErrorMessage }}
            </p>
          </v-col>

          <v-col cols="12" class="form__submit text-center">
            <v-btn
              color="accent"
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
      password_show: false,
      formErrorMessage: ''
    })

    /** Methods **/
    const methods = {
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

      checkEmail (email: string) {
        const mailRule = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return mailRule.test(email)
      },

      checkPassword (password: string) {
        const passwordRule = /^(?=.*?[-_a-zA-Z0-9])(?=.*?\d)[-_a-zA-Z0-9\d]{8,100}$/i
        return passwordRule.test(password)
      },

      clearForm () {
        reactiveState.form.email = ''
        reactiveState.form.password = ''
        reactiveState.form.name = ''
      },

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

<style lang="postcss">
.register__dialog-inner {
  background-color: #fff;
  border: 1px solid rgba(102, 102, 102, .6);
  border-radius: 8px;

  & .register__head {
    margin-top: -4px;

    & h2 {
      font-size: 24px;
      font-weight: 500;
      letter-spacing: .025em;
      line-height: 1.5;
    }

    & .register__icon {
      & .icon {
        display: inline-block;
        font-size: 24px;
        font-weight: bold;
        letter-spacing: .1em;
        transform: rotate(90deg);
      }
    }
  }

  & .register__form-wrapper{
    & .form__error-text {
      color: #c00;
      font-size: 12px;
      letter-spacing: .01em;
      line-height: 1.75;
      white-space: pre-line;
      margin-top: -24px;
    }
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