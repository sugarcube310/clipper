export default {
  user: (state) => {
    return state.user
  },

  isAuthenticated (state) {
    return state.user.login
  },

  loading: (state) => {
    return state.loading
  },

  loginErrorMessage: (state) => {
    return state.loginErrorMessage
  },

  registerErrorMessage: (state) => {
    return state.registerErrorMessage
  },

  isShowLogoutMessage: (state) => {
    return state.isShowLogoutMessage
  }
}
