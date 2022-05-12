<template>
  <div
    class="d-flex align-center justify-center page-container -login"
    :class="`-bg${ randomNumber }`"
  >
    <section
      class="login-image"
      :class="`-bg${ randomNumber }`"
    ></section>
    <section class="login">
      <div class="login__inner">
        <div class="mb-10 login__head">
          <figure class="login__title-image">
            <img src="~/assets/images/common/clip.png" alt="" class="d-block ma-auto">
          </figure>
          <h1 class="login__title">
            Clipperへようこそ！
          </h1>
          <p class="login__title-subtext">
            クリッパーは、あなただけのお気に入り画像を<br>
            クリップ（保存）しておけるアプリです。
          </p>
        </div>

        <div class="form__wrapper">
          <v-form
            @submit.prevent
            class="form -login"
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

              <v-col
                cols="12"
                class="py-0"
              >
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

              <v-col
                cols="12"
                class="d-flex justify-center mt-2"
              >
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
import { defineComponent, reactive, toRefs, ref, onMounted } from '@vue/composition-api'
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
      formErrorMessage: '',
      randomNumber: 1
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

    onMounted(() => {
      const numbers = [1, 2, 3]
      const random = Math.floor(Math.random()*numbers.length)
      const result = numbers[random]

      reactiveState.randomNumber = result
    })

    return {
      ...toRefs(reactiveState),
      ...methods,
      registUserDialogRef
    }
  }
})
</script>

<style lang="postcss" scoped>
.page-container.-login {
  @media (--sp) {
    background-image: url('~@/assets/images/login/bg01.jpg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    height: 100%;
    width: 100%;

    &.-bg1 {
      background-image: url('~@/assets/images/login/bg01.jpg');
    }

    &.-bg2 {
      background-image: url('~@/assets/images/login/bg02.jpg');
    }

    &.-bg3 {
      background-image: url('~@/assets/images/login/bg03.jpg');
    }

    &::before {
      content: '';
      backdrop-filter: blur(1px);
      background-color: rgba(0, 0, 0, .08);
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
    }
  }

  & .login-image {
    background-image: url('~@/assets/images/login/bg01.jpg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    height: 100%;
    width: 50%;

    &.-bg1 {
      background-image: url('~@/assets/images/login/bg01.jpg');
    }

    &.-bg2 {
      background-image: url('~@/assets/images/login/bg02.jpg');
    }

    &.-bg3 {
      background-image: url('~@/assets/images/login/bg03.jpg');
    }

    &::before {
      content: '';
      backdrop-filter: blur(1px);
      background-color: rgba(0, 0, 0, .08);
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;

      @media (--sp) {
        backdrop-filter: blur(4px);
      }
    }

    @media (--sp) {
      display: none;
    }
  }

  & .login {
    z-index: 2;

    @media (--not-sp) {
      background-color: #fff;
      width: 50%;
    }

    & .login__head {
      & .login__title {
        color: var(--color-text-light);
        font-family: var(--font-family-base);
        font-size: 26px;
        letter-spacing: .125em;
        line-height: 1.75;
        text-align: center;

        @media (--sp) {
          color: #fffff7;
          font-size: 20px;
        }
      }

      & .login__title-subtext {
        color: var(--color-text-light);
        font-size: 14px;
        font-weight: 300;
        margin-top: 20px;
        letter-spacing: .08em;
        line-height: 2;
        text-align: center;

        @media (--sp) {
          color: #fffff7;
          font-size: 12px;
          margin-top: 12px;
          line-height: 2;
        }

        @media (max-width: 359px) {
          font-size: 11px;
        }
      }

      & .login__title-image {
        margin-bottom: 24px;
        pointer-events: none;

        @media (--sp) {
          margin-bottom: 16px;
        }

        & img {
          width: 68px;

          @media (--sp) {
            width: 54px;
          }
        }
      }
    }

    & .form__wrapper {
      border: 1px solid var(--color-secondary);
      border-radius: 16px;
      margin: auto;
      max-width: 480px;
      padding: 40px;
      width: 80%;

      @media (--sp) {
        background-color: rgba(255, 255, 247, .5);
        border: none;
        border-radius: 12px;
        max-width: 90%;
        padding: 32px 24px;
      }

      & .form__error-text {
        color: #c00;
        font-size: 12px;
        letter-spacing: .02em;
        line-height: 1.75;
        white-space: pre-line;
        margin-top: -24px;

        @media (--sp) {
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
      letter-spacing: .04em;
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
}
</style>