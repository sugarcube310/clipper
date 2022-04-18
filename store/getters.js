export default {
  user: (state) => {
    return state.user
  },

  isAuthenticated (state) {
    return state.user.login
  },

  loginErrorMessage: (state) => {
    return state.loginErrorMessage
  },

  loginLoading: (state) => {
    return state.loginLoading
  },

  registerErrorMessage: (state) => {
    return state.registerErrorMessage
  },

  registerLoading: (state) => {
    return state.registerLoading
  }
}
