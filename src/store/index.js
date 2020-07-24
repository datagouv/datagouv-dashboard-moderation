import Vue from 'vue'
import Vuex from 'vuex'

// import store modules
// cf: https://vuex.vuejs.org/guide/modules.html
import { moduleGlobal } from './global.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    global: moduleGlobal
  }
})
