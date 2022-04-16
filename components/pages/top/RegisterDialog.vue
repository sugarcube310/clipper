<template>
  <v-dialog
    v-model="isOpen"
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
      <h2 class="register__title">
        ようこそ！
      </h2>
    </div>
    <div class="register__form">
      <div class="form__inner">
        <v-form @submit.prevent>
          <v-row class="mb-8">
            <v-col cols="12">
              <v-text-field
                v-model="form.email"
                label="メールアドレス"
                required
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="py-0">
              <v-text-field
                v-model="form.password"
                label="パスワード"
                required
                outlined
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="py-0">
              <p
                v-if="formEmptyText"
                class="form__error-text -empty text-center"
              >
                {{ formEmptyText }}
              </p>
            </v-col>

            <v-col cols="12" class="form__submit text-center">
              <v-btn
                color="accent"
                height="44"
                width="180"
                type="submit"
                :loading="isRegisterLoading"
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
  </div>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'

export default defineComponent({
  setup (_) {
    /** Reactive State **/
    const reactiveState = reactive({
      isOpen: false,
      form: {
        email: '',
        password: '',
      },
      emailRules: [
        (v: string) => !!v || 'メールアドレスは必須項目です。',
        (v: string) => /.+@.+/.test(v) || 'メールアドレスを正しく入力してください。',
      ],
      passwordRules: [
        (v: string) => !!v || 'パスワードは必須項目です。',
        (v: string) => v.length >= 8 || 'パスワードは8文字以上で設定してください。',
      ],
      isRegisterLoading: false,
      formEmptyText: ''
    })

    /** Methods **/
    const methods = {
      onRegister () {
        if (reactiveState.form.email === '' && reactiveState.form.password === '') {
          reactiveState.formEmptyText = 'メールアドレスとパスワードを入力してください。'
        } else if (reactiveState.form.email === '' && reactiveState.form.password !== '') {
          reactiveState.formEmptyText = 'メールアドレスを入力してください。'
        } else if (reactiveState.form.email !== '' && reactiveState.form.password === '') {
          reactiveState.formEmptyText = 'パスワードを入力してください。'
        }

        if (reactiveState.form.email !== '' && reactiveState.form.password !== '') {
          if (!methods.checkEmail(reactiveState.form.email)) {
            reactiveState.formEmptyText = '無効なメールアドレスです。'
          } else if (!methods.checkPassword(reactiveState.form.password)) {
            reactiveState.formEmptyText = 'パスワードは半角英数字を含む8文字以上で設定してください。'
          } else {
            reactiveState.isRegisterLoading = true
            setTimeout(() => {
              (this as any).$store.dispatch('register', { email: reactiveState.form.email, password: reactiveState.form.password })
            }, 1000)
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

      onClose () {
        reactiveState.isOpen = false
        setTimeout(() => {
          reactiveState.form.email = ''
          reactiveState.form.password = ''
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
  border: 1px solid rgba(51, 51, 51, .5);
  border-radius: 8px;

  & .register__head {
    margin-top: -4px;

    & .register__title {
      font-size: 22px;
      font-weight: 500;
      letter-spacing: .02em;
      line-height: 1.5;
      text-align: center;
    }
  }

  & .register__form {
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
    cursor: pointer;
    display: inline-block;
    font-size: 14px;
    text-decoration: underline;
    text-decoration-color: transparent;
    text-underline-offset: 4px;
    transition: all .15s;

    &:hover {
      @media (--not-sp) {
        text-decoration-color: #333;
      }
    }
  }
}
</style>