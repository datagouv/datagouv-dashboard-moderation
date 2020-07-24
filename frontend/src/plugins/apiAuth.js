// npm package : oauth2-connect

import { create } from 'pkce'

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const charactersPunctuation = '-._~'
const flowsMinMax = {
  pkce: {
    needExchange: true,
    state: { min: 28, max: 32, chars: [...characters] },
    code: { min: 43, max: 128, chars: [...characters, ...charactersPunctuation] }
  },
  authCode: {
    needExchange: true,
    state: { min: 28, max: 32, chars: characters }
  },
  implicit: {
    needExchange: false,
    state: { min: 28, max: 32, chars: characters }
  }
}
// const basicHeaders = {
//   Accept: 'application/json',
//   'Content-Type': 'application/json'
// }
// const basicFormDataHeaders = {
//   'Content-Type': 'application/x-www-form-urlencoded'
// }

/**************************************************************
 * RANDOMIZATION UTILS FUNCTIONS
 */

function randomFloat () {
  const int = window.crypto.getRandomValues(new Uint32Array(1))[0]
  return int / 2 ** 32
}

function randomInt (min, max) {
  const range = max - min
  return Math.floor(randomFloat() * range + min)
}

function randomIntArray (length, min, max) {
  return new Array(length).fill(0).map(() => randomInt(min, max))
}

// random string based on window.crypto given a string lenght, a specs.min, a specs.max, and an array of chars to choose from
function generateRandomString (stringLength, specs) {
  let randomStringAsArray = randomIntArray(stringLength, specs.min, specs.max)
  randomStringAsArray = randomStringAsArray.map(dec => {
    const randomIndex = randomInt(0, specs.chars.length - 1)
    return specs.chars[randomIndex]
  })
  return randomStringAsArray.join('')
}

// function sha256 (plain) {
//   const encoder = new TextEncoder()
//   const data = encoder.encode(plain)
//   return window.crypto.subtle.digest('SHA-256', data)
// }

// function base64urlencode (str) {
//   return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
//     .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
// }

// async function pkceChallengeFromVerifier (v) {
//   const hashed = await sha256(v)
//   return base64urlencode(hashed)
// }

/**************************************************************
 * FORMATTING UTILS FUNCTIONS
 */
function objectToFormData (data) {
  const formData = new FormData()
  for (const name in data) {
    formData.append(name, data[name])
  }
  return formData
}

/**************************************************************
 * MAIN OAUTH CLASS
 */
class OAuthLib {
  /**************************************************************
   * Initialization
   */
  constructor (options, store) {
    this.store = store
    this.storeModuleName = options.storeModuleName
    // console.log('>>> OAuthLib > init >  store :', store)

    // set OAUTH clientId - both in class and vuex module
    this.clientId = options.clientId
    this.clientSecret = options.clientSecret
    this.store.commit(`${this.storeModuleName}/setClientId`, this.clientId)
    this.store.commit(`${this.storeModuleName}/setClientSecret`, this.clientSecret)

    // set OAUTH main urls - both in class and vuex module
    this.oauthServer = options.oauthServer
    this.authPath = options.authPath || '/authorize'
    this.tokenPath = options.tokenPath || '/token'
    this.revokePath = options.revokePath || '/revoke'
    this.redirect = options.oauthRedirect || '/login'

    this.redirectHomeURI = encodeURIComponent(`${this._getBaseUrl()}`)
    this.redirectURL = `${this._getBaseUrl()}${this.redirect}`
    this.redirectURI = encodeURIComponent(`${this.redirectURL}`)

    this.store.commit(`${this.storeModuleName}/setOauthRedirect`, this.redirect)
    this.store.commit(`${this.storeModuleName}/setOauthRedirectURI`, this.redirectURI)

    // set OAUTH options
    this.oauthFlow = options.oauthFlow || 'pkce' // could be pkce | auth_code | implicit
    this.oauthScope = options.oauthScope || 'default'

    // set OAUTH localStorage object names : state | code_verifier | access_token | refresh_token
    this.prefix = options.localStoragePrefix || ''

    this.stateName = `${this.prefix}State`
    this.codeVerifierName = `${this.prefix}CodeVerifier`

    // set names
    this.oauthAccessTokenName = `${this.prefix}AccessToken`
    this.oauthRefreshTokenName = `${this.prefix}RefreshToken`
    this.oauthExpiresName = `${this.prefix}AccessTokenExpires`
    this.oauthTokenTypeName = `${this.prefix}TokenType`

    // set names in store
    this.store.commit(`${this.storeModuleName}/setTokenName`, { type: 'access', name: this.oauthAccessTokenName })
    this.store.commit(`${this.storeModuleName}/setTokenName`, { type: 'refresh', name: this.oauthRefreshTokenName })
    this.store.commit(`${this.storeModuleName}/setTokenName`, { type: 'expires', name: this.oauthExpiresName })
    this.store.commit(`${this.storeModuleName}/setTokenName`, { type: 'type', name: this.oauthTokenTypeName })

    // set flowSpecs
    this.flowSpecs = flowsMinMax[this.oauthFlow]

    // debugging
    console.log('>>> OAuthLib > init >  this :', this)
  }

