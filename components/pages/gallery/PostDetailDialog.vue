<template>
  <v-dialog
    v-model="isOpenDetailDialog"
    width="800"
  >
  <div class="postDetailDialog__inner px-10 pt-7 pb-12">
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

    <v-row class="post__detail">
      <v-col cols="12" class="mt-3 pb-0">
        <figure class="detail__image">
          <img :src="post.image_url" alt="">
        </figure>
      </v-col>
      <v-col cols="12" class="d-flex justify-end">
        <p class="mb-0 detail__time">
          投稿日時：{{ $dateFns.format(new Date(), 'yyyy.MM.dd HH:mm') }}
        </p>
      </v-col>
    </v-row>
  </div>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { format } from 'date-fns'

export default defineComponent({
  setup () {
    /** Reactive State **/
    const reactiveState = reactive({
      isOpenDetailDialog: false,
      post: {
        created_time: '',
        image_url: ''
      }
    })

    /** Methods **/
    const methods = {
      onClose () {
        reactiveState.isOpenDetailDialog = false
      },

      showDetail (post: any) {
        reactiveState.isOpenDetailDialog = true

        reactiveState.post.created_time = format(post.data.created_time, 'yyyy.MM.dd HH:mm')
        reactiveState.post.image_url = post.data.image_url
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
.postDetailDialog__inner {
  background-color: #fff;

  & .post__detail {
    margin: auto;
    width: 90%;

    & .detail__time {
      font-size: 14px;
      letter-spacing: .01em;
    }
  }
}
</style>