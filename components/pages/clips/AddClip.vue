<template>
  <div class="addClip">
    <v-btn
      class="ma-4 addClip-button"
      outlined
      fixed
      bottom
      right
      fab
      color="primary"
      @click="openDialog()"
    >
      <v-icon large color="primary">
        mdi-plus
      </v-icon>
    </v-btn>

    <v-dialog
      v-model="isOpenDialog"
      persistent
      width="720"
    >
      <div class="addClipDialog__inner">
        <div class="addClipDialog__head">
          <h2 class="text-center">
            クリップを追加
          </h2>
        </div>
        <div class="form__wrapper">
          <v-form class="form -addClip">
            <v-row>
              <v-col
                v-if="!form.image.data"
                cols="12"
                class="py-0"
              >
                <div
                  class="fileDropArea"
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
                    class="inputButton"
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
                  class="pa-0"
                >
                  <div class="filePrevArea">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          v-bind="attrs"
                          v-on="on"
                          fab
                          outlined
                          color="secondary"
                          class="d-flex ml-auto fileDelete-button"
                          @click="clearForm()"
                        >
                          <span class="mdi mdi-delete"></span>
                        </v-btn>
                      </template>
                      <span>ファイルを削除</span>
                    </v-tooltip>
                    <figure>
                      <img v-lazy="form.image.url" alt="">
                    </figure>
                  </div>
                </v-col>
                <v-col
                  cols="12"
                  class="px-0 py-1"
                >
                  <v-text-field
                    v-model="form.title"
                    placeholder="タイトル(任意)"
                    color="secondary"
                    hide-details
                    dense
                    filled
                    rounded
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  class="px-0 pb-0"
                >
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
            <v-row v-if="formErrorMessage">
              <v-col cols="12">
                <p class="form__error-text text-center">
                  {{ formErrorMessage }}
                </p>
              </v-col>
            </v-row>
            <v-row class="pt-5">
              <v-col
                cols="12"
                class="button-group"
              >
                <v-btn
                  color="accent"
                  depressed
                  rounded
                  class="button"
                  :loading="isLoading"
                  :disabled="isLoading"
                  @click="addClip()"
                >
                  追加
                </v-btn>
                <v-btn
                  color="#e8e8e8"
                  depressed
                  rounded
                  class="button -color-gray"
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
import { mapGetters } from 'vuex'
import { auth, storage, dbPicturesRef } from '@/plugins/firebase'