  /**************************************************************
   * Basic utils
   */
  _getBaseUrl () {
    const port = window.location.port
    return window.location.protocol + '//' + window.location.hostname + (port ? ':' + port : '')
  }

  createNewState () {
    // create a state to be challenged, depending on workflow's specs
    const stateLength = randomInt(this.flowSpecs.state.min, this.flowSpecs.state.max)
    const state = generateRandomString(stateLength, this.flowSpecs.state)
    localStorage[this.stateName] = state
    return state
  }

  createBasicAuthHeader () {
    const headerStr = btoa(`${this.clientId}:${this.clientSecret}`)
    return { Authorization: `Basic ${headerStr}` }
  }

  /**************************************************************
   * Utils for localStorage
   */
  getStateFromLocalStorage () {
    return localStorage[this.stateName]
  }

  getCodeVerifierFromLocalStorage () {
    return localStorage[this.codeVerifierName]
  }

  getTokensFromLocalStorage () {
    // tokens from localStorage
    return {
      accesToken: localStorage[this.oauthAccessTokenName],
      refreshToken: localStorage[this.oauthRefreshTokenName],
      expiresIn: localStorage[this.oauthExpiresName],
      tokenType: localStorage[this.oauthTokenTypeName]
    }
  }

  async clearLocalStorageFromLoginParams () {
    // reset localStorage from state and code verifier only used in login workflow
    delete localStorage[this.stateName]
    delete localStorage[this.codeVerifierName]
  }

  async clearLocalStorageFromTokens () {
    // reset localStorage from tokens
    delete localStorage[this.oauthAccessTokenName]
    delete localStorage[this.oauthRefreshTokenName]
    delete localStorage[this.oauthExpiresName]
    delete localStorage[this.oauthTokenTypeName]
  }

  // >>> TODO: handle expiration
  isAuthenticatedInLocalStorage () {
    return !!localStorage[this.oauthAccessTokenName]
  }

  isAuthenticatedInStore () {
    return !!this.store.getters.isAuthenticated
  }

  /**************************************************************
   * WORKFLOWS OBJECTS AND STRATEGIES
  */

  /**************************************************************
   * Create a login workflow
   */
  async buildLoginWorkflowObject (clientId, state) {
    // console.log('>>> OAuthLib > buildLoginWorkflowObject >  clientId :', clientId)
    // console.log('>>> OAuthLib > buildLoginWorkflowObject >  redirectURI :', redirectURI)
    const encodedState = encodeURIComponent(state)
    const wf = {
      flow: this.oauthFlow,
      oauthLogin: `${this.oauthServer}${this.authPath}?`,
      stringsLogin: {
        stateString: `state=${encodedState}`,
        clientIdString: `client_id=${clientId}`,
        scopeString: `scope=${this.oauthScope}`,
        redirectUri: `redirect_uri=${this.redirectURI}`,
        respTypeString: 'response_type=token'
      },
      loginUrlString: ''
    }

    // declare some vars
    let codeVerifier, codeChallenge

    switch (this.oauthFlow) {
      case 'pkce':
        wf.stringsLogin.respTypeString = 'response_type=code'

        // generate code verifier and code challenge
        wf.stringsLogin.codeChallengeMethod = 'code_challenge_method=S256'
        var pkcePair = create()
        codeVerifier = pkcePair.codeVerifier
        codeChallenge = pkcePair.codeChallenge
        localStorage[this.codeVerifierName] = codeVerifier
        wf.stringsLogin.codeChallenge = `code_challenge=${encodeURIComponent(codeChallenge)}`
        break
    }

    // build login url as concatenated string
    wf.loginUrlString = `${wf.oauthLogin}${Object.values(wf.stringsLogin).join('&')}`

    // return workflow data
    const partialWorkflow = (({ loginUrlString }) => ({ loginUrlString }))(wf)
    return partialWorkflow
  }

