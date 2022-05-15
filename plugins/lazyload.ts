/*
** Vue-Lazyload
** 画像遅延読み込み
*/

import Vue from 'vue'
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
  loading: 'https://firebasestorage.googleapis.com/v0/b/your-clipper.appspot.com/o/common%2Fimage-loading.jpg?alt=media&token=225201eb-d9b0-4ba6-ad0c-da9cb99e8ea4', // 画像読み込み中に表示する画像
  error: 'https://firebasestorage.googleapis.com/v0/b/your-clipper.appspot.com/o/common%2Fimage-load-error.jpg?alt=media&token=ed39847f-b891-47fb-ab24-56b3cd845434', // 画像読み込みが失敗した時に表示する画像
  attempt: 1 // 読み込みにトライする回数
})
