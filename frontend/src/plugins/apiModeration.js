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
  }

  /**************************************************************
   * login/logout to moderation server
   */
  async login (clientToken) {
    const url = `${this.moderationServer}/submit-token`
    console.log('>>> ModerationLib > login >  clientToken :', clientToken)
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
    } finally {}
  }

  async logout () {
    const url = `${this.moderationServer}/logout`
    const config = {
      method: 'GET',
      headers: { 'content-type': 'application/json' }
    }
    try {
      const response = await fetch(url, config)
      this.store.commit(`${this.storeModuleName}/resetLogin`)
      this.store.commit(`${this.storeModuleName}/setModerationResponse`, 'you are now logged out from moderation ')
      // this.store.commit(`${this.storeModuleName}/setModerationResponse`, response)
      return response
    } catch (error) {
      console.log('>>> ModerationLib > logout > error', error)
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
    itemModerationData[field] = value
    return itemModerationData
  }

  addModerationData (obj, itemStatus) {
    const commentsDummy = [
      {
        id: '1234',
        author: 'Julien Paris',
        user_id: '5ecb7bb95b7c0fda6b06d0e3',
        written_at: '09/09/2020',
        content: "I did comment this... I think it's very useful to add my thoughts here...",
        dgf_object_id: ''
      },
      {
        id: '9876',
        author: 'Alfred Wayne',
        user_id: '78cb7bb95b7c0fdgtr06d0200',
        written_at: '08/09/2020',
        content: 'Master Bruce would be against it...',
        dgf_object_id: ''
      }
    ]
    return {
      ...obj,
      read: itemStatus.read || false,
      suspicious: itemStatus.suspicious || false,
      deleted: itemStatus.deleted || false,
      comments: itemStatus.comments || commentsDummy // []
    }
  }

  /**************************************************************
   * moderation related
   */
  async getModeration (jsonDataId) {
    const url = `${this.moderationServer}/objects/${jsonDataId}`
    const config = {
      method: 'GET',
      headers: { 'content-type': 'application/json' }
    }
    try {
      const response = await fetch(url, config)
      this.store.commit(`${this.storeModuleName}/setModerationResponse`, response)
      return response
    } catch (error) {
      console.log('>>> ModerationLib > getModeration > error', error)
      this.store.commit(`${this.storeModuleName}/setModerationResponse`, error)
    } finally {}
  }

  async postModeration (dgfType, item, field, evt) {
    const url = `${this.moderationServer}/objects`
    const moderationData = this.formatModerationItem(dgfType, item, field, evt)
    console.log('>>> ModerationLib > postModeration >  moderationData :', moderationData)
    const config = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: moderationData
    }
    try {
      const response = await fetch(url, config)
      this.store.commit(`${this.storeModuleName}/setModerationResponse`, response)
      return response
    } catch (error) {
      console.log('>>> ModerationLib > postModeration > error', error)
      this.store.commit(`${this.storeModuleName}/setModerationResponse`, error)
    } finally {}
  }

  async updateModeration (dgfType, item, field, evt) {
    const url = `${this.moderationServer}/objects`
    const moderationData = this.formatModerationItem(dgfType, item, field, evt)
    console.log('>>> ModerationLib > updateModeration >  moderationData :', moderationData)
    const config = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: moderationData
    }
    try {
      const response = await fetch(url, config)
      this.store.commit(`${this.storeModuleName}/setModerationResponse`, response)
      return response
    } catch (error) {
      console.log('>>> ModerationLib > updateModeration > error', error)
      this.store.commit(`${this.storeModuleName}/setModerationResponse`, error)
    } finally {}
  }

  async addComment (dgfObjectId, comment) {
    console.log('>>> ModerationLib > addComment >  dgfObjectId :', dgfObjectId)
    console.log('>>> ModerationLib > addComment >  comment :', comment)
    const url = `${this.moderationServer}/objects/${dgfObjectId}/comments/>`
    const config = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: comment
    }
    try {
      const response = await fetch(url, config)
      this.store.commit(`${this.storeModuleName}/setModerationResponse`, response)
      return response
    } catch (error) {
      console.log('>>> ModerationLib > addComment > error', error)
      this.store.commit(`${this.storeModuleName}/setModerationResponse`, error)
    } finally {}
  }

  async deleteComment (dgfObjectId, commentId) {
    console.log('>>> ModerationLib > deleteComment >  dgfObjectId :', dgfObjectId)
    console.log('>>> ModerationLib > deleteComment >  commentId :', commentId)
    const url = `${this.moderationServer}/objects/${dgfObjectId}/comments/${commentId}`
    const config = {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      body: {}
    }
    try {
      const response = await fetch(url, config)
      this.store.commit(`${this.storeModuleName}/setModerationResponse`, response)
      return response
    } catch (error) {
      console.log('>>> ModerationLib > deleteComment > error', error)
      this.store.commit(`${this.storeModuleName}/setModerationResponse`, error)
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
    // moderationAuth: {},
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
