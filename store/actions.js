import { auth, dbUsersRef } from '@/plugins/firebase'

export default {
  /**** ログイン ****/
  login ({ dispatch, commit }, payload) {
    /* ローディングアニメーション開始 */
    commit('onLoginLoading')

    /* ログイン処理 */
    auth.signInWithEmailAndPassword(payload.email, payload.password)
    .then(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          commit('getData', { uid: user.uid, email: user.email })
          commit('switchLogin')
        }
      })
      this.$router.push('/list')
    })
    .catch((error) => {
      dispatch('showLoginError', error.code)
      console.log(`Login error: ${ error.message }`)
    })
  },

  showLoginError ({ commit }, errorCode) {
    commit('setLoginErrorMessage', errorCode)
  },

  /**** ユーザー登録 ****/
  register ({ dispatch, commit }, payload) {
    /* ローディングアニメーション開始 */
    commit('onRegisterLoading')

    console.log('payload' + payload.name)

    /* ユーザー登録処理 */
    auth.createUserWithEmailAndPassword(payload.email, payload.password)
    .then(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          commit('getData', { uid: user.uid, email: user.email })
          commit('switchLogin')

          // users コレクションに登録
          dbUsersRef
          .doc(user.uid)
          .set({
            created_time: new Date(),
            email: user.email,
            name: payload.name,
            profile: '',
            releases: 0
          })
          .then(() => {
            console.log('User registration succeeded!')
          })
          .catch((error) => {
            console.error(error)
          })
        }
      })
      this.$router.push('/list')
    })
    .catch((error) => {
      dispatch('showRegisterError', error.code)
      console.log(`Register error: ${ error.message }`)
    })
  },

  showRegisterError ({ commit }, errorCode) {
    commit('setRegisterErrorMessage', errorCode)
  },

  /**** ログアウト ****/
  logout ({ commit }) {
    auth.signOut()
    .then(() => {
      commit('switchLogout')
      setTimeout(() => {
        this.$router.push('/')
      }, 1000)
    })
    .catch((error) => {
      console.log(`Logout error: ${ error.message }`)
    })
  }
}
