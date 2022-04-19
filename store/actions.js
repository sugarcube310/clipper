import { auth, storage, dbUsersRef } from '@/plugins/firebase'

export default {
  /**** ログイン ****/
  login ({ dispatch, commit }, payload) {
    commit('onLoading')

    /* ログイン処理 */
    auth.signInWithEmailAndPassword(payload.email, payload.password)
    .then(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          commit('getUserData', { uid: user.uid, email: user.email })
          commit('switchLogin', true)
          commit('clearLoginFormError')
        }
      })
      this.$router.push('/gallery')
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
    commit('onLoading')

    /* ユーザー登録処理 */
    auth.createUserWithEmailAndPassword(payload.email, payload.password)
    .then(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          commit('getUserData', { uid: user.uid, email: user.email })
          commit('switchLogin', true)
          commit('clearRegisterFormError')

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
      this.$router.push('/gallery')
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
      setTimeout(() => {
        this.$router.push('/')
        commit('switchLogin', false)
      }, 1000)
    })
    .catch((error) => {
      console.log(`Logout error: ${ error.message }`)
    })
  },

  /**** ログイン認証状態のチェック ****/
  checkAuth ({ commit }) {
    auth.onAuthStateChanged((user) => {
      user = user ? user : {}
      commit('getUserData', { uid: user.uid, email: user.email })

      const isAuthenticated = user.uid ? true : false
      commit('switchLogin', isAuthenticated)
    })
  },

  submit ({ context }, image) {
    const storageRef = storage.ref().child('file.png')
    storageRef.put(image)
    .then((res) => {
      console.log('res: ' + JSON.stringify(res))
    })
    .catch((error) => {
      console.log(`Submit Image Error: ${ error.message }`)
    })
  }
}
