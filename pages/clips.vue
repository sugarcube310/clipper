<template>
  <div class="page-container -clips">
    <div v-if="clips.length > 0">
      <v-row class="clip__list-head">
        <v-col cols="12">
          <p class="mb-0 pl-2 list__length-text">
            あなたのクリップ：{{ clips.length }}件
          </p>
          <v-switch
            v-model="isShowAllClips"
            color="accent"
            class="pl-2"
            inset
            hide-details
            label="非公開のクリップを表示する"
            @change="switchShowClips()"
          ></v-switch>
        </v-col>
      </v-row>

      <ul class="clip__list">
        <li
          class="list__item"
          v-for="(clip, i) in clips"
          :key="i"
          @click="showClipDetail(clip)"
        >
          <figure>
            <img :src="clip.data.image_url" alt="">
          </figure>
        </li>
      </ul>
    </div>

    <div v-else>
      <v-row class="d-flex justify-center clip__nothing">
        <v-col cols="12">
          <p class="mb-0 text-center clip__nothing-text">
            お気に入りの画像を追加しましょう！
            <span class="icon">:)</span>
          </p>
        </v-col>
        <v-col cols="12" class="d-flex justify-center mt-5">
          <v-btn
            color="accent"
            depressed
            class="rounded-lg"
            height="44"
            width="102"
            @click="openAddClipDialog()"
          >
            追加
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <AddClip
      ref="addClipDialogRef"
      @add="addClipComplete()"
      @update="updateUser()"
    />

    <transition name="fade" appear>
      <AddClipMessage v-if="isShowAddClipMessage" />
    </transition>

    <ClipDetailDialog
      ref="clipDetailDialogRef"
      @save="switchShowClips()"
      @update="updateUser()"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onMounted } from '@vue/composition-api'
import { mapGetters } from 'vuex'
import { auth, dbUsersRef, dbPicturesRef } from '@/plugins/firebase'

