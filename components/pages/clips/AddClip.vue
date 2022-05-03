<template>
  <div class="addClip">
    <v-btn
      class="ma-4 addClip__button"
      fixed
      bottom
      right
      fab
      color="white"
      @click="openDialog()"
    >
      <v-icon large color="secondary">
        mdi-plus
      </v-icon>
    </v-btn>

    <v-dialog
      v-model="isOpenDialog"
      persistent
      width="720"
    >
      <div class="addClipDialog__inner py-12 px-10">
        <div class="addClipDialog__head mb-10">
          <h2 class="text-center">
            クリップを追加する
          </h2>
        </div>
        <div class="form__wrapper">
          <v-form class="form -addClip">
            <v-row class="mb-1">
              <v-col
                v-if="!form.image.data"
                cols="12"
                class="py-1"
              >
                <div
                  class="fileDropArea ma-auto"
                  @dragenter.prevent="switchEnter"
                  @dragleave.prevent="switchEnter"
                  @dragover.prevent
                  @drop.prevent="dropFile"
                  :class="{ enter: isEnter }"
                >
                  ここにファイルをドロップ
                  <span>または</span>
                  <label
                    for="input_file"
                    class="inputButton mt-1 px-5 py-1"
                  >
                    ファイルを選択
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
              <v-col v-else>
                <v-col
                  cols="12"
                  class="py-1"
                >
                  <div class="filePrevArea">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          v-bind="attrs"
                          v-on="on"
                          fab
                          outlined
                          color="secondary lighten-2"
                          class="d-flex ml-auto"
                          height="40"
                          width="40"
                          @click="clearFile()"
                        >
                          <v-icon color="secondary lighten-1">mdi-delete</v-icon>
                        </v-btn>
                      </template>
                      <span>ファイルを削除</span>
                    </v-tooltip>
                    <figure class="mt-3">
                      <img :src="form.image.url" alt="">
                    </figure>
                  </div>
                </v-col>
                <v-col cols="12" class="d-flex justify-center mt-2 pb-1">
                  <v-checkbox
                    v-model="form.private_setting"
                    label="非公開設定"
                    hint="非公開設定にすると、クリップ一覧には表示されなくなります。"
                    persistent-hint
                    color="accent"
                    class="mt-0 pt-0"
                  ></v-checkbox>
                </v-col>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="py-0">
                <p
                  v-if="formErrorMessage"
                  class="form__error-text text-center"
                >
                  {{ formErrorMessage }}
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                class="form__submit text-center mt-3"
              >
                <v-btn
                  color="accent"
                  depressed
                  class="rounded-lg mr-3"
                  height="44"
                  width="160"
                  :loading="isLoading"
                  :disabled="isLoading"
                  @click="addClip()"
                >
                  追加
                </v-btn>
                <v-btn
                  color="#e8e8e8"
                  depressed
                  class="rounded-lg ml-3 color-gray__button"
                  height="44"
                  width="160"
                  @click="onClose()"
                >
                  キャンセル
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { auth, dbUsersRef, dbPicturesRef } from '@/plugins/firebase'

