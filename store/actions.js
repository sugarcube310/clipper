import { auth } from '@/plugins/firebase'

export default {
  login ({ dispatch, commit }, payload) {
    commit('switchLoginLoading')

    auth.signInWithEmailAndPassword(payload.email, payload.password)
    .then(() => {
      dispatch('checkLogin')
      this.$router.push('/list')
    })
    .catch((error) => {
      dispatch('showLoginError', error.code)
      console.log(`Login error: ${ error.message }`)
    })
  },

  checkLogin ({ commit }) {
    auth.onAuthStateChanged((user) => {
      if (user) {
        commit('getData', { uid: user.uid, email: user.email })
        commit('switchLogin')
      }
    })
  },

  showLoginError ({ commit }, errorCode) {
    commit('setLoginErrorMessage', errorCode)
  },

  register ({ dispatch, commit }, payload) {
    auth.createUserWithEmailAndPassword(payload.email, payload.password)
    .then(() => {
      dispatch('checkLogin')
      this.$router.push('/list')
    })
    .catch((error) => {
      console.log(`Register error: ${ error.message }`)
    })
  },

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
