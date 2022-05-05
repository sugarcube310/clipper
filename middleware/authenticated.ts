import { auth } from '@/plugins/firebase'

export default function ({ store, route, redirect }: { from: any, store: any, route: any, redirect: any }) {
  if (route.name === 'login') {
    // ログインページで、既にログイン認証がされている場合は一覧ページにリダイレクトさせる
    auth.onAuthStateChanged((user) => {
      if (user) {
        redirect('/clips/')
      } else {
        return
      }
    })
  } else {
    // 未ログイン状態でログインページ以外のURLにアクセスされた場合、ログインページにリダイレクトさせる
    auth.onAuthStateChanged((user) => {
      if (!user) {
        redirect('/login/')
      } else {
        return
      }
    })
  }
}