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

    // debugging
    // console.log('>>> ModerationLib > init >  this :', this)
  }

  /**************************************************************
   * login/logout to moderation server
   */
  async login (clientToken) {
    const url = `${this.moderationServer}/submit-token`
    const config = {
      method: 'POST',
      body: { token: clientToken }
    }
    try {
      const response = await fetch(url, config)
      console.log('>>> ModerationLib > login >  response :', response)
      const auth = response.message === 'success'
      this.store.commit(`${this.storeModuleName}/setLogin`, auth)
      this.store.commit(`${this.storeModuleName}/setModerationResponse`, response)
      return response
    } catch (error) {
      console.log('>>> ModerationLib > login > error', error)
      this.store.commit(`${this.storeModuleName}/setModerationResponse`, error)
    } finally {
      // console.log('>>> ModerationLib > login >  finally ...')
    }
  }

  async logout () {
    // console.log('>>> ModerationLib > logout ...')

    const url = `${this.moderationServer}/logout`
    // console.log('>>> ModerationLib > logout >  url :', url)
    const config = {
      method: 'GET',
      headers: { 'content-type': 'application/json' }
    }
    try {
      const response = await fetch(url, config)
      // console.log('>>> ModerationLib > logout >  response :', response)
      this.store.commit(`${this.storeModuleName}/resetLogin`)
      this.store.commit(`${this.storeModuleName}/setModerationResponse`, 'you are now logged out from moderation ')
      // this.store.commit(`${this.storeModuleName}/setModerationResponse`, response)
      return response
    } catch (error) {
      console.log('>>> ModerationLib > logout > error', error)
      this.store.commit(`${this.storeModuleName}/setModerationResponse`, error)
    } finally {
      // console.log('>>> ModerationLib > logout > finally ...')
    }
  }

  /**************************************************************
   * moderation formatting
   */
  formatModerationItem (dgfType, item, field, value) {
    console.log('>>> ModerationLib > formatModerationItem >  value :', value)
    const itemModerationData = {
      dgf_type: dgfType,
      dgf_id: item.id,
      read: item.read || false,
      suspicious: item.suspicious || false,
      comments: item.comments,
      deleted: item.deleted || false
    }
    itemModerationData[field] = value
    console.log('>>> ModerationLib > formatModerationItem >  itemModerationData :', itemModerationData)
    return itemModerationData
  }

  addModerationData (obj, itemStatus) {
    return {
      ...obj,
      read: itemStatus.read,
      suspicious: itemStatus.suspicious,
      comments: itemStatus.comments,
      deleted: itemStatus.deleted
    }
  }

  /**************************************************************
   * moderation related
   */
  async getModeration (jsonDataId) {
    const url = `${this.moderationServer}/objects/${jsonDataId}`
    // console.log('>>> ModerationLib > getModeration >  url :', url)
    const config = {
      method: 'GET',
      headers: { 'content-type': 'application/json' }
    }
    try {
      const response = await fetch(url, config)
      // console.log('>>> ModerationLib > getModeration >  response :', response)
      this.store.commit(`${this.storeModuleName}/setModerationResponse`, response)
      return response
    } catch (error) {
      console.log('>>> ModerationLib > getModeration > error', error)
      this.store.commit(`${this.storeModuleName}/setModerationResponse`, error)
    } finally {
      // console.log('>>> ModerationLib > getModeration > finally ...')
    }
  }

  async postModeration (dgfType, item, field, evt) {
    const url = `${this.moderationServer}/objects`
    // console.log('>>> ModerationLib > postModeration >  url :', url)
    const moderationData = this.formatModerationItem(dgfType, item, field, evt)
    console.log('>>> ModerationLib > postModeration >  moderationData :', moderationData)
    const config = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: moderationData
    }
    try {
      const response = await fetch(url, config)
      // console.log('>>> ModerationLib > postModeration >  response :', response)
      this.store.commit(`${this.storeModuleName}/setModerationResponse`, response)
      return response
    } catch (error) {
      console.log('>>> ModerationLib > postModeration > error', error)
      this.store.commit(`${this.storeModuleName}/setModerationResponse`, error)
    } finally {
      // console.log('>>> ModerationLib > postModeration > finally ...')
    }
  }

  async updateModeration (dgfType, item, field, evt) {
    const url = `${this.moderationServer}/objects`
    // console.log('>>> ModerationLib > postModeration >  url :', url)
    const moderationData = this.formatModerationItem(dgfType, item, field, evt)
    console.log('>>> ModerationLib > updateModeration >  moderationData :', moderationData)
    const config = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: moderationData
    }
    try {
      const response = await fetch(url, config)
      // console.log('>>> ModerationLib > updateModeration >  response :', response)
      this.store.commit(`${this.storeModuleName}/setModerationResponse`, response)
      return response
    } catch (error) {
      console.log('>>> ModerationLib > updateModeration > error', error)
      this.store.commit(`${this.storeModuleName}/setModerationResponse`, error)
    } finally {
      // console.log('>>> ModerationLib > updateModeration > finally ...')
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
