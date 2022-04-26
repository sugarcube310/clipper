<template>
  <div class="createPost">
    <v-btn
      class="ma-4"
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
      width="760"
    >
      <div class="postDialog__inner py-12 px-10">
        <div class="postDialog__head mb-10">
          <h2 class="text-center">
            投稿の作成
          </h2>
        </div>
        <div class="form__wrapper">
          <v-form class="form -post">
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
                    hint="非公開設定にすると、一覧ページには表示されません。"
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
                class="form__submit text-center mt-5"
              >
                <v-btn
                  color="accent"
                  class="mr-3"
                  height="44"
                  width="160"
                  :loading="isLoading"
                  :disabled="isLoading"
                  @click="createPost()"
                >
                  投稿
                </v-btn>
                <v-btn
                  color="gray"
                  class="ml-3"
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
import { auth, dbPicturesRef } from '@/plugins/firebase'

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
      openDialog () {
        reactiveState.isOpenDialog = true
      },

      onClose () {
        reactiveState.isOpenDialog = false
        methods.clearFile()
      },

      switchEnter () {
        reactiveState.isEnter = !reactiveState.isEnter
      },

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

      clearFile () {
        if (reactiveState.form.image.data) {
          reactiveState.form.image.data = ''
        }
      },

      createPost () {
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
                  console.log('Successfully created post!')
                  reactiveState.isLoading = false
                  methods.onClose()

                  emit('success')
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
.postDialog__inner {
  background-color: #fff;

  & h2 {
    font-size: 24px;
    font-weight: 500;
    letter-spacing: .04em;
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
        border-radius: 4px;
        color: #fff;
        cursor: pointer;
        font-size: 16px;
        font-weight: normal;
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