export default defineComponent({
  computed: {
    ...mapGetters(['user'])
  },

  setup (_, { emit }) {
    /** Reactive State **/
    const reactiveState = reactive({
      isOpenDialog: false,
      form: {
        image: {
          data: '',
          name: '',
          url: ''
        },
        title: '',
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
        methods.clearForm()
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
            reactiveState.form.image.name = files[0].name

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
        reactiveState.formErrorMessage = ''

        reactiveState.form.image.data = e.target.files[0]
        reactiveState.form.image.name = e.target.files[0].name

        if (reactiveState.form.image.data) {
          const reader = new FileReader()
          // @ts-ignore
          reader.readAsDataURL(reactiveState.form.image.data)
          reader.onload = () => {
            reactiveState.form.image.url = reader.result + ''
          }
        }
      },

      /* フォームクリア */
      clearForm () {
        if (reactiveState.form.image.data) {
          reactiveState.form.image.data = ''
          reactiveState.form.title = ''
          reactiveState.form.private_setting = false
        }
      },

      /* クリップ追加 */
      addClip () {
        if (reactiveState.form.image.url !== '') {
          const user = auth.currentUser
          if (user) {
            reactiveState.isLoading = true

            const uid = user.uid

            const storageRef = storage.ref()
            const fileUrl = `${ uid }/${ reactiveState.form.image.name }`
            const uploadFileRef = storageRef.child(fileUrl)

            setTimeout(() => {
              // Storageにファイルを保存
              uploadFileRef
              .putString(reactiveState.form.image.url, 'data_url')
              .then((item) => {
                const data = item.metadata

                // 保存されたらファイルのURLを取得
                uploadFileRef
                .getDownloadURL()
                .then((url) => {
                  // Storageに保存したファイルのURLを取得できたら、Firestoreにファイルのデータを保存
                  dbPicturesRef
                  .doc()
                  .set({
                    created_time: new Date(),
                    file_name: data.name,
                    file_fullPath: data.fullPath,
                    file_url: url,
                    title: reactiveState.form.title ? reactiveState.form.title : '',
                    private_setting: reactiveState.form.private_setting,
                    user_id: uid
                  })
                  .then(() => {
                    methods.onClose()

                    emit('add')

                    // ユーザー情報(公開クリップ件数)を更新
                    emit('update')

                    reactiveState.isLoading = false

                    console.log('Successfully: Added the Clip!')
                  })
                  .catch((error) => {
                    console.error('ERROR: Unable to add the Clip.', error)
                  })
                })
                .catch((error) => {
                  console.error('ERROR: Unable to get file URL.', error)
                })
              })
              .catch((error) => {
                console.error('ERROR: Unable to save file to storage.', error)
              })
            }, 1000)
          }
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
.addClip-button {
  background-color: #fff;
  bottom: 92px;

  @media (--sp) {
    bottom: 88px;
  }

  &::before {
    background-color: #fff !important;
  }
}

.addClipDialog__inner {
  background-color: #fff;
  padding: 40px 80px 48px;

  @media (--sp) {
    padding: 24px 20px 40px;
  }

  & .addClipDialog__head {
    margin-bottom: 40px;

    @media (--sp) {
      margin-bottom: 20px;
    }

    & h2 {
      color: var(--color-text-light);
      font-size: 22px;
      letter-spacing: .05em;

      @media (--sp) {
        font-size: 18px;
      }
    }
  }

  & .form {
    & .fileDropArea {
      background-color: rgba(102, 102, 102, .02);
      border: 3px solid var(--color-primary);
      border-radius: 20px;
      box-sizing: content-box;
      color: var(--color-primary);
      cursor: pointer;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      font-size: 18px;
      font-weight: bold;
      margin: auto;
      letter-spacing: .02em;
      line-height: 2;
      text-align: center;
      margin: auto;
      height: 320px;

      @media (--sp) {
        border-radius: 12px;
        font-size: 14px;
        margin-top: 8px;
        height: 180px;
      }

      &.enter {
        border: 4px solid #a3a3a3;
        background-image: linear-gradient(-45deg, rgba(102, 102, 102, .05) 25%, rgba(102, 102, 102, .2) 25%, rgba(102, 102, 102, .2) 50%, rgba(102, 102, 102, .05) 50%, rgba(102, 102, 102, .05) 75%, rgba(102, 102, 102, .2) 75%, rgba(102, 102, 102, .2));
        background-size: 20px 20px;
        background-repeat: repeat;
      }

      & span {
        font-size: 16px;

        @media (--sp) {
          font-size: 12px;
        }
      }

      & .inputButton {
        background-color: var(--color-primary);
        border-radius: 8px;
        color: #fff;
        cursor: pointer;
        font-size: 16px;
        font-weight: normal;
        letter-spacing: .04em;
        line-height: 1.85;
        margin-top: 8px;
        padding: 4px 20px;
        transition: all .3s;
        z-index: 1;

        @media (--sp) {
          border-radius: 6px;
          font-size: 14px;
          margin-top: 4px;
          padding: 4px 16px;
        }

        @media (max-width: 359px) {
          font-size: 13px;
        }

        &:hover {
          @media (--not-sp) {
            opacity: .9;
          }
        }
      }
    }

    & .filePrevArea {
      margin-bottom: 12px;

      @media (--sp) {
        margin-bottom: 8px;
      }

      & .fileDelete-button {
        height: 40px;
        width: 40px;

        @media (--sp) {
          height: 36px;
          width: 36px;
        }

        & .mdi {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px !important;
          height: 100%;
          width: 100%;

          @media (--sp) {
            font-size: 20px !important;
          }
        }
      }

      & figure {
        margin-top: 12px;

        @media (--sp) {
          margin-top: 8px;
        }

        & img {
          border-radius: 16px;
          pointer-events: none;

          @media (--sp) {
            border-radius: 12px;
          }
        }
      }
    }

    & .form__error-text {
      color: #c00;
      font-size: 12px;
      letter-spacing: .02em;
      line-height: 1.75;

      @media (--sp) {
        font-size: 10px;
      }
    }

    & .form__submit {
      margin-top: 12px;

      @media (--sp) {
        margin-top: 4px;
      }
    }
  }
}
</style>