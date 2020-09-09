<template>

  <div class="">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

    <h2>
      Login with Client ID
    </h2>

    <!-- LOGIN FORM -->
    <b-card
      v-if="!isLoading"
      class="mx-auto text-center"
      style="width: 700px;"
      header="Login client ID form"
      >

      <b-form @submit="submitLogin" inline class="text-center">

        <!-- CLIENT ID -->
        <label class="sr-only" for="inline-form-input-client-id">
          Client ID
        </label>
        <b-input-group
          class="mb-2 mr-sm-2 mb-sm-0"
          >
          <b-input
            id="inline-form-input-client-id"
            v-model="oauthVars.clientId"
            placeholder="OAuth Client ID"
          >
          </b-input>
        </b-input-group>

        <b-button type="submit" variant="success">
          <b-icon icon="box-arrow-in-right" aria-hidden="true"></b-icon>
          Log in with Client ID
        </b-button>
        &nbsp;
        <b-button @click="submitLogout" variant="warning">
          <b-icon icon="box-arrow-right" aria-hidden="true"></b-icon>
          Log out
        </b-button>

      </b-form>
    </b-card>
    <div v-else>
      <br>
      <h3 v-html="isLoadingMessage">
      </h3>
      <br>
    </div>

    <hr>
    <b-card
      class="mt-3 mx-auto text-center"
      style="width: 600px;"
      header="oauthVars for OAuth login"
      >
      <pre class="m-0">
        {{ oauthVars }}
      </pre>
    </b-card>

  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AuthorizeClientId',
  data () {
    return {
      isLoading: false,
      isLoadingMessage: 'you are being redirected to the OAuth server for authentication...<br> please wait...',
      oauthVars: {
        clientId: '',
        clientSecret: '',
        oauthRedirect: '',
        oauthRedirectURI: '',
        oauthServer: '',
        oauthFlow: '',
        oauthScope: '',
        oauthAccessTokenName: '',
        oauthRefreshTokenName: ''
      },
      crumbs: [
        {
          text: 'Home',
          to: '/'
        },
        {
          text: 'AuthorizeClientId',
          active: true
        }
      ]
    }
  },
  created () {
    // console.log('-V- AUTHORIZE_CLIENT_ID > created ...')
    this.oauthVars.clientId = this.clientId
    this.oauthVars.clientSecret = this.clientSecret
    this.oauthVars.oauthRedirect = this.oauthRedirect
    this.oauthVars.oauthRedirectURI = this.oauthRedirectURI
    this.oauthVars.oauthServer = this.oauthServer
    this.oauthVars.oauthFlow = this.oauthFlow
    this.oauthVars.oauthScope = this.oauthScope
    this.oauthVars.oauthTokens = this.oauthTokens
  },
  computed: {
    ...mapState({
      log: (state) => state.global.log,

      oauthServer: (state) => state.oauth.oauthServer,
      oauthFlow: (state) => state.oauth.oauthFlow,
      oauthScope: (state) => state.oauth.oauthScope,

      clientId: (state) => state.oauth.clientId,
      clientSecret: (state) => state.oauth.clientSecret,

      oauthRedirect: (state) => state.oauth.oauthRedirect,
      oauthRedirectURI: (state) => state.oauth.oauthRedirectURI,
      oauthTokens: (state) => state.oauth.tokens
    })
  },
  methods: {
    async submitLogin (evt) {
      evt.preventDefault()
      // console.log('\n-V- AUTHORIZE_CLIENT_ID > submitLogin > this.oauthVars :', this.oauthVars)

      // login with OAUTH
      this.isLoading = true
      this.$OAUTHcli.login(this.oauthVars.clientId)
    },
    async submitLogout (evt) {
      evt.preventDefault()
      // console.log('\n-V- AUTHORIZE_CLIENT_ID > submitLogout > ...')
      this.isLoading = true
      await this.$OAUTHcli.logout()
      this.isLoading = false
    }
  }
}

</script>
