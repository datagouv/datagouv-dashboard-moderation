export const moduleGlobal = {
  namespaced: true,
  state: () => ({
    test: 'state.global.test',
    log: Boolean(process.env.VUE_APP_LOG_MODE),
    swaggerUrl: process.env.VUE_APP_SWAGGER_URL
  }),

  getters: {
    getLog: (state) => {
      return state.log
    }
  },

  mutations: {
    // setSwaggerObject (state, swaggerObject) {
    //   state.swaggerObject = swaggerObject
    // }
  },

  actions: {},

  modules: {}
}
