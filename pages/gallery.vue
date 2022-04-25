<template>
  <div class="page-container -gallery">
    <ul>
      <li v-for="post in posts" :key="post.id">
        <figure>
          <img :src="post.data.image_url" alt="">
        </figure>
      </li>
    </ul>

    <PostButton />
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
      posts: [] as any[]
    })

    /** Methods **/
    const methods = {
      getImages () {
        auth.onAuthStateChanged((user) => {
          if (user) {
            const uid = user.uid

            setTimeout(() => {
              dbPicturesRef
              .where('user_id', '==', uid)
              .where('public_setting', '==', true)
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
              })
            }, 500)
          } else {
            return
          }
        })
      }
    }

    onMounted(() => {
      methods.getImages()
    })

    return {
      ...toRefs(reactiveState),
      ...methods
    }
  }
})
</script>

<style lang="postcss" scoped>
</style>