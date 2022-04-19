<template>
  <div class="page-container -setting">
    <form
      class="form"
      @submit.prevent="submitImg"
    >
    </form>
    <input
      type="file"
      accept="img/*"
      @change="changeImg"
    >
    <button
      type="submit"
      class="button"
    >
      click
    </button>
    <div>
      <p>{{ postData.thumbnail }}</p>
      <img :src="postData.thumbnail" alt="">
    </div>

    <div>
      <button
        class="button"
        @click="getImg()"
      >
        取得
      </button>
      <img :src="getData.thumbnail" alt="">
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { storage } from '@/plugins/firebase'

export default defineComponent({
  setup () {
    /** Reactive State **/
    const reactiveState = reactive({
      thumbnail: '',
      postData: {
        thumbnail: ''
      },
      getData: {
        thumbnail: '',
      }
    })

    /** Methods **/
    const methods = {
      changeImg (e: any) {
        reactiveState.thumbnail = e.target.files[0]
        if (reactiveState.thumbnail) {
          const reader = new FileReader()
          reader.onload = () => {
            reactiveState.postData.thumbnail = reader.result + ''
          }
          // @ts-ignore
          reader.readAsDataURL(reactiveState.thumbnail)
          console.log('選択完了')
          methods.submitImg(reactiveState.thumbnail)
        }
      },

      submitImg (thumbnail: any) {
        const storageRef = storage.ref().child('file.png')
        storageRef.put(thumbnail)
        .then(res => console.log(res))
        .catch(error => console.log(error))
      },

      getImg () {
        let storageRef = storage.ref().child('file.png')
        storageRef.getDownloadURL()
        .then((res) => {
          console.log(res)
          reactiveState.getData.thumbnail = res
        })
      }
    }

    return {
      ...toRefs(reactiveState),
      ...methods
    }
  }
})
</script>