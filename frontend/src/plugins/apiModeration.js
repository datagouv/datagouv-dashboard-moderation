/**************************************************************
 * MAIN MODERATION CLASS
 */
// const commentsDummy = [
//   {
//     id: '1234',
//     author: 'Julien Paris',
//     user_id: '5ecb7bb95b7c0fda6b06d0e3',
//     written_at: '09/09/2020',
//     content: "I did comment this... I think it's very useful to add my thoughts here...",
//     dgf_object_id: ''
//   },
//   {
//     id: '9876',
//     author: 'Alfred Wayne',
//     user_id: '78cb7bb95b7c0fdgtr06d0200',
//     written_at: '08/09/2020',
//     content: 'Master Bruce would be against it...',
//     dgf_object_id: ''
//   }
// ]

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
    console.log('>>> ModerationLib > constructor >  this.moderationServer :', this.moderationServer)
  }

  /**************************************************************
   * login/logout to moderation server
   */
  async login (clientToken) {
    const url = `${this.moderationServer}/submit-token`
    // console.log('>>> ModerationLib > login >  clientToken :', clientToken)
    const config = {
      method: 'POST',
      headers: basicHeaders,
      credentials: 'include',
      body: JSON.stringify({ token: clientToken })
    }
    try {
      // console.log('>>> ModerationLib > login >  config :', config)
      const response = await fetch(url, config)
      // console.log('>>> ModerationLib > login >  response :', response)
      // const data = await response.json()
      // console.log('>>> ModerationLib > login >  data :', data)
      const respHeaders = response.headers
      respHeaders.forEach(function (value, name) {
        // console.log('>>> ModerationLib > login >  respHeaders > ', name + ' : ' + value)
      })
      // console.log('>>> ModerationLib > login >  respHeaders :', respHeaders)
      // console.log('>>> ModerationLib > login >  respHeaders.get("Content-Type") :', respHeaders.get('Content-Type'))
      // console.log('>>> ModerationLib > login >  respHeaders.get("Status") :', respHeaders.get('Status'))
      // console.log('>>> ModerationLib > login >  respHeaders.get("Set-Cookie") :', respHeaders.get('Set-Cookie'))
      // console.log('>>> ModerationLib > login >  respHeaders.get("session-id") :', respHeaders.get('session-id'))
      const auth = response.message === 'success'
      this.store.commit(`${this.storeModuleName}/setLogin`, auth)
      this.store.commit(`${this.storeModuleName}/setModerationSession`, respHeaders)
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
      headers: { ...basicHeaders }
    }
    try {
      const response = await fetch(url, config)
      console.log('>>> ModerationLib > logout > response', response)
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
    if (field) {
      itemModerationData[field] = value
    }
    return itemModerationData
  }

  async addModerationData (obj, itemStatus) {
    // console.log('>>> ModerationLib > addModerationData > itemStatus : ', itemStatus)
    const moderationData = await itemStatus.json()
    const consolidatedItem = { ...obj }
    // const data = itemStatus
    // console.log('>>> ModerationLib > addModerationData > data : ', data)
    consolidatedItem.read = moderationData.read || false
    consolidatedItem.suspicious = moderationData.suspicious || false
    consolidatedItem.deleted = moderationData.deleted || false
    consolidatedItem.comments = moderationData.comments || [] // commentsDummy
    // })
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
        console.log(">>> ModerationLib > getModeration > item doesn't exist yet in moderation backend ... => POST")
        response = await this.postModeration(dgfType, item)
        return response
      } else if (response.status === 200) {
        // console.log('>>> ModerationLib > getModeration >  response :', response)
        // const data = await response.json()
        return response
      } else {
        return response
      }
      // const response = await fetch(url, config)
      // .then(resp => resp.json())
      // .then(myJson => {
      //   console.log('>>> ModerationLib > getModeration > myJson : ', myJson)
      // })
      // console.log('>>> ModerationLib > getModeration > response.body : ', response.body)
      // // this.store.commit(`${this.storeModuleName}/setModerationResponse`, response)
      // if (response.status === 404) {
      //   console.log(">>> ModerationLib > getModeration > item doesn't exist yet in moderation backend ... => POST")
      //   response = await this.postModeration(dgfType, item)
      // } else {
      //   response.body.json().then(data => {
      //     console.log('>>> ModerationLib > getModeration > data : ', data)
      //     return data
      //   })
      // }
      // console.log('>>> ModerationLib > getModeration > response : ', response)
      // return response
    } catch (error) {
      console.log('>>> ModerationLib > getModeration > error', error)
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
    console.log('>>> ModerationLib > postModeration >  moderationData :', moderationData)
    const config = {
      method: 'POST',
      headers: { ...basicHeaders, ...session },
      body: JSON.stringify(moderationData)
    }
    try {
      const response = await fetch(url, config)
      // const data = await response.json()
      // this.store.commit(`${this.storeModuleName}/setModerationResponse`, data)
      return response
    } catch (error) {
      console.log('>>> ModerationLib > postModeration > error', error)
      // this.store.commit(`${this.storeModuleName}/setModerationResponse`, error)
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
    console.log('>>> ModerationLib > updateModeration >  moderationData :', moderationData)
    const config = {
      method: 'PUT',
      headers: { ...basicHeaders, ...session },
      body: JSON.stringify(moderationData)
    }
    console.log('>>> ModerationLib > updateModeration >  config :', config)
    try {
      const response = await fetch(url, config)
      // const data = await response.json()
      // this.store.commit(`${this.storeModuleName}/setModerationResponse`, data)
      return response
    } catch (error) {
      console.log('>>> ModerationLib > updateModeration > error', error)
      // this.store.commit(`${this.storeModuleName}/setModerationResponse`, error)
      return {
        method: 'PUT',
        status: 500,
        msg: error
      }
    } finally {}
  }

  async addComment (dgfObjectId, comment) {
    console.log('>>> ModerationLib > addComment >  dgfObjectId :', dgfObjectId)
    console.log('>>> ModerationLib > addComment >  comment :', comment)
    const url = `${this.moderationServer}/objects/${dgfObjectId}/comments`
    const session = this.store.getters.getModerationSession
    const config = {
      method: 'POST',
      headers: { ...basicHeaders, ...session },
      body: JSON.stringify(comment)
    }
    try {
      const response = await fetch(url, config)
      // const data = await response.json()
      // this.store.commit(`${this.storeModuleName}/setModerationResponse`, data)
      return response
    } catch (error) {
      console.log('>>> ModerationLib > addComment > error', error)
      // this.store.commit(`${this.storeModuleName}/setModerationResponse`, error)
      return {
        method: 'POST',
        status: 500,
        msg: error
      }
    } finally {}
  }

  async deleteComment (dgfObjectId, commentId) {
    console.log('>>> ModerationLib > deleteComment >  dgfObjectId :', dgfObjectId)
    console.log('>>> ModerationLib > deleteComment >  commentId :', commentId)
    const url = `${this.moderationServer}/objects/${dgfObjectId}/comments/${commentId}`
    const session = this.store.getters.getModerationSession
    const config = {
      method: 'DELETE',
      headers: { ...basicHeaders, ...session },
      body: {}
    }
    try {
      const response = await fetch(url, config)
      // const data = await response.json()
      // this.store.commit(`${this.storeModuleName}/setModerationResponse`, data)
      return response
    } catch (error) {
      console.log('>>> ModerationLib > deleteComment > error', error)
      // this.store.commit(`${this.storeModuleName}/setModerationResponse`, error)
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
    // moderationAuth: {},
    moderationLogin: undefined,
    moderationResponse: undefined,
    moderationSession: { session: 'no session yet' }
    // currentModerationItem: undefined
  }),
  getters: {
    isLogged: (state) => {
      return !!(state.moderationLogin)
    },
    getModerationSession: (state) => {
      return this.moderationSession
    }
    // getCurrentModerationItem: (state) => {
    //   return this.currentModerationItem
    // }
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
    // updateCurrentModerationItem (state, { field, value }) {
    //   state.currentModerationItem[field] = value
    // }
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
