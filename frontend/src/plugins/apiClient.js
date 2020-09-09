// npm package : swag-wrap

import SwaggerClient from 'swagger-client'

class SwagCli {
  constructor (options, store) {
    this.store = store
    this.storeModuleName = options.storeModuleName
    this.store && this.store.commit(`${this.storeModuleName}/setOptions`, options)

    // retrieve spec from options
    this.spec = options.swaggerUrl
    

    // instantiate client
    this.resetCli(options)

    // set up security definitions
    // this.security = undefined
    // this._setSecurity()
  }

  buildSpecAndAuth (options) {
    // create swagger client from spec
    const specAndAuth = { url: this.spec }

    // add auth to spec if necessary
    if (options.apiKey) {
      specAndAuth.authorizationHeader = {
        'X-API-KEY': options.apiKey
      }
    }
    if (options.bearerAuth) {
      specAndAuth.authorizationHeader = {
        Authorization: `Bearer ${options.bearerAuth}`
      }
    }
    // if (options.userPassword) {
    //   specAndAuth.authorizationHeader = { BasicAuth: { username: options.userName, password: options.userPassword } }
    // }
    // if (options.token) {
    //   specAndAuth.authorizationHeader = { oAuth2: { token: { access_token: options.token } } }
    // }
    if (options.rawHeader) {
      specAndAuth.authorizationHeader = options.rawHeader
    }
    return specAndAuth
  }

  resetCli (authOptions) {
    
    this.specAndAuth = this.buildSpecAndAuth(authOptions)
    
    // Activate CORS or not
    // if (authOptions.activateCORS) {
    //   SwaggerClient.http.withCredentials = true
    // }
    this.setSpecsInStore()
    this.cli = new SwaggerClient(this.specAndAuth)
  }

  setSpecsInStore () {
    
    this.store && this.store.commit(`${this.storeModuleName}/setSpecs`, this.specAndAuth)
  }

  // _setSecurity () {
  //   // cf : https://github.com/swagger-api/swagger-js/blob/HEAD/docs/usage/http-client.md
  //   
  //   return this.cli.then(
  //     client => {
  //       
  //       this.security = client.spec.securityDefinitions
  //     }
  //   )
  // }

  _requestInterceptor (req, needAuth) {
    // swagger client request interceptor
    const authHeader = this.specAndAuth.authorizationHeader
    

    // update request's headers => append authorization header if needAuth == true
    req.headers = needAuth ? { ...req.headers, ...authHeader } : req.headers

    // update request's mode
    // req.mode = needAuth ? 'cors' : 'same-origin'
    // req.mode = 'cors'

    // update request's credentials
    // req.credentials = needAuth ? 'include' : 'same-origin' // include | same-origin | omit
    // req.credentials = this.specAndAuth.credentials || 'same-origin'

    
    return req
  }

  _request (operationId, { params, body, needAuth } = {}) {
    // main request function
    // arg :: operationId : string / endpoint's operation ID
    return this.cli.then(
      // once client is ready trigger the api's path
      client => {
        
        // get endpoint by resolving endpoint's path in client.apis
        
        
        // params && console.log('>>> SwagCli > _request >> params : ', params)
        // body && console.log('>>> SwagCli > _request >> body : ', body)

        // build request
        let request = {
          operationId: operationId,
          requestInterceptor: req => this._requestInterceptor(req, needAuth)
        }
        request = params ? { ...request, parameters: params } : request
        request = body ? { ...request, body: body } : request
        

        // execute request
        const endpoint = client.execute(request)
        return endpoint
      },
      reason => console.error('>>> SwagCli > _request >> failed to execute the request : ' + reason)
    )
  }
}

// vue store module within plugin just for auth
export const moduleApiClient = {
  namespaced: true,
  state: () => ({
    options: undefined,
    specs: undefined
  }),
  getters: {},
  mutations: {
    setOptions (state, options) {
      state.options = options
    },
    setSpecs (state, specs) {
      state.specs = specs
    }
  },
  actions: {},
  modules: {}
}

const APIcli = {
  install (Vue, options, store) {
    // register namespaced store if necessary
    const moduleName = options.storeModuleName ? options.storeModuleName : 'swagwrap'
    options.storeModuleName = moduleName

    if (options.registerApiStore && store) {
      store.registerModule(moduleName, moduleApiClient)
    }

    // declare client as a global prototype in Vue
    Vue.prototype.$APIcli = new SwagCli(options, store)
  }
}
export default APIcli

// // Automatic installation if Vue has been added to the global scope.
// if (typeof window !== 'undefined' && window.Vue) {
//   window.Vue.use(APIcli)
// }
