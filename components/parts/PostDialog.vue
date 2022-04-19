<template>
  <v-dialog
    v-model="isOpenDialog"
    persistent
    width="800"
  >
    <div class="postDialog__inner px-10 py-10">
      <v-btn
        icon
        color="primary"
        height="40"
        width="40"
        class="d-flex ml-auto"
        @click="onClose()"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <div class="postDialog__head mb-8">
        <h2 class="text-center">
          投稿の作成
        </h2>
      </div>
      <div class="form__wrapper">
        <v-form
          class="form -post"
          @submit.prevent="submit"
        >
          <v-row class="mb-8">
            <v-col cols="12" class="py-1">
              <input
                type="file"
                accept="img/*"
                @change="changeImg"
              >
              <div>
                <p>{{ thumbnail }}</p>
                <img :src="postData.thumbnail" alt="">
              </div>
            </v-col>
            <v-col cols="12" class="py-1">
              <v-text-field
                v-model="form.title"
                label="タイトル(任意)"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="py-1">
              <v-textarea
                v-model="form.text"
                label="テキスト(任意)"
                outlined
                counter
                auto-grow
              ></v-textarea>
            </v-col>
            <v-col cols="12" class="py-1">
              <v-switch
                v-model="form.is_public"
                color="accent lighten-1"
                flat
                label="公開"
              ></v-switch>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="form__submit text-center">
              <v-btn
                color="accent"
                height="44"
                width="180"
                type="submit"
                :loading="$store.getters.loading"
                :disabled="$store.getters.loading"
              >
                続行
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

export default defineComponent({
  setup () {
    /** Reactive State **/
    const reactiveState = reactive({
      isOpenDialog: false,
      form: {
        title: '',
        text: '',
        is_public: false
      },
      thumbnail: '',
      postData: {
        thumbnail: ''
      }
    })

    /** Methods **/
    const methods = {
      onClose () {
        reactiveState.isOpenDialog = false
      },

      changeImg (e: any) {
        reactiveState.thumbnail = e.target.files[0]
        if (reactiveState.thumbnail) {
          const reader = new FileReader()
          // @ts-ignore
          reader.readAsDataURL(reactiveState.thumbnail)
          reader.onload = () => {
            reactiveState.postData.thumbnail = reader.result + ''
          }
        }
      },

      submit (thumbnail: any) {
        (this as any).$store.dispatch('submit', reactiveState.thumbnail)
      },
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
    letter-spacing: .025em;
    line-height: 1.5;
  }
}
</style>