export default defineComponent({
  setup (_, { emit }) {
    /** Reactive State **/
    const reactiveState = reactive({
      isOpenDialog: false,
      form: {
        image: {
          data: '',
          url: ''
        },
        private_setting: false,
      },
      isEnter: false,
      isLoading: false,
      formErrorMessage: ''
    })

    /** Methods **/
    const methods = {
      /* クリップ追加ダイアログを表示 */
      openDialog () {
        reactiveState.isOpenDialog = true
      },

      /* クリップ追加ダイアログを閉じる */
      onClose () {
        reactiveState.isOpenDialog = false
        methods.clearFile()
      },

      /* ファイルドロップエリアに入ったときの処理 */
      switchEnter () {
        reactiveState.isEnter = !reactiveState.isEnter
      },

      /* ファイルドロップエリアからファイルを選択したときの処理 */
      dropFile () {
        reactiveState.formErrorMessage = ''

        //@ts-ignore
        const files = event.dataTransfer.files
        const fileName = files[0].name

        if (files.length >= 2) {
          reactiveState.formErrorMessage = 'ファイルは1つのみ選択してください。'
          return
        } else {
          if (
            fileName.toUpperCase().match(/\.(jpg)$/i) ||
            fileName.toUpperCase().match(/\.(jpeg)$/i) ||
            fileName.toUpperCase().match(/\.(png)$/i) ||
            fileName.toUpperCase().match(/\.(gif)$/i)
          ) {
            reactiveState.form.image.data = files[0]

            if (reactiveState.form.image.data) {
              const reader = new FileReader()
              // @ts-ignore
              reader.readAsDataURL(reactiveState.form.image.data)
              reader.onload = () => {
                reactiveState.form.image.url = reader.result + ''
              }
            }

            reactiveState.isEnter = false
          } else {
            reactiveState.formErrorMessage = '画像ファイルを選択してください。'
            return
          }
        }
      },

      /* インプットボタンからファイルを選択したときの処理 */
      inputFile (e: any) {
        reactiveState.form.image.data = e.target.files[0]
        if (reactiveState.form.image.data) {
          const reader = new FileReader()
          // @ts-ignore
          reader.readAsDataURL(reactiveState.form.image.data)
          reader.onload = () => {
            reactiveState.form.image.url = reader.result + ''
          }
        }
      },

      /* 選択したファイルの削除 */
      clearFile () {
        if (reactiveState.form.image.data) {
          reactiveState.form.image.data = ''
        }
      },

      /* クリップ追加 */
      addClip () {
        if (reactiveState.form.image.url !== '') {
          return auth.onAuthStateChanged((user) => {
            if (user) {
              reactiveState.isLoading = true

              setTimeout(() => {
                const uid = user.uid
                const image_url = reactiveState.form.image.url
                const private_setting = reactiveState.form.private_setting

                dbPicturesRef
                .doc()
                .set({
                  created_time: new Date(),
                  image_url: image_url,
                  private_setting: private_setting,
                  user_id: uid
                })
                .then(() => {
                  console.log('Successfully: Added the Clip!')

                  reactiveState.isLoading = false
                  methods.onClose()

                  emit('add')

                  // 公開クリップ件数を更新
                  methods.updateUserData()
                })
                .catch((error) => {
                  console.error(error)
                })
              }, 1000)
            }
          })
        } else {
          return
        }
      },

      /* ユーザー情報を更新(公開クリップ件数) */
      updateUserData () {
        auth.onAuthStateChanged((user) => {
          if (user) {
            const uid = user.uid

            dbPicturesRef
            .where('user_id', '==', uid)
            .where('private_setting', '==', false)
            .onSnapshot((querySnapshot) => {
              const docs = [] as any[]

              querySnapshot.forEach((doc) => {
                docs.push(doc)
              })

              dbUsersRef
              .doc(uid)
              .set({
                releases: docs.length,
              },  { merge: true })
              .then(() => {
                console.log('Successfully: Updated user data.')
              })
              .catch((error) => {
                console.error(error)
              })
            })
          } else {
            return
          }
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

<style lang="postcss" scoped>
.addClip__button::before {
  background-color: #fff !important;
}

.addClipDialog__inner {
  background-color: #fff;

  & h2 {
    color: #555;
    font-size: 22px;
    font-weight: 500;
    letter-spacing: .02em;
    line-height: 1.5;
  }

  & .form {
    & .fileDropArea {
      background-color: rgba(102, 102, 102, .02);
      border: 4px solid #848484;
      border-radius: 16px;
      box-sizing: content-box;
      color: rgba(102, 102, 102, .8);
      cursor: pointer;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      font-size: 18px;
      font-weight: bold;
      letter-spacing: .02em;
      line-height: 2;
      text-align: center;
      margin: auto;
      height: 320px;
      width: 85%;

      &.enter {
        border: 4px solid #a3a3a3;
        background-image: linear-gradient(-45deg, rgba(102, 102, 102, .05) 25%, rgba(102, 102, 102, .2) 25%, rgba(102, 102, 102, .2) 50%, rgba(102, 102, 102, .05) 50%, rgba(102, 102, 102, .05) 75%, rgba(102, 102, 102, .2) 75%, rgba(102, 102, 102, .2));
        background-size: 20px 20px;
        background-repeat: repeat;
      }

      & span {
        font-size: 16px;
      }

      & .inputButton {
        background-color: #848484;
        border-radius: 8px;
        color: #fff;
        cursor: pointer;
        font-size: 16px;
        font-weight: normal;
        letter-spacing: .04em;
        line-height: 1.85;
        transition: all .3s;
        z-index: 1;

        &:hover {
          @media (--not-sp) {
            opacity: .9;
          }
        }
      }
    }

    & .filePrevArea {
      margin: auto;
      width: 80%;

      & img {
        border-radius: 16px;
        pointer-events: none;
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
  }
}
</style>