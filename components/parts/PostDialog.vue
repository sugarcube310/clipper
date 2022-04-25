<template>
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
                @dragenter.prevent="dragEnter"
                @dragleave.prevent="dragLeave"
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
                  <figure class="mt-4">
                    <img :src="form.image.url" alt="">
                  </figure>
                </div>
              </v-col>
              <v-col cols="12" class="d-flex justify-center mt-2 pb-1">
                <v-checkbox
                  v-model="form.public_setting"
                  label="公開する"
                  color="accent"
                  class="mt-0 pt-0"
                ></v-checkbox>
              </v-col>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              v-if="!form.image.data"
              cols="12"
              class="form__cancel text-center mt-5"
            >
              <v-btn
                color="gray"
                height="44"
                width="160"
                @click="onClose()"
              >
                キャンセル
              </v-btn>
            </v-col>
            <v-col
              v-else
              cols="12"
              class="form__submit text-center mt-5"
            >
              <v-btn
                color="accent"
                height="44"
                width="160"
                type="submit"
                :loading="$store.getters.loading"
                :disabled="$store.getters.loading"
                @click="post()"
              >
                投稿
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </div>
    </div>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { mapGetters } from 'vuex'

export default defineComponent({
  computed: {
    ...mapGetters(['user'])
  },
  setup () {
    /** Reactive State **/
    const reactiveState = reactive({
      isOpenDialog: false,
      form: {
        image: {
          data: '',
          url: ''
        },
        files: [],
        public_setting: false,
      },
      isEnter: false,
    })

    /** Methods **/
    const methods = {
      onClose () {
        reactiveState.isOpenDialog = false
      },

      dragEnter () {
        reactiveState.isEnter = true
      },

      dragLeave () {
        reactiveState.isEnter = false
      },

      dragOver () {
        console.log('DragOver')
      },

      dropFile () {
        //@ts-ignore
        const files = event.dataTransfer.files
        if (files.length >= 2) {
          console.log('ファイルは1つだけにしてね')
          return
        } else {
          reactiveState.form.image.data = files[0]
          console.log(files[0])

          if (reactiveState.form.image.data) {
            const reader = new FileReader()
            // @ts-ignore
            reader.readAsDataURL(reactiveState.form.image.data)
            reader.onload = () => {
              reactiveState.form.image.url = reader.result + ''
              console.log('reactiveState.form.image.url' + reactiveState.form.image.url)
            }
          }
        }
        reactiveState.isEnter = false
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

      post () {
        if (reactiveState.form.image.url !== '') {
          (this as any).$store.dispatch('postImage', { public_setting: reactiveState.form.public_setting, image_url: reactiveState.form.image.url })
          return
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
  }
}
</style>