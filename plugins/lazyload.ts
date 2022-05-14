/*
** Vue-Lazyload
** 画像遅延読み込み
*/

import Vue from 'vue'
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
  loading: 'https://firebasestorage.googleapis.com/v0/b/your-clipper.appspot.com/o/common%2Fimage-loading.jpg?alt=media&token=4c39adf1-9044-4c1c-973b-8485a78b4126', // 画像読み込み中に表示する画像
  error: 'https://firebasestorage.googleapis.com/v0/b/your-clipper.appspot.com/o/common%2Fimage-load-error.jpg?alt=media&token=20aef6dc-31e0-473a-8896-146ac72234f2', // 画像読み込みが失敗した時に表示する画像
  attempt: 1 // 読み込みにトライする回数
})
