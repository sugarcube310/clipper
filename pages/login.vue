<template>
  <div class="page-container -login d-flex align-center justify-center">
    <section class="login">
      <div class="login__inner">
        <div class="login__head">
          <figure class="login__title-image">
            <img src="~/assets/images/icon.png" alt="" class="hat d-block ma-auto">
            <img src="~/assets/images/penta.png" alt="" class="boy d-block ma-auto">
          </figure>
          <h1 class="login__title">
            penta
            <span>- ペンタ -</span>
          </h1>
        </div>

        <div class="form__wrapper pa-10">
          <v-form
            class="form -login"
            @submit.prevent
          >
            <v-row class="mb-8">
              <v-col cols="12" class="pb-1">
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
                  :append-icon="password_show ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="password_show ? 'text' : 'password'"
                  @click:append="password_show = !password_show"
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

              <v-col cols="12" class="form__submit text-center">
                <v-btn
                  color="accent"
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
            class="register__text d-block mt-8 text-center"
            @click="openRegistUserDialog()"
          >
            アカウントをお持ちでない方はこちら
          </p>
        </div>
      </div>

      <RegistUserDialog ref="registUserDialogRef" />
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from '@vue/composition-api'
import { mapGetters } from 'vuex'
import { useRouter } from '@/plugins/use-router'

export default defineComponent({
  layout: 'noHeader',
  computed: {
    ...mapGetters(['user'])
  },
  setup () {
    const router = useRouter()
    const registUserDialogRef = ref<any>(null)

    /** Reactive State **/
    const reactiveState = reactive({
      form: {
        email: '',
        password: ''
      },
      password_show: false,
      formErrorMessage: ''
    })

    /** Methods **/
    const methods = {
      onLogin () {
        if (reactiveState.form.email !== '' && reactiveState.form.password !== '') {
          (this as any).$store.dispatch('login', { email: reactiveState.form.email, password: reactiveState.form.password })
          return
        } else {
          reactiveState.formErrorMessage = 'メールアドレスとパスワードを入力してください。'
          return
        }
      },

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
    margin-bottom: 48px;

    & .login__title {
      color: #555;
      font-family: var(--font-family-base);
      font-size: 28px;
      letter-spacing: .08em;
      line-height: 1.5;
      text-align: center;

      & span {
        color: #555;
        display: block;
        font-size: 12px;
        letter-spacing: .08em;
        line-height: 0;
        padding-top: 8px;
      }
    }

    & .login__title-image {
      position: relative;
      pointer-events: none;

      & .hat {
        transform: rotate(12deg);
        position: absolute;
        top: -12px;
        left: 0;
        right: -16px;
        width: 60px;
      }

      & .boy {
        width: 120px;
      }
    }
  }

  & .form__wrapper {
    border: 1px solid rgba(102, 102, 102, .6);
    border-radius: 12px;
    max-width: 520px;
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
    color: var(--color-secondary);
    cursor: pointer;
    display: inline-block;
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