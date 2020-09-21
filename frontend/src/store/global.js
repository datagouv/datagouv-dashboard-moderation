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
    getNavHistory: (state) => {
      return state.navHistory
    },
    getLastNavPath: (state) => {
      console.log('-S- global > getLastNavPath > state.navHistory : ', state.navHistory)
      console.log('-S- global > getLastNavPath > state.navHistory.slice(-1)[0] : ', state.navHistory.slice(-1)[0])
      const lastPath = state.navHistory.slice(-1)[0]
      return lastPath
    },
    isHistory (state) {
      return state.navHistory.length > 1
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
    },
    async deleteLastPathfromHistory (state) {
      state.navHistory = state.navHistory.slice(0, -2)
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
