<template>
  <div class="uploadFile">
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
      width="800"
    >
      <div class="upload__dialog-inner px-10 py-10">
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
        <div class="upload__head mb-8">
          <h2 class="text-center">
            投稿の作成
          </h2>
        </div>
        <div class="upload__form-wrapper">
          <v-form @submit.prevent class="upload__form">
            <v-row class="mb-8">
              <v-col cols="12" class="py-1">
                <v-file-input
                  :rules="rules"
                  accept="image/png, image/jpeg, image/bmp"
                  placeholder="Pick an avatar"
                  prepend-icon="mdi-camera"
                  label="Avatar"
                ></v-file-input>
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
                  @click="openConfirmDialog()"
                >
                  続行
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </div>
      </div>
    </v-dialog>

    <ConfirmUploadDialog ref="confirmUploadDialogRef" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from '@vue/composition-api'

export default defineComponent({
  setup () {
    const confirmUploadDialogRef = ref<any>(null)

    /** Reactive State **/
    const reactiveState = reactive({
      isOpenDialog: false,
      form: {
        title: '',
        text: '',
        is_public: false
      },
      rules: [
        (value: any) => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
      ]
    })

    /** Methods **/
    const methods = {
      openDialog () {
        reactiveState.isOpenDialog = true
      },

      onClose () {
        reactiveState.isOpenDialog = false
      },

      openConfirmDialog () {
        if (confirmUploadDialogRef.value) {
          confirmUploadDialogRef.value.isOpenDialog = true
        }
      }
    }

    return {
      ...toRefs(reactiveState),
      ...methods,
      confirmUploadDialogRef
    }
  }
})
</script>

<style lang="postcss">
.upload__dialog-inner {
  background-color: #fff;

  & .upload__head {
    & h2 {
      font-size: 24px;
      font-weight: 500;
      letter-spacing: .025em;
      line-height: 1.5;
    }
  }
}
</style>
