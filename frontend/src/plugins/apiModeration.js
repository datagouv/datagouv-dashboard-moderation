/**************************************************************
 * MAIN MODERATION CLASS
 */

const basicHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'Access-Control-Request-Headers': ['Cookie', 'Set-Cookie', 'Session-Id']
}

class ModerationLib {
  /**************************************************************
   * Initialization
   */
  constructor (options, store) {
    this.store = store
    this.storeModuleName = options.storeModuleName
    this.moderationServer = options.moderationServer
  }

  /**************************************************************
   * login/logout to moderation server
   */
  async login (clientToken) {
    const url = `${this.moderationServer}/submit-token`
    const config = {
      method: 'POST',
      headers: basicHeaders,
      credentials: 'include',
      body: JSON.stringify({ token: clientToken })
    }
    try {
      const response = await fetch(url, config)
      const respHeaders = response.headers
      const auth = response.message === 'success'
      this.store.commit(`${this.storeModuleName}/setLogin`, auth)
      this.store.commit(`${this.storeModuleName}/setModerationSession`, respHeaders)
      this.store.commit(`${this.storeModuleName}/setModerationResponse`, response)
      return response
    } catch (error) {
      console.error('>>> ModerationLib > login > error', error)
      this.store.commit(`${this.storeModuleName}/setModerationResponse`, error)
    } finally {}
  }

  async logout () {
    const url = `${this.moderationServer}/logout`
    const config = {
      method: 'GET',
      headers: { ...basicHeaders }
    }
    try {
      const response = await fetch(url, config)
      this.store.commit(`${this.storeModuleName}/resetLogin`)
      this.store.commit(`${this.storeModuleName}/setModerationResponse`, 'you are now logged out from moderation ')
      // this.store.commit(`${this.storeModuleName}/setModerationResponse`, response)
      return response
    } catch (error) {
      console.error('>>> ModerationLib > logout > error', error)
      this.store.commit(`${this.storeModuleName}/setModerationResponse`, error)
    } finally {}
  }

  /**************************************************************
   * moderation formatting
   */
  formatModerationItem (dgfType, item, field, value) {
    const itemModerationData = {
      dgf_type: dgfType,
      dgf_id: item.id,
      read: item.read || false,
      suspicious: item.suspicious || false,
      comments: item.comments || [],
      deleted: item.deleted || false
    }
    if (field) {
      itemModerationData[field] = value
    }
    return itemModerationData
  }

  async addModerationData (obj, itemStatus) {
    const moderationData = await itemStatus.json()
    const consolidatedItem = { ...obj }
    consolidatedItem.read = moderationData.read || false
    consolidatedItem.suspicious = moderationData.suspicious || false
    consolidatedItem.deleted = moderationData.deleted || false
    consolidatedItem.comments = moderationData.comments || []
    return consolidatedItem
  }

  /**************************************************************
   * moderation related
   */
  async getModeration (dgfType, item) {
    const itemId = item.id
    const url = `${this.moderationServer}/objects/${itemId}`
    const session = this.store.getters.getModerationSession
    const config = {
      method: 'GET',
      credentials: 'include',
      headers: { ...basicHeaders, ...session }
    }
    try {
      let response = await fetch(url, config)
      if (response.status === 404) {
        // console.log(">>> ModerationLib > getModeration > item doesn't exist yet in moderation backend ... => POST")
        response = await this.postModeration(dgfType, item)
        return { ...response, method: 'POST' }
      } else if (response.status === 200) {
        return response
      } else {
        return response
      }
    } catch (error) {
      console.error('>>> ModerationLib > getModeration > error', error)
      this.store.commit(`${this.storeModuleName}/setModerationResponse`, error)
      return {
        method: 'GET',
        status: 500,
        msg: error
      }
    } finally {}
  }

  async postModeration (dgfType, item, field = undefined, evt = undefined) {
    const url = `${this.moderationServer}/objects`
    const session = this.store.getters.getModerationSession
    const moderationData = this.formatModerationItem(dgfType, item, field, evt)
    const config = {
      method: 'POST',
      headers: { ...basicHeaders, ...session },
      body: JSON.stringify(moderationData)
    }
    try {
      const response = await fetch(url, config)
      return response
    } catch (error) {
      return {
        method: 'POST',
        status: 500,
        msg: error
      }
    } finally {}
  }

  async updateModeration (dgfType, item, field, evt) {
    const url = `${this.moderationServer}/objects/${item.id}`
    const session = this.store.getters.getModerationSession
    const moderationData = this.formatModerationItem(dgfType, item, field, evt)
    const config = {
      method: 'PUT',
      headers: { ...basicHeaders, ...session },
      body: JSON.stringify(moderationData)
    }
    try {
      const response = await fetch(url, config)
      return response
    } catch (error) {
      return {
        method: 'PUT',
        status: 500,
        msg: error
      }
    } finally {}
  }

  async addComment (dgfObjectId, comment) {
    const url = `${this.moderationServer}/objects/${dgfObjectId}/comments`
    const session = this.store.getters.getModerationSession
    const config = {
      method: 'POST',
      headers: { ...basicHeaders, ...session },
      body: JSON.stringify(comment)
    }
    try {
      const response = await fetch(url, config)
      return response
    } catch (error) {
      return {
        method: 'POST',
        status: 500,
        msg: error
      }
    } finally {}
  }

  async deleteComment (dgfObjectId, commentId) {
    const url = `${this.moderationServer}/objects/${dgfObjectId}/comments/${commentId}`
    const session = this.store.getters.getModerationSession
    const config = {
      method: 'DELETE',
      headers: { ...basicHeaders, ...session },
      body: {}
    }
    try {
      const response = await fetch(url, config)
      return response
    } catch (error) {
      return {
        method: 'DELETE',
        status: 500,
        msg: error
      }
    } finally {}
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
    moderationResponse: undefined,
    moderationSession: { session: 'no session yet' }
  }),
  getters: {
    isLogged: (state) => {
      return !!(state.moderationLogin)
    },
    getModerationSession: (state) => {
      return this.moderationSession
    }
  },
  mutations: {
    setLogin (state, moderationLoginResp) {
      state.moderationLogin = moderationLoginResp
    },
    setModerationSession (state, headers) {
      state.moderationSession.session = headers
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