  /**
   * Launches the login workflow
   */
  async login (clientId) {
    if (clientId) { this.clientId = clientId }
    console.log('>>> OAuthLib > login >  this.clientId :', this.clientId)

    // create a new state to send in request and store for later checks
    await this.clearLocalStorageFromLoginParams()
    const state = this.createNewState()

    // build the workflow data object
    const workflowData = await this.buildLoginWorkflowObject(this.clientId, state)
    console.log('>>> OAuthLib > login >  workflowData :', workflowData)
    console.log('>>> OAuthLib > login >  workflowData.loginUrlStrings :', workflowData.loginUrlString)

    // open authorization url in browser
    window.location = workflowData.loginUrlString
  }

  /**************************************************************
   * LOGIN
   * Handle the response from the login workflow
   */
  async buildAuthWorkflowObject (clientId, state, code) {
    // console.log('>>> OAuthLib > buildAuthWorkflowObject >  clientId :', clientId)
    const wf = {
      flow: this.oauthFlow,
      oauthExchangeUrl: '',
      oauthExchangeData: {}
    }

    // declare some vars
    const codeVerifier = this.getCodeVerifierFromLocalStorage()

    // set exchange callbacks common vars
    wf.oauthExchangeUrl = `${this.oauthServer}${this.tokenPath}`
    const payload = {
      grant_type: 'authorization_code',
      client_id: `${this.clientId}`,
      client_secret: `${this.clientSecret}`,
      code: `${code}`,
      code_verifier: `${codeVerifier}`,
      redirect_uri: `${this.redirectURL}`
    }
    // wf.oauthExchangeData = JSON.stringify(payload)
    wf.oauthExchangeData = payload

    // return workflow data
    const partialWorkflow = (({ oauthExchangeUrl, oauthExchangeData }) => ({ oauthExchangeUrl, oauthExchangeData }))(wf)
    return partialWorkflow
  }

  async retrieveToken () {
    const state = this.getStateFromLocalStorage()
    console.log('>>> OAuthLib > retrieveToken >  state :', state)

    // build the query dict
    const queryObject = {}
    window.location.search.substr(1).split('&').forEach(item => {
      queryObject[item.split('=')[0]] = item.split('=')[1]
    })
    console.log('>>> OAuthLib > retrieveToken > queryObject :', queryObject)

    if (!queryObject || !queryObject.state || !queryObject.code) return { error: 'we got nothing in queryObject' }

    // check state from url against workflow.sate
    const areStatesSame = queryObject.state === state
    if (!areStatesSame) {
      // window.alert('>>> OAuthLib > retrieveToken >  states are not the same ')
      return { error: 'states are not the same' }
    } else {
      console.log('>>> OAuthLib > retrieveToken >  states are the same ... continue')
    }

    // declare some empty vars
    const code = queryObject.code
    const workflowData = await this.buildAuthWorkflowObject(this.clientId, state, code)
    const exchangeUrl = workflowData.oauthExchangeUrl
    const exchangeData = workflowData.oauthExchangeData
    console.log('>>> OAuthLib > retrieveToken > workflowData :', workflowData)

    let accessToken, refreshToken, expiresIn, tokenType

    // extract code from response
    if (this.flowSpecs.needExchange) {
      // for : pkce | authorisation_code
      // need to fetch a new response
      console.log('>>> OAuthLib > retrieveToken > needExchange == true ...')
      const config = {
        method: 'POST',
        // headers: basicHeaders,
        // body: JSON.stringify(exchangeData)
        body: objectToFormData(exchangeData)
      }
      console.log('>>> OAuthLib > retrieveToken > config :', config)

      const response = await fetch(exchangeUrl, config)
      const data = await response.json()
      console.log('>>> OAuthLib > retrieveToken > data :', data)

      accessToken = data.access_token
      refreshToken = data.refresh_token
      expiresIn = data.expires_in
      tokenType = data.token_type

      this.clearLocalStorageFromLoginParams()
    } else {
      // for : implicit
      // to deprecate once we are sure to prohibit this workflow
      accessToken = queryObject.access_token
      refreshToken = queryObject.refresh_token
      expiresIn = queryObject.expires_in
      tokenType = queryObject.token_type
    }

    // set localStorage
    localStorage[this.oauthAccessTokenName] = accessToken
    localStorage[this.oauthRefreshTokenName] = refreshToken
    localStorage[this.oauthExpiresName] = expiresIn
    localStorage[this.oauthTokenTypeName] = tokenType

    // set oauth vue store values
    this.store.commit(`${this.storeModuleName}/setToken`, { type: 'type', token: tokenType })
    this.store.commit(`${this.storeModuleName}/setToken`, { type: 'expires', token: expiresIn })
    this.store.commit(`${this.storeModuleName}/setToken`, { type: 'access', token: accessToken })
    this.store.commit(`${this.storeModuleName}/setToken`, { type: 'refresh', token: refreshToken })
  }

