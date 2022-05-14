<template>
  <div class="page-container -mypage">
    <PageBackButton />

    <section class="user__profile">
      <v-row>
        <v-col cols="12">
          <div
            class="mx-auto mb-3 user__icon"
            :class="{ '-edit': isEditProfileMode }"
          >
            <div
              v-if="user.image"
              class="user__icon-image"
            >
              <figure>
                <img :src="profile.image ? profile.image : user.image" alt="">
              </figure>
            </div>
            <div
              v-else
              class="user__icon-image -no-setting"
            >
              <span class="mdi mdi-account-outline"></span>
            </div>
            <label
              for="input_file"
              class="inputButton"
            >
              画像を変更
              <input
                id="input_file"
                style="display: none;"
                type="file"
                accept="img/*"
                @change="inputFile"
              >
            </label>
          </div>
        </v-col>
      </v-row>

      <v-row v-if="!isEditProfileMode">
        <v-col
          cols="12"
          class="d-flex flex-column align-center justify-center user__name"
        >
          <p class="text-center">
            {{ user.name }}
          </p>
        </v-col>
        <v-col
          cols="12"
          class="mb-5"
        >
          <p class="text-center user__releases">
            公開クリップ数：{{ user.releases }}件
          </p>
        </v-col>
        <v-col
          cols="12"
          class="d-flex flex-column align-center justify-center user__introduction"
        >
          <p
            v-if="user.introduction"
            class="text-center"
          >
            {{ user.introduction }}
          </p>
        </v-col>
        <v-col
          cols="12"
          class="text-center mt-6"
        >
          <v-btn
            color="accent"
            depressed
            rounded
            height="52"
            width="200"
            :loading="isLoading"
            :disabled="isLoading"
            @click="switchEditMode()"
          >
            プロフィールを編集
          </v-btn>
        </v-col>
      </v-row>

      <v-row v-else>
        <v-col
          cols="12"
          class="d-flex flex-column align-center justify-center user__name"
        >
          <v-form
            class="form -mypage"
            @submit.prevent="updateUser()"
          >
            <v-text-field
              v-model="profile.name"
              placeholder="ユーザー名"
              color="secondary"
              hide-details
              filled
              rounded
              class="mb-8"
            ></v-text-field>
            <v-textarea
              v-model="profile.introduction"
              placeholder="自己紹介文"
              color="secondary"
              hide-details
              filled
              rounded
            ></v-textarea>
          </v-form>
        </v-col>
        <v-col
          cols="12"
          class="d-flex justify-center text-center my-3 button-group"
        >
          <v-btn
            color="accent"
            depressed
            rounded
            class="button"
            :loading="isLoading"
            :disabled="isLoading"
            @click="updateUser()"
          >
            保存
          </v-btn>
          <v-btn
            color="#e8e8e8"
            depressed
            rounded
            class="button -color-gray"
            @click="switchEditMode()"
          >
            キャンセル
          </v-btn>
        </v-col>
        <v-col
          cols="12"
          class="text-center"
        >
          <v-btn
            color="error"
            depressed
            rounded
            small
            text
            height="40"
            width="160"
            @click="openDeleteAccountDialog()"
          >
            アカウントを削除
          </v-btn>
        </v-col>
      </v-row>
    </section>

    <DeleteAccount ref="deleteAccountDialogRef" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from '@vue/composition-api'
import { mapGetters } from 'vuex'
import { auth, dbUsersRef } from '@/plugins/firebase'

