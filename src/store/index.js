import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import auth from './auth'

const debug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

  },

  mutations: {

  },

  actions: {
  },

  modules: {
    auth
  },

  strict: debug,

  plugins: debug ? [createLogger()] : []
})
