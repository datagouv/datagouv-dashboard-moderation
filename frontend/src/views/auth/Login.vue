<template>

  <div class="">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

    <h2>
      Login
    </h2>

    <h3 v-if="isLoading">
      <b-spinner label="loading"></b-spinner>
    </h3>

    <!-- LOGIN FORM -->
    <!-- <b-card
      class="mx-auto text-center"
      style="width: 700px;"
      header="Login form"
      >
    </b-card> -->

    <!-- <hr>
    <b-card
      class="mt-3 mx-auto text-center"
      style="width: 600px;"
      header="localStorageContainer"
      >
      <pre class="m-0">
        {{ localStorageContainer }}
      </pre>
    </b-card> -->

    <!-- <hr> -->

    <!-- RESPONSE -->
    <b-card
      class="mt-3 mx-auto text-center"
      style="width: 600px;"
      v-if="!isLoading"
      >
      <code>
        {{loginResponse}}
      </code>
    </b-card>

  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Login',
  data () {
    return {
      isLoading: false,
      redirection: '/',
      // localStorageContainer: {
      //   codeVerifier: '',
      //   state: '',
      //   tokenType: '',
      //   accessToken: '',
      //   expires: '',
      //   refreshToken: ''
      // },
      loginResponse: '(tokens are being requested right now to server)',
      crumbs: [
        {
          text: 'Home',
          to: '/'
        },
        {
          text: 'Login',
          active: true
        }
      ]
    }
  },
  created () {
    // console.log('-V- LOGIN > created ...')
    // this.localStorageContainer.state = localStorage.dgfState
    // this.localStorageContainer.codeVerifier = localStorage.dgfCodeVerifier
    // console.log('-V- LOGIN > created > this.tokens :', this.tokens)
  },
  async mounted () {
    // console.log('-V- LOGIN > mounted ...')
    this.isLoading = true
    try {
      this.loginResponse = 'we are requesting your tokens to the oauth server... please wait'
      const resp = await this.$OAUTHcli.retrieveToken()
      // console.log('-V- LOGIN > created > resp :', resp)
      if (resp && resp.error) throw resp.error

      // this.localStorageContainer.accessToken = this.tokens.access.value
      // this.localStorageContainer.refreshToken = this.tokens.refresh.value
      // this.localStorageContainer.tokenType = this.tokens.type.value
      // this.localStorageContainer.expires = this.tokens.expires.value

      // this.localStorageContainer.codeVerifier = 'deleted'
      // this.localStorageContainer.state = 'deleted'

      const authOptions = {
        bearerAuth: this.tokens.access.value
      }
      // console.log('-V- LOGIN > created > authOptions :', authOptions)
      this.$APIcli.resetCli(authOptions)

      this.loginResponse = `your token '${this.tokens.access.value}' is now set...`

      // console.log('-V- LOGIN > created > this.$APIcli.specAndAuth.authorizationHeader :', this.$APIcli.specAndAuth.authorizationHeader)

      // log into moderation API
      await this.$MODERATIONcli.login(this.tokens.access.value)

      this.$router.push(`/get-user-data?redirect=${this.redirection}`)
    } catch (ex) {
      // console.log('error', ex)
      this.loginResponse = `${ex} ... please try to authenticate again`
    } finally {
      this.isLoading = false
    }
  },
  computed: {
    ...mapState({
      log: (state) => state.global.log,
      tokens: (state) => state.oauth.tokens
    })
  }
  // methods: {
  //   async submitLogout (evt) {
  //     evt.preventDefault()
  //     // console.log('\n-V- AUTHORIZE_CLIENT_ID > submitLogout ...')
  //     const response = await this.$OAUTHcli.logout()
  //     // console.log('-V- AUTHORIZE_CLIENT_ID > submitLogout > response :', response)
  //   }
  // }
}

</script>
