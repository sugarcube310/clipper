<template>
  <div class="page-container -top">
    <section class="login">
      <div class="login__inner">
        <div class="login__head">
          <h1 class="login__title">
            penta
            <span>- ペンタ -</span>
          </h1>
          <p class="login__title-subtext">
            Lorem ipsum dolor sit amet,<br>
            consectetur adipiscing elit,<br>
            sed do eiusmod tempor incididunt ut labore
          </p>
        </div>
        <div class="login__form">
          <div class="form__inner pa-10">
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
                    v-if="formEmptyText && !$store.getters.loginErrorMessage"
                    class="form__error-text -empty text-center"
                  >
                    {{ formEmptyText }}
                  </p>
                  <p
                    v-if="$store.getters.loginErrorMessage"
                    class="form__error-text -message text-center"
                  >
                    {{ $store.getters.loginErrorMessage }}
                  </p>
                </v-col>

                <v-col cols="12" class="form__submit text-center">
                  <v-btn
                    color="accent"
                    height="44"
                    width="160"
                    type="submit"
                    :loading="$store.getters.loginLoading"
                    @click="onLogin()"
                  >
                    ログイン
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>

            <v-divider />

            <p
              class="register__text d-block mt-8 text-center"
              @click="openRegisterDialog()"
            >
              アカウントをお持ちでない方はこちら
            </p>
          </div>
        </div>
      </div>

      <RegisterDialog ref="registerDialogRef" />
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from '@vue/composition-api'
import { useRouter } from '@/plugins/use-router'

export default defineComponent({
  computed: {
    user () {
      return this.$store.getters['user']
    }
  },
  setup (_) {
    const router = useRouter()
    const registerDialogRef = ref<any>(null)

    /** Reactive State **/
    const reactiveState = reactive({
      form: {
        email: '',
        password: '',
      },
      formEmptyText: ''
    })

    /** Methods **/
    const methods = {
      onLogin () {
        if (reactiveState.form.email !== '' && reactiveState.form.password !== '') {
          (this as any).$store.dispatch('login', { email: reactiveState.form.email, password: reactiveState.form.password })
          return
        } else {
          reactiveState.formEmptyText = 'メールアドレスとパスワードを入力してください。'
          return
        }
      },

      openRegisterDialog () {
        if (registerDialogRef.value) {
          registerDialogRef.value.isOpen = true
        }
      }
    }

    return {
      ...toRefs(reactiveState),
      ...methods,
      registerDialogRef
    }
  }
})
</script>

<style lang="postcss">
.login__inner {
  padding: 120px 0;

  & .login__head {
    margin-bottom: 80px;

    & .login__title span {
      display: block;
      font-size: 14px;
      line-height: 0;
      padding-top: 12px;
    }

    & .login__title-subtext {
      font-size: 28px;
      font-weight: 300;
      letter-spacing: .02em;
      line-height: 1.5;
      text-align: center;
      margin-top: 32px;
    }
  }

  & .login__form {
    border: 1px solid rgba(51, 51, 51, .5);
    border-radius: 4px;
    max-width: 560px;
    margin: auto;

    & .form__error-text {
      color: #c00;
      font-size: 12px;
      letter-spacing: .01em;
      line-height: 1.75;
      white-space: pre-line;
      margin-top: -24px;
    }
  }

  & .register__text {
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