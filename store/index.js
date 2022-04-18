import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export const state = () => ({
  user: {
    uid: '',
    email: '',
    login: false
  },
  loginErrorMessage: '',
  loginLoading: false,
  registerErrorMessage: '',
  registerLoading: false,
})

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
