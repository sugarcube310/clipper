export default {
  /**** ユーザー情報の取得 ****/
  getUserData (state, payload) {
    state.user.uid = payload.uid
    state.user.email = payload.email
    state.user.login = payload.uid ? true: false
  },

  /**** ログイン認証状態を変更 ****/
  switchLogin (state, status) {
    state.user.login = status
  },

  onLoading (state) {
    state.loading = true
  },

  setLoginErrorMessage (state, errorCode) {
    if (errorCode === 'auth/invalid-email') {
      state.loginErrorMessage = '無効なメールアドレスです。'
    } else if(errorCode === 'auth/user-disabled') {
      state.loginErrorMessage = 'アカウントが無効になっています。\nお手数ですが管理者へお問い合わせください。'
    } else if(errorCode === 'auth/user-not-found') {
      state.loginErrorMessage = 'アカウントがありません。\n「アカウントをお持ちでない方はこちら」から新規登録をお願いします。'
    } else if(errorCode === 'auth/wrong-password') {
      state.loginErrorMessage = 'パスワードが正しくありません。'
    } else if (errorCode === 'auth/too-many-requests') {
      state.loginErrorMessage = 'ログインに何度も失敗しました。\n少し時間をおいてから、再度試してみてください。'
    }
    state.loading = false
  },

  clearLoginFormError (state) {
    state.loginErrorMessage = ''
    state.loading = false
  },

  setRegisterErrorMessage (state, errorCode) {
    if (errorCode === 'auth/email-already-in-use') {
      state.registerErrorMessage = 'すでに登録済みのアカウントです。'
    }
    state.loading = false
  },

  clearRegisterFormError (state) {
    state.registerErrorMessage = ''
    state.loading = false
  }
}
