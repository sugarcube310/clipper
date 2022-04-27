<template>
  <div>
    <PageLoading v-if="isPageLoading" />
    <transition v-else name="fade-long" appear>
      <div class="page-container -gallery">
        <v-row
          v-if="posts.length >= 1"
          class="gallery__list"
        >
          <v-col
            cols="3"
            class="d-flex align-center justify-center list__item"
            v-for="(post, i) in posts"
            :key="i"
            @click="openDetailDialog(post)"
          >
            <figure>
              <img :src="post.data.image_url" alt="">
            </figure>
          </v-col>
        </v-row>

        <v-row
          v-else
          class="d-flex justify-center gallery__nothing"
        >
          <v-col cols="12">
            <p class="mb-0 text-center gallery__nothing-text">
              作品を投稿しましょう！
              <span class="pl-5 icon">:)</span>
            </p>
          </v-col>
          <v-col cols="12" class="d-flex justify-center mt-5">
            <v-btn
              color="accent"
              class="rounded-lg"
              height="44"
              width="102"
              @click="openCreatePostDialog()"
            >
              投稿
            </v-btn>
          </v-col>
        </v-row>

        <CreatePost
          ref="createPostDialogRef"
          @success="showMessage"
        />

        <transition name="fade" appear>
          <SuccessMessage v-if="isShowMessage" />
        </transition>

        <PostDetailDialog ref="postDetailDialogRef" />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onMounted } from '@vue/composition-api'
import { mapGetters } from 'vuex'
import { auth, dbPicturesRef } from '@/plugins/firebase'

export default defineComponent({
  computed: {
    ...mapGetters(['user'])
  },
  setup () {
    const createPostDialogRef = ref<any>(null)
    const postDetailDialogRef = ref<any>(null)

    /** Reactive State **/
    const reactiveState = reactive({
      isPageLoading: false,
      isShowMessage: false,
      posts: [] as any[],
    })

    /** Methods **/
    const methods = {
      getPosts () {
        auth.onAuthStateChanged((user) => {
          if (user) {
            const uid = user.uid

            dbPicturesRef
            .where('user_id', '==', uid)
            .onSnapshot((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const id =  doc.id
                const data = doc.data()

                reactiveState.posts.push({
                  id: id,
                  data: {
                    created_time: data.created_time.toDate(),
                    image_url: data.image_url
                  }
                })
              })

              // 予約リストを予約日時でソート
              const sortResult = reactiveState.posts.sort((item, item2) => {
                if (item.data.created_time.getTime() > item2.data.created_time.getTime()) return -1
                if (item.data.created_time.getTime() < item2.data.created_time.getTime()) return 1
                return 0
              })
              reactiveState.posts = sortResult
            })
          } else {
            return
          }
        })
      },

      showMessage () {
        reactiveState.isShowMessage = true
        setTimeout(() => {
          reactiveState.isShowMessage = false
        }, 3000)
      },

      openDetailDialog (post: any) {
        if (postDetailDialogRef.value) {
          postDetailDialogRef.value.showDetail(post)
        }
      },

      openCreatePostDialog () {
        if (createPostDialogRef.value) {
          createPostDialogRef.value.isOpenDialog = true
        }
      }
    }

    onMounted(() => {
      methods.getPosts()

      reactiveState.isPageLoading = true
      setTimeout(() => {
        reactiveState.isPageLoading = false
      }, 3000)
    })

    return {
      ...toRefs(reactiveState),
      ...methods,
      createPostDialogRef,
      postDetailDialogRef
    }
  }
})
</script>

<style lang="postcss" scoped>
.gallery__list {
  margin: auto;
  max-width: 1340px;
  width: 90%;

  & .list__item {
    cursor: pointer;
    transition: all .3s;

    &:hover {
      @media (--not-sp) {
        opacity: .8;
      }
    }

    & img {
      border-radius: 8px;
    }
  }
}

.gallery__nothing {
  margin-top: 120px;

  & .gallery__nothing-text {
    font-size: 18px;
    letter-spacing: .02em;

    & .icon {
      display: block;
      font-size: 24px;
      letter-spacing: .1em;
      transform: rotate(90deg);
    }
  }
}
</style>