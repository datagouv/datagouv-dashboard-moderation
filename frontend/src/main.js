import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import axios from 'axios'
import VueAxios from 'vue-axios'

import VueI18n from 'vue-i18n'
import fr from './locales/fr.js'
import en from './locales/en.js'

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import './css/custom.scss'
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

import Utils from './plugins/utils.js'
import MakeRespToast from './plugins/makeRespToasts.js'

import MODERATIONcli from './plugins/apiModeration.js'

// import APIcli from '@julpy/swag-wrap'
import APIcli from './plugins/apiClient.js'

// import OAUTHcli from '@julpy/oauth2-connect'
import OAUTHcli from './plugins/apiAuth.js'

const isDevMode = Boolean(process.env.VUE_APP_DEV_MODE)

const moderationOptions = {
  storeModuleName: 'moderation',
  moderationServer: isDevMode ? process.env.VUE_APP_MODERATION_API_DEV : process.env.VUE_APP_MODERATION_API
}

const swagWrapOptions = {
  registerApiStore: true,
  storeModuleName: 'swagwrap',
  activateCORS: false,
  swaggerUrl: process.env.VUE_APP_SWAGGER_URL,
  apiKey: isDevMode && process.env.VUE_APP_API_KEY
}

const oauthOptions = {
  storeModuleName: 'oauth',

  clientId: process.env.VUE_APP_DEFAULT_CLIENT_ID,
  clientSecret: process.env.VUE_APP_DEFAULT_CLIENT_SECRET,

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

// use other custom plugin
Vue.use(Utils, {})
Vue.use(MakeRespToast, {})

// use MODERATIONcli plugin
Vue.use(MODERATIONcli, moderationOptions, store)

// use APIcli plugin
Vue.use(APIcli, swagWrapOptions, store)

// use OAUTHcli plugin
Vue.use(OAUTHcli, oauthOptions, store)

// use i18n
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'fr',
  fallbackLocale: 'fr',
  messages: {
    ...fr,
    ...en
  }
})

Vue.config.productionTip = false

// build up vue instance
new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
