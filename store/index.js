import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export const state = () => ({
  user: {
    uid: '',
    email: '',
    name: '',
    image: '',
    introduction: '',
    releases: 0,
    login: false
  },
  loading: false,
  loginErrorMessage: '',
  registerErrorMessage: '',
  isShowLogoutMessage: false
})

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
