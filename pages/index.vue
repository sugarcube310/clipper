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
          <div class="form__inner">
            <v-form
              v-model="valid"
              @submit.prevent
            >
              <v-row class="mb-8">
                <v-col cols="12">
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="メールアドレス"
                    required
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="py-0">
                  <v-text-field
                    v-model="password"
                    :rules="passwordRules"
                    label="パスワード"
                    required
                    outlined
                  ></v-text-field>
                </v-col>

                <v-col cols="12" class="form__submit text-center">
                  <v-btn
                    color="accent"
                    height="44"
                    width="160"
                    type="submit"
                    @click="login()"
                  >
                    ログイン
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>

            <v-divider />

            <nuxt-link to="/register" class="register__text d-block mt-8 text-center">
              アカウントをお持ちでない方
            </nuxt-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, SetupContext } from '@vue/composition-api'
import { useRouter } from '../plugins/use-router'
import { auth } from '../plugins/firebase'

export default defineComponent({
  setup (_) {
    const router = useRouter()

    /** Reactive State **/
    const reactiveState = reactive({
      valid: false,
      email: '',
      password: '',
      emailRules: [
        (v: string) => !!v || 'メールアドレスは必須項目です',
        (v: string) => /.+@.+/.test(v) || 'メールアドレスを正しく入力してください',
      ],
      passwordRules: [
        (v: string) => !!v || 'パスワードは必須項目です',
        (v: string) => v.length >= 8 || 'パスワードは8文字以上で設定してください',
      ]
    })

    /** Methods **/
    const methods = {
      login() {
        auth.signInWithEmailAndPassword(reactiveState.email, reactiveState.password)
        .then(() => {
          router.push('/list')
        })
        .catch((error: any) => {
          console.log(`Login error: ${ error.message }`)
        })
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

    & .form__inner {
      padding: 40px;
    }
  }
}
</style>