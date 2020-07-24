import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import axios from 'axios'
import VueAxios from 'vue-axios'

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// import APIcli from '@julpy/swag-wrap'
import APIcli from './plugins/apiClient.js'

// import OAUTHcli from '@julpy/oauth2-connect'
import OAUTHcli from './plugins/apiAuth.js'

const dotenv = require('dotenv')
dotenv.config()

const isDevMode = Boolean(process.env.VUE_APP_DEV_MODE)

const swagWrapOptions = {
  registerApiStore: true,
  storeModuleName: 'swagwrap',
  activateCORS: false,
  swaggerUrl: process.env.VUE_APP_SWAGGER_URL,
  apiKey: isDevMode && process.env.VUE_APP_API_KEY
}

const oauthOptions = {
  storeModuleName: 'oauth',

  clientId: isDevMode && process.env.VUE_APP_DEFAULT_CLIENT_ID,
  clientSecret: isDevMode && process.env.VUE_APP_DEFAULT_CLIENT_SECRET,

  oauthServer: process.env.VUE_APP_OAUTH_SERVER,
  oauthFlow: process.env.VUE_APP_OAUTH_FLOW,
  oauthScope: process.env.VUE_APP_OAUTH_SCOPE,
  oauthRedirect: process.env.VUE_APP_OAUTH_REDIRECT,

  localStoragePrefix: process.env.VUE_APP_OAUTH_LS_PREFIX
}

// use axios as http client
Vue.use(VueAxios, axios)

// use Bootstrap as CSS framework
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

// use APIcli plugin
Vue.use(APIcli, swagWrapOptions, store)

// use OAUTHcli plugin
Vue.use(OAUTHcli, oauthOptions, store)

Vue.config.productionTip = false

// build up vue instance
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
