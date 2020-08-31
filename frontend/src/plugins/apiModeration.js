/**************************************************************
 * MAIN MODERATION CLASS
 */
class ModerationLib {
  /**************************************************************
   * Initialization
   */
  constructor (options, store) {
    this.store = store
    this.storeModuleName = options.storeModuleName

    this.moderationServer = options.moderationServer

    this.moderationSubmitTokenUrl = `${this.moderationServer}/submit-token` // POST

    // this.moderationInsertDatasetsUrl = `${this.moderationServer}/datasets` // POST
    // this.moderationGetDatasetUrl = `${this.moderationServer}/datasets` // GET + dataset_id

    // debugging
    console.log('>>> ModerationLib > init >  this :', this)
  }

  /**************************************************************
   * login to moderation server
   */
  async login (clientToken) {
    const submitUrl = `${this.moderationSubmitTokenUrl}`
    const config = {
      method: 'POST',
      body: { token: clientToken }
    }
    try {
      const response = await fetch(submitUrl, config)
      console.log('>>> ModerationLib > login >  response :', response)
      const auth = response.message === 'success'
      this.store.commit(`${this.storeModuleName}/setLogin`, auth)
      this.store.commit(`${this.storeModuleName}/setModerationResponse`, response)
      return response
    } catch (error) {
      console.log('>>> ModerationLib > login > error', error)
      this.store.commit(`${this.storeModuleName}/setModerationResponse`, error)
    } finally {
      console.log('>>> ModerationLib > login >  finally ...')
    }
  }

  async logout () {
    console.log('>>> ModerationLib > logout ...')
    this.store.commit(`${this.storeModuleName}/resetLogin`)
    this.store.commit(`${this.storeModuleName}/setModerationResponse`, 'you are now logged out from moderation ')
  }

  /**************************************************************
   * dataset related
   */
  async getModeration (jsonDataId, endpoint = 'datasets') {
    const url = `${this.moderationServer}/${endpoint}/${jsonDataId}`
    console.log('>>> ModerationLib > getModeration >  url :', url)
    const config = {
      method: 'GET',
      headers: { 'content-type': 'application/json' }
    }
    try {
      const response = await fetch(url, config)
      console.log('>>> ModerationLib > getModeration >  response :', response)
      this.store.commit(`${this.storeModuleName}/setModerationResponse`, response)
      return response
    } catch (error) {
      console.log('error', error)
      this.store.commit(`${this.storeModuleName}/setModerationResponse`, error)
    } finally {
      console.log('>>> ModerationLib > getModeration > finally ...')
    }
  }

  async postModeration (jsonData, endpoint = 'datasets') {
    const url = `${this.moderationServer}/${endpoint}`
    console.log('>>> ModerationLib > postModeration >  url :', url)
    const moderationData = {
      uid: jsonData.uid,
      read: jsonData.read,
      comment: jsonData.comment,
      by: jsonData.by
    }
    const config = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: moderationData
    }
    try {
      const response = await fetch(url, config)
      console.log('>>> ModerationLib > postModeration >  response :', response)
      this.store.commit(`${this.storeModuleName}/setModerationResponse`, response)
      return response
    } catch (error) {
      console.log('error', error)
      this.store.commit(`${this.storeModuleName}/setModerationResponse`, error)
    } finally {
      console.log('>>> ModerationLib > postModeration > finally ...')
    }
  }
}

/**************************************************************
 * VUE STORE
 */
// vue store module within plugin just for auth
export const moduleAuth = {
  namespaced: true,
  state: () => ({
    moderationServer: process.env.VUE_MODERATION_API,
    moderationLogin: undefined,
    moderationResponse: undefined
  }),
  getters: {
    isLogged: (state) => {
      return !!(state.moderationLogin)
    }
  },
  mutations: {
    setLogin (state, moderationLoginResp) {
      state.moderationLogin = moderationLoginResp
    },
    setModerationResponse (state, resp) {
      state.moderationResponse = resp
    },
    resetLogin (state) {
      state.moderationLogin = undefined
    }
  },
  actions: {},
  modules: {}
}

/**************************************************************
 * OAUTH CLIENT - PLUGIN FOR VUE
 */
// wrap up client
const MODERATIONcli = {
  install (Vue, options, store) {
    // register namespaced store
    const moduleName = options.storeModuleName ? options.storeModuleName : 'moderation'
    options.storeModuleName = moduleName
    store.registerModule(moduleName, moduleAuth)

    // declare client as a global prototype in Vue
    Vue.prototype.$MODERATIONcli = new ModerationLib(options, store)
  }
}
export default MODERATIONcli

// // Automatic installation if Vue has been added to the global scope.
// if (typeof window !== 'undefined' && window.Vue) {
//   window.Vue.use(OAUTHcli)
// }
