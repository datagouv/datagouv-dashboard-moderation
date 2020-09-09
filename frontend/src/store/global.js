export const moduleGlobal = {
  namespaced: true,
  state: () => ({
    test: 'state.global.test',
    log: Boolean(process.env.VUE_APP_LOG_MODE),
    swaggerUrl: process.env.VUE_APP_SWAGGER_URL,

    locale: 'fr',
    locales: {
      fr: { code: 'fr', text: 'français' },
      en: { code: 'en', text: 'english' }
    },

    navHistory: [],
    navMaxLength: 50
  }),

  getters: {
    getLog: (state) => {
      return state.log
    },
    getLocale: (state) => {
      return state.locale
    },
    getLastNavPath: (state) => {
      return state.navHistory.slice(-1)[0]
    }
  },

  mutations: {
    setLocale (state, locCode) {
      
      state.locale = locCode
    },
    setLocaleInLocalStorage (state, locCode) {
      
      const prefixLocalStorage = process.env.VUE_APP_OAUTH_LS_PREFIX
      const prefixLocale = `${prefixLocalStorage}Locale`
      localStorage[prefixLocale] = locCode
    },
    appendPathToHistory (state, path) {
      state.navHistory.push(path)
      
      if (state.navHistory.length > state.navMaxLength) {
        state.navHistory.slice(-state.navMaxLength)
      }
    }
  },

  actions: {
    changeLocale ({ commit }, locCode) {
      
      commit('setLocale', locCode)
      commit('setLocaleInLocalStorage', locCode)
    }
  },

  modules: {}
}
