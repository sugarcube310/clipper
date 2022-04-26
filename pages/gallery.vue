<template>
  <div class="page-container -gallery">
    <v-row class="gallery__list">
      <v-col
        cols="3"
        class="d-flex align-center justify-center list__item"
        v-for="(post, i) in posts"
        :key="i"
      >
        <figure>
          <img :src="post.data.image_url" alt="">
        </figure>
      </v-col>
    </v-row>

    <CreatePost @success="showMessage" />

    <transition name="fade" appear>
      <SuccessMessage v-if="isShowMessage" />
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted } from '@vue/composition-api'
import { mapGetters } from 'vuex'
import { auth, dbPicturesRef } from '@/plugins/firebase'

export default defineComponent({
  computed: {
    ...mapGetters(['user'])
  },
  setup () {
    /** Reactive State **/
    const reactiveState = reactive({
      posts: [] as any[],
      isShowMessage: false
    })

    /** Methods **/
    const methods = {
      getPosts () {
        auth.onAuthStateChanged((user) => {
          if (user) {
            const uid = user.uid

            setTimeout(() => {
              dbPicturesRef
              .where('user_id', '==', uid)
              .where('private_setting', '==', false)
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
            }, 500)
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
      }
    }

    onMounted(() => {
      methods.getPosts()
    })

    return {
      ...toRefs(reactiveState),
      ...methods
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
</style>