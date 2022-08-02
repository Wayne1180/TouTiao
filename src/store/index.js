import { values } from 'lodash'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userPhoto: 'https://img0.baidu.com/it/u=4192600518,2461160499&fm=253&fmt=auto&app=120&f=JPEG?w=503&h=500'
  },
  getters: {
  },
  mutations: {
    // 编码风格，mutations最好大写
    SET_USERPHOTO(state, value) {
      state.userPhoto = value
    }
  },
  actions: {
  },
  modules: {
  }
})
