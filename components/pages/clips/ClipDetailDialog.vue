<template>
  <v-dialog
    v-model="isOpenDetailDialog"
    width="800"
  >
    <div class="clipDetailDialog__inner">
      <v-menu
        rounded="lg"
        bottom
      >
        <template v-slot:activator="{ attrs, on }">
          <v-btn
            icon
            class="d-flex ml-auto"
            v-bind="attrs"
            v-on="on"
            height="40"
            width="40"
          >
            <span class="mdi mdi-dots-horizontal"></span>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="menu in editMenus"
            :key="menu.id"
            link
            @click="onClickMenu(menu)"
          >
            <v-list-item-title v-text="menu.title"></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-row class="clip__overview">
        <v-col
          cols="12"
          class="pa-0 mt-2"
        >
          <figure class="clip__image">
            <img :src="clip.image_url" alt="">
          </figure>
        </v-col>
        <v-col
          v-if="clip.title"
          cols="12"
        >
          <p class="mb-0 clip__title">
            {{ clip.title }}
          </p>
        </v-col>
      </v-row>

      <v-row
        v-if="isClipEditMode"
        class="mt-0"
      >
        <v-col cols="12" class="d-flex justify-center mt-2">
          <v-checkbox
            v-if="clip.private_setting"
            v-model="isPublic"
            label="クリップを公開する"
            hide-details
            color="accent"
            class="mt-0 pt-0"
          ></v-checkbox>
          <v-checkbox
            v-else
            v-model="isPrivate"
            label="クリップを非公開にする"
            hide-details
            color="accent"
            class="mt-0 pt-0"
          ></v-checkbox>
        </v-col>
        <v-col
          cols="12"
          class="d-flex justify-center"
        >
          <v-btn
            color="accent"
            depressed
            class="rounded-lg mr-3"
            height="44"
            width="120"
            :loading="isLoading"
            :disabled="isLoading"
            @click="saveEdit(clip, isPublic, isPrivate)"
          >
            保存
          </v-btn>
          <v-btn
            color="#e8e8e8"
            depressed
            class="rounded-lg ml-3 color-gray__button"
            height="44"
            width="120"
            @click="switchEditMode()"
          >
            キャンセル
          </v-btn>
        </v-col>
        <v-col
          cols="12"
          class="d-flex justify-center pa-1"
        >
          <v-btn
            color="error"
            depressed
            small
            text
            class="rounded-lg"
            height="40"
            width="140"
            @click="deleteClip()"
          >
            クリップを削除
          </v-btn>
        </v-col>
      </v-row>
      <v-row
        v-else
        class="mt-2"
      >
        <v-col
          cols="12"
          class="d-flex justify-center"
        >
          <v-btn
            color="#e8e8e8"
            depressed
            class="rounded-lg color-gray__button"
            height="44"
            width="120"
            @click="onClose()"
          >
            閉じる
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <DeleteClip
      ref="deleteClipDialogRef"
      :clip="clip"
      @close='onClose(), switchEditMode()'
    />
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from '@vue/composition-api'
import { format } from 'date-fns'
import { dbPicturesRef } from '@/plugins/firebase'

export default defineComponent({
  setup (_, { emit }) {
    const deleteClipDialogRef = ref<any>(null)

    /** Reactive State **/
    const reactiveState = reactive({
      isOpenDetailDialog: false,
      clip: {
        id: '',
        created_time: '',
        image_url: '',
        title: '',
        private_setting: false
      },
      editMenus: [
        {
          id: 'edit',
          title: 'クリップを編集'
        }
      ],
      isClipEditMode: false,
      isLoading: false,
      isPublic: false,
      isPrivate: false
    })

    /** Methods **/
    const methods = {
      /* クリップ詳細ダイアログを表示 */
      openDetailDialog (clip: any) {
        reactiveState.isOpenDetailDialog = true

        reactiveState.clip.id = clip.id
        reactiveState.clip.created_time = format(clip.data.created_time, 'yyyy.MM.dd HH:mm')
        reactiveState.clip.image_url = clip.data.image_url
        reactiveState.clip.title = clip.data.title
        reactiveState.clip.private_setting = clip.data.private_setting
      },

      onClickMenu (menu: any) {
        if (menu.id === 'edit') {
          reactiveState.isClipEditMode = true
        }
      },

      /* クリップ詳細ダイアログを閉じる */
      onClose () {
        reactiveState.isOpenDetailDialog = false
      },

      /* クリップ編集モードの切り替え */
      switchEditMode () {
        reactiveState.isClipEditMode = !reactiveState.isClipEditMode
        reactiveState.isPublic = false
        reactiveState.isPrivate = false
      },

      /* クリップ削除 */
      deleteClip () {
        if (deleteClipDialogRef.value) {
          deleteClipDialogRef.value.isOpenDeleteDialog = true
        }
      },

      /* 編集内容の保存 */
      saveEdit (clip: any, isPublic: boolean, isPrivate: boolean) {
        reactiveState.isLoading = true

        setTimeout(() => {
          if (clip.private_setting && isPublic) {
            dbPicturesRef
            .doc(clip.id)
            .set({
              private_setting: false
            }, { merge: true })
            .then(() => {
              console.log('Successfully: The Clip is published!')

              // Storeのユーザー情報を更新
              emit('update')
            })
            .catch((error: any) => {
              console.log(error)
            })
          }

          if (!clip.private_setting && isPrivate) {
            dbPicturesRef
            .doc(clip.id)
            .set({
              private_setting: true
            }, { merge: true })
            .then(() => {
              console.log('Successfully: The Clip is Closed.')

              // Storeのユーザー情報を更新
              emit('update')
            })
            .catch((error: any) => {
              console.log(error)
            })
          }

          reactiveState.isLoading = false
          methods.switchEditMode()
          methods.onClose()
          emit('save')
        }, 1000)
      }
    }

    return {
      ...toRefs(reactiveState),
      ...methods,
      deleteClipDialogRef
    }
  }
})
</script>

<style lang="postcss" scoped>
.clipDetailDialog__inner {
  background-color: #fff;
  padding: 40px 80px 48px;

  @media (--sp) {
    padding: 20px 20px 32px;
    width: 100%;
  }

  & .mdi {
      font-size: 32px !important;

      @media (--sp) {
        font-size: 28px !important;
      }
    }

  & .clip__overview {
    margin: auto;
    width: 100%;
  }

  & .clip__title {
    color: var(--color-primary);
    font-size: 14px;
    font-weight: bold;
    letter-spacing: .08em;
    text-align: center;

    @media (--sp) {
      font-size: 12px;
    }
  }
}
</style>