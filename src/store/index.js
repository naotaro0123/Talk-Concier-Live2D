import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    scene: null,
    avatar: 0,
    userMessage: null,
    avatarMessage: null,
    inputVoice: false,
  },
  mutations: {
    changeScene(state, value){
      state.scene = value
    },
    changeAvatar(state, value){
      state.avatar = value
    },
    changeUserMessage(state, value){
      state.userMessage = value
    },
    changeAvatarMessage(state, value){
      state.avatarMessage = value
    },
    changeInputVoice(state, value){
      state.inputVoice = value
    }
  },
  getters: {
    scene(state){
      return state.scene
    },
    getScene: state => () => state.scene,

    avatar(state){
      return state.avatar
    },
    getAvatar: state => () => state.avatar,

    userMessage(state){
      return state.userMessage
    },
    getUserMessage: state => () => state.userMessage,

    avatarMessage(state){
      return state.avatarMessage
    },
    getAvatarMessage: state => () => state.avatarMessage,

    inputVoice(state){
      return state.inputVoice
    },
    getInputVoice: state => () => state.inputVoice
  }
})