export default defineComponent({
  computed: {
    ...mapGetters(['user'])
  },
  setup () {
    const addClipDialogRef = ref<any>(null)
    const clipDetailDialogRef = ref<any>(null)

    /** Reactive State **/
    const reactiveState = reactive({
      isShowAllClips: false, // true: すべてのクリップ(非公開クリップも含む)を表示
      isShowAddClipMessage: false, // true: クリップ追加完了メッセージを表示
      clips: [] as any[]
    })

    /** Methods **/
    const methods = {
      /* すべてのクリップを一覧取得 */
      getAllClips () {
        const user = auth.currentUser
        if (user) {
          const uid = user.uid

          dbPicturesRef
          .where('user_id', '==', uid)
          .onSnapshot((querySnapshot) => {
            const docs = [] as any[]

            querySnapshot.forEach((doc) => {
              const id =  doc.id
              const data = doc.data()

              docs.push({
                id: id,
                data: {
                  created_time: data.created_time.toDate(),
                  image_url: data.image_url,
                  private_setting: data.private_setting
                }
              })
            })

            reactiveState.clips = Array.from(new Set(docs))

            // 作成日時の降順でソート
            const sortResult = reactiveState.clips.sort((item, item2) => {
              if (item.data.created_time.getTime() > item2.data.created_time.getTime()) return -1
              if (item.data.created_time.getTime() < item2.data.created_time.getTime()) return 1
              return 0
            })
            reactiveState.clips = sortResult
          })
        } else {
          return
        }
      },

      /* 公開設定中のクリップのみ一覧取得 */
      getPublicClips () {
        const user = auth.currentUser
        if (user) {
          const uid = user.uid

          dbPicturesRef
          .where('user_id', '==', uid)
          .where('private_setting', '==', false)
          .onSnapshot((querySnapshot) => {
            const docs = [] as any[]

            querySnapshot.forEach((doc) => {
              const id =  doc.id
              const data = doc.data()

              docs.push({
                id: id,
                data: {
                  created_time: data.created_time.toDate(),
                  image_url: data.image_url,
                  private_setting: data.private_setting
                }
              })
            })

            reactiveState.clips = Array.from(new Set(docs))

            // 作成日時の降順でソート
            const sortResult = reactiveState.clips.sort((item, item2) => {
              if (item.data.created_time.getTime() > item2.data.created_time.getTime()) return -1
              if (item.data.created_time.getTime() < item2.data.created_time.getTime()) return 1
              return 0
            })
            reactiveState.clips = sortResult
          })
        } else {
          return
        }
      },

      /* 表示するクリップの切り替え */
      switchShowClips () {
        if (reactiveState.isShowAllClips) {
          methods.getAllClips()
        } else {
          methods.getPublicClips()
        }
      },

      /* クリップ詳細ダイアログを表示 */
      showClipDetail (clip: any) {
        if (clipDetailDialogRef.value) {
          clipDetailDialogRef.value.openDetailDialog(clip)
        }
      },

      /* クリップの追加ダイアログを表示 */
      openAddClipDialog () {
        if (addClipDialogRef.value) {
          addClipDialogRef.value.isOpenDialog = true
        }
      },

      /* クリップ追加完了メッセージを表示 */
      addClipComplete () {
        methods.switchShowClips()

        reactiveState.isShowAddClipMessage = true
        setTimeout(() => {
          reactiveState.isShowAddClipMessage = false
        }, 3000)
      },

      /* ユーザー情報を更新 */
      updateUser () {
        // (this as any).$store.dispatch('fetchUserData')

        const user = auth.currentUser
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
              updated_time: new Date()
            }, { merge: true })
            .then(() => {
              (this as any).$store.dispatch('fetchUserData')
              console.log('Successfully: Updated user data.')
            })
            .catch((error) => {
              console.error(error)
            })
          })
        } else {
          return
        }
      }
    }

    onMounted(() => {
      methods.getPublicClips()
    })

    return {
      ...toRefs(reactiveState),
      ...methods,
      addClipDialogRef,
      clipDetailDialogRef
    }
  }
})
</script>

<style lang="postcss" scoped>
.page-container.-clips {
  padding: 8px 0 200px;

  @media (--sp) {
    padding-bottom: 100px;
  }

  & .clip__list-head {
      margin-bottom: 20px;

      @media (--sp) {
        margin-bottom: 12px;
      }

    & .list__length-text {
      color: var(--color-text-light);
      font-size: 18px;
      font-weight: bold;
      letter-spacing: .04em;

      @media (--sp) {
        font-size: 16px;
      }
    }
  }

  & .clip__list {
    column-count: 4;
    column-gap: 0;
    list-style-type: none;
    padding: 0;
    width: 100%;

    @media (max-width: 768px) {
      column-count: 3;
    }

    @media (--sp) {
      column-count: 2;
    }

    @media (max-width: 359px) {
      column-count: 1;
    }

    & .list__item {
      box-sizing: border-box;
      break-inside: avoid;
      cursor: pointer;
      padding: 8px 8px 12px 8px;
      page-break-inside: avoid;
      transition: all .3s;

      &:hover {
        @media (--not-sp) {
          opacity: .8;
        }
      }

      & img {
        border-radius: 16px;
        vertical-align: bottom;

        @media (--sp) {
          border-radius: 12px !important;
        }
      }
    }
  }

  & .clip__nothing {
    margin-top: 120px;

    @media (--sp) {
      margin-top: 80px;
    }

    & .clip__nothing-text {
      color: var(--color-text-light);
      font-size: 18px;
      letter-spacing: .02em;

      @media (--sp) {
        font-size: 16px;
      }

      & .icon {
        color: var(--color-text-light);
        display: block;
        font-size: 24px;
        letter-spacing: .1em;
        padding-left: 20px;
        transform: rotate(90deg);

        @media (--sp) {
          font-size: 18px;
          padding-left: 12px;
        }
      }
    }
  }
}
</style>