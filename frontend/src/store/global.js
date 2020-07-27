export const moduleGlobal = {
  namespaced: true,
  state: () => ({
    test: 'state.global.test',
    log: Boolean(process.env.VUE_APP_LOG_MODE),
    swaggerUrl: process.env.VUE_APP_SWAGGER_URL,

    navHistory: [],
    navMaxLength: 50
  }),

  getters: {
    getLog: (state) => {
      return state.log
    },
    getLastNavPath: (state) => {
      return state.navHistory.slice(-1)[0]
    }
  },

  mutations: {
    appendPathToHistory (state, path) {
      state.navHistory.push(path)
      console.log('-S- global > appendPathToHistory > path : ', path)
      if (state.navHistory.length > state.navMaxLength) {
        state.navHistory.slice(-state.navMaxLength)
      }
    }
  },

  actions: {},

  modules: {}
}
