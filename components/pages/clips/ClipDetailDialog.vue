<template>
  <v-dialog
    v-model="isOpenDetailDialog"
    width="800"
  >
  <div class="clipDetailDialog__inner px-10 pt-7 pb-12">
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

    <v-row class="clip__detail">
      <v-col cols="12" class="mt-3 pb-0">
        <figure class="detail__image">
          <img :src="clip.image_url" alt="">
        </figure>
      </v-col>
      <v-col cols="12" class="d-flex justify-end">
        <p class="mb-0 detail__time">
          追加日時：{{ $dateFns.format(new Date(), 'yyyy.MM.dd HH:mm') }}
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
      clip: {
        created_time: '',
        image_url: ''
      }
    })

    /** Methods **/
    const methods = {
      onClose () {
        reactiveState.isOpenDetailDialog = false
      },

      showDetail (clip: any) {
        reactiveState.isOpenDetailDialog = true

        reactiveState.clip.created_time = format(clip.data.created_time, 'yyyy.MM.dd HH:mm')
        reactiveState.clip.image_url = clip.data.image_url
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
.clipDetailDialog__inner {
  background-color: #fff;

  & .clip__detail {
    margin: auto;
    width: 90%;

    & .detail__time {
      font-size: 14px;
      letter-spacing: .01em;
    }
  }
}
</style>