  /**************************************************************
   * Logout related
   */
  async logout () {
    const revokeUrl = `${this.oauthServer}${this.revokePath}`
    console.log('>>> OAuthLib > logout >  revokeUrl :', revokeUrl)
    const revokeData = {
      token: localStorage[this.oauthAccessTokenName]
      // token_type_hint: 'access_token',
    }
    const config = {
      method: 'POST',
      // headers: basicHeaders,
      headers: this.createBasicAuthHeader(),
      // body: JSON.stringify(data)
      body: objectToFormData(revokeData)
    }
    try {
      const response = await fetch(revokeUrl, config)
      console.log('>>> OAuthLib > logout >  response :', response)
      return response
    } catch (error) {
      console.log('error', error)
    } finally {
      console.log('>>> OAuthLib > logout >  finally ...')
      await this.clearLocalStorageFromLoginParams()
      await this.clearLocalStorageFromTokens()
      this.store.commit(`${this.storeModuleName}/resetTokens`)
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
    oauthServer: process.env.VUE_APP_OAUTH_SERVER,
    oauthFlow: process.env.VUE_APP_OAUTH_FLOW,
    oauthScope: process.env.VUE_APP_OAUTH_SCOPE,

    clientId: undefined,
    clientSecret: undefined,
    oauthRedirect: undefined,

    tokens: {
      type: { name: '', value: undefined },
      expires: { name: '', value: undefined },
      access: { name: '', value: undefined },
      refresh: { name: '', value: undefined }
    }

  }),
  getters: {
    isAuthenticated: (state) => {
      return !!(state.tokens.access && state.tokens.access.value)
    },
    getTokenValue: (state) => (name) => {
      return state.tokens[name].value
    }
  },
  mutations: {

    // client-related
    setClientState (state, clientState) {
      state.clientState = clientState
    },
    setClientId (state, clientId) {
      state.clientId = clientId
    },
    setClientSecret (state, clientSecret) {
      state.clientSecret = clientSecret
    },

    // redirection
    setOauthRedirect (state, oauthRedirect) {
      state.oauthRedirect = oauthRedirect
    },
    setOauthRedirectURI (state, oauthRedirectURI) {
      state.oauthRedirectURI = oauthRedirectURI
    },

    // token-related
    setTokenName (state, { type, name }) {
      state.tokens[type].name = name
    },
    setToken (state, { type, token }) {
      state.tokens[type].value = token
    },
    resetTokens (state) {
      state.tokens = {
        type: { name: '', value: undefined },
        expires: { name: '', value: undefined },
        access: { name: '', value: undefined },
        refresh: { name: '', value: undefined }
      }
    }
  },
  actions: {},
  modules: {}
}

/**************************************************************
 * OAUTH CLIENT - PLUGIN FOR VUE
 */
// wrap up client
const OAUTHcli = {
  install (Vue, options, store) {
    // register namespaced store
    const moduleName = options.storeModuleName ? options.storeModuleName : 'oauth'
    options.storeModuleName = moduleName
    store.registerModule(moduleName, moduleAuth)

    // declare client as a global prototype in Vue
    Vue.prototype.$OAUTHcli = new OAuthLib(options, store)
  }
}
export default OAUTHcli

// // Automatic installation if Vue has been added to the global scope.
// if (typeof window !== 'undefined' && window.Vue) {
//   window.Vue.use(OAUTHcli)
// }
