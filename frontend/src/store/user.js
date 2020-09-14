export const moduleUser = {
  namespaced: true,
  state: () => ({
    test: 'state.user.test',
    log: Boolean(process.env.VUE_APP_LOG_MODE),
    user: undefined
  }),

  getters: {
    getLog: (state) => {
      return state.log
    },
    getUser: (state) => {
      return this.user
    }
  },

  mutations: {
    setUser (state, user) {
      state.user = user
    },
    resetUser (state) {
      state.user = undefined
    }
  },

  actions: {},

  modules: {}
}
