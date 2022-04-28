export default function ({ store, route, redirect }) {
  store.watch((state) => {
    const isAuthenticated = store.getters.isAuthenticated

    if (isAuthenticated) { // ログイン済みの場合
      if (route.name === 'login') {
        return redirect({ name: 'clips' })
      }
    } else { // 未ログインの場合
      if (route.name !== 'login') {
        return redirect({ name: 'login' })
      }
    }
  })
}