export default defineComponent({
  computed: {
    ...mapGetters(['user'])
  },

  setup () {
    const deleteAccountDialogRef = ref<any>(null)

    /** Reactive State **/
    const reactiveState = reactive({
      isLoading: false,
      isEditProfileMode: false,
      profile: {
        name: '',
        image: '',
        introduction: ''
      }
    })

    /** Methods **/
    const methods = {
      /* プロフィール編集モードの切り替え */
      switchEditMode () {
        reactiveState.isEditProfileMode = !reactiveState.isEditProfileMode

        if (reactiveState.isEditProfileMode) {
          reactiveState.profile.name = (this as any).user.name
          reactiveState.profile.introduction = (this as any).user.introduction
        } else {
          reactiveState.profile.image = ''
        }
      },

      /* アイコン画像選択時の処理 */
      inputFile (e: any) {
        const file = e.target.files[0]
        if (file) {
          const reader = new FileReader()
          // @ts-ignore
          reader.readAsDataURL(file)
          reader.onload = () => {
            reactiveState.profile.image = reader.result + ''
          }
        }
      },

      /* ユーザー情報を更新 */
      updateUser () {
        if (reactiveState.isEditProfileMode) {
          reactiveState.isLoading = true

          const user = auth.currentUser
          if (user) {
            const uid = user.uid

            dbUsersRef
            .doc(uid)
            .set({
              name: reactiveState.profile.name,
              image: reactiveState.profile.image ? reactiveState.profile.image : (this as any).user.image,
              introduction: reactiveState.profile.introduction,
              updated_time: new Date()
            }, { merge: true })
            .then(() => {
              (this as any).$store.dispatch('fetchUserData')

              console.log('Successfully: Updated user data.')

              setTimeout(() => {
                reactiveState.isLoading = false
                reactiveState.isEditProfileMode = false
                methods.clearForm()
              }, 1000)
            })
            .catch((error) => {
              console.error(error)
            })
          }
        } else {
          return
        }
      },

      /* フォームクリア */
      clearForm () {
        reactiveState.profile.name = ''
        reactiveState.profile.image = ''
        reactiveState.profile.introduction = ''
      },

      /* アカウント削除 */
      openDeleteAccountDialog () {
        if (deleteAccountDialogRef.value) {
          deleteAccountDialogRef.value.isOpenDialog = true
        }
      },

      getUerData () {
        (this as any).$store.dispatch('getUerData')
      }
    }

    return {
      ...toRefs(reactiveState),
      ...methods,
      deleteAccountDialogRef
    }
  }
})
</script>

<style lang="postcss">
.user__profile {
  margin: 40px auto 0;
  max-width: 440px;
  width: 50%;

  @media (--sp) {
    margin-top: 20px;
    max-width: 100%;
    width: 100%;
  }

  & .user__icon {
    position: relative;
    height: 140px;
    width: 140px;

    @media (--sp) {
      height: 120px;
      width: 120px;
    }

    & .inputButton {
      background-color: rgba(117, 117, 117, .4);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
      letter-spacing: .08em;
      transition: all .3s;
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      visibility: hidden;
    }

    &.-edit {
      & .user__icon-image {
        cursor: pointer;
      }

      &:hover {
        & .inputButton {
          opacity: 1;
          visibility: visible;
        }
      }
    }

    & .user__icon-image {
      border-radius: 50%;
      height: 100%;
      width: 100%;

      & figure {
        height: 100%;
        width: 100%;

        & img {
          border-radius: 50%;
          object-fit: cover;
          height: 100%;
          width: 100%;
        }
      }

      &.-no-setting {
        background-color: var(--color-secondary);

        & .mdi {
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 72px !important;
          height: 100%;
          width: 100%;

          @media (--sp) {
            font-size: 64px !important;
          }
        }
      }
    }
  }

  & .form {
    width: 100%;
  }

  & .user__name {
    color: var(--color-text-light);
    font-size: 28px;
    letter-spacing: .08em;
    line-height: 2;
    line-height: 1;

    @media (--sp) {
      font-size: 26px;
    }

    & .v-input {
      width: 100%;

      & input {
        letter-spacing: .04em;
      }
    }
  }

  & .user__releases {
    color: var(--color-text-light);
    font-size: 15px;
    letter-spacing: .04em;

    @media (--sp) {
      font-size: 14px;
    }
  }

  & .user__introduction {
    color: var(--color-text-light);
    letter-spacing: .04em;
    line-height: 2;
    margin-top: -32px;
    white-space: pre-line;

    @media (--sp) {
      font-size: 15px;
    }

    & .v-input {
      width: 100%;

      & textarea {
        letter-spacing: .04em;
        line-height: 1.75;
        padding: 8px 8px 8px 0 !important;
      }
    }
  }
}
</style>