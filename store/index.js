import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export const state = () => ({
  user: {
    uid: '',
    email: '',
    login: false
  },
  loading: false,
  loginErrorMessage: '',
  registerErrorMessage: ''
})

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
