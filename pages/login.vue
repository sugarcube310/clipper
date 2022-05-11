<template>
  <div class="page-container -login d-flex align-center justify-center">
    <section class="login">
      <div class="login__inner">
        <div class="login__head mb-10">
          <figure class="login__title-image">
            <img src="~/assets/images/common/clip.png" alt="" class="d-block ma-auto">
          </figure>
          <h1 class="login__title">
            Clipperへようこそ！
          </h1>
          <p class="login__title-subtext">
            クリッパーは、あなただけのお気に入り画像を<br class="hidden-pc">クリップ(保存)しておけるアプリです。
          </p>
        </div>

        <div class="form__wrapper">
          <v-form
            class="form -login"
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

              <v-col cols="12" class="py-0">
                <p
                  v-if="formErrorMessage && !$store.getters.loginErrorMessage"
                  class="form__error-text text-center"
                >
                  {{ formErrorMessage }}
                </p>
                <p
                  v-if="$store.getters.loginErrorMessage"
                  class="form__error-text text-center"
                >
                  {{ $store.getters.loginErrorMessage }}
                </p>
              </v-col>

              <v-col cols="12" class="d-flex justify-center mt-2">
                <v-btn
                  color="accent"
                  depressed
                  class="rounded-lg"
                  height="44"
                  width="160"
                  type="submit"
                  :loading="$store.getters.loading"
                  :disabled="$store.getters.loading"
                  @click="onLogin()"
                >
                  ログイン
                </v-btn>
              </v-col>
            </v-row>
          </v-form>

          <v-divider />

          <p
            class="register__text d-block text-center"
            @click="openRegistUserDialog()"
          >
            アカウントをお持ちでない方はこちら
          </p>
        </div>
      </div>

      <RegistUserDialog ref="registUserDialogRef" />

      <transition name="fade" appear>
        <LogoutMessage v-if="$store.getters.isShowLogoutMessage" />
      </transition>

    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from '@vue/composition-api'
import { mapGetters } from 'vuex'

export default defineComponent({
  layout: 'beforeAuth',

  computed: {
    ...mapGetters(['user'])
  },

  setup () {
    const registUserDialogRef = ref<any>(null)

    /** Reactive State **/
    const reactiveState = reactive({
      form: {
        email: '',
        password: ''
      },
      isShowPassword: false,
      formErrorMessage: ''
    })

    /** Methods **/
    const methods = {
      /* ログイン処理 */
      onLogin () {
        if (reactiveState.form.email !== '' && reactiveState.form.password !== '') {
          (this as any).$store.dispatch('login', { email: reactiveState.form.email, password: reactiveState.form.password })
          return
        } else {
          reactiveState.formErrorMessage = 'メールアドレスとパスワードを入力してください。'
          return
        }
      },

      /* アカウント新規登録のダイアログを表示 */
      openRegistUserDialog () {
        if (registUserDialogRef.value) {
          registUserDialogRef.value.isOpenDialog = true
        }
      }
    }

    return {
      ...toRefs(reactiveState),
      ...methods,
      registUserDialogRef
    }
  }
})
</script>

<style lang="postcss" scoped>
.login__inner {
  & .login__head {
    & .login__title {
      color: var(--color-primary);
      font-family: var(--font-family-base);
      font-size: 24px;
      letter-spacing: .08em;
      line-height: 1.75;
      text-align: center;

      @media (--sp) {
        font-size: 20px;
      }
    }

    & .login__title-subtext {
      color: var(--color-text-light);
      font-size: 14px;
      font-weight: 300;
      margin-top: 16px;
      letter-spacing: .025em;
      line-height: 1.75;
      text-align: center;

      @media (--sp) {
        font-size: 12px;
        margin-top: 12px;
        letter-spacing: .04em;
      }

      @media (max-width: 359px) {
        font-size: 11px;
      }
    }

    & .login__title-image {
      margin-bottom: 20px;
      pointer-events: none;

      @media (--sp) {
        margin-bottom: 16px;
      }

      & img {
        width: 70px;

        @media (--sp) {
          width: 54px;
        }
      }
    }
  }

  & .form__wrapper {
    border: 1px solid rgba(102, 102, 102, .7);
    border-radius: 16px;
    margin: auto;
    max-width: 480px;
    padding: 40px;

    @media (--sp) {
      border-radius: 12px;
      max-width: 100%;
      padding: 32px 24px;
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
  }

  & .register__text {
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