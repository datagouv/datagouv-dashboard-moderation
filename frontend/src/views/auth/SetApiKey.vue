<template>

  <div class="set-api-key">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

    <h2>
      Set your udata API key
    </h2>

    <!-- API KEY FORM -->
    <b-card
      class="mx-auto text-center"
      style="width: 700px;"
      header="Set your API key form"
      >

      <b-form @submit="setApiKeyHeader" inline class="text-center">

        <!-- API KEY -->
        <label class="sr-only" for="inline-form-input-api-key">
          API key
        </label>
        <b-input-group
          class="mb-2 mr-sm-2 mb-sm-0"
          >
          <b-input
            id="inline-form-input-api-key"
            v-model="form.apiKey"
            placeholder="your api key"
          >
          </b-input>
        </b-input-group>

        <b-button type="submit" variant="success">
          <b-icon icon="box-arrow-in-right" aria-hidden="true"></b-icon>
          Set your API key
        </b-button>

      </b-form>

      <br>

      <b-form @submit="setBearerHeader" inline class="text-center">

        <!-- BEARER HEADER -->
        <label class="sr-only" for="inline-form-input-api-key">
          Bearer token
        </label>
        <b-input-group
          class="mb-2 mr-sm-2 mb-sm-0"
          >
          <b-input
            id="inline-form-input-api-key"
            v-model="form.bearerToken"
            placeholder="your bearer token"
          >
          </b-input>
        </b-input-group>

        <b-button type="submit" variant="success">
          <b-icon icon="box-arrow-in-right" aria-hidden="true"></b-icon>
          Set your Bearer token
        </b-button>

      </b-form>

    </b-card>

    <hr>
    <b-card
      class="mt-3 mx-auto text-center"
      style="width: 600px;"
      header="Form Data"
      >
      <pre class="m-0">{{ form }}</pre>
    </b-card>

    <hr>

    <!-- RESPONSE -->
    <b-card
      class="mt-3 mx-auto text-center"
      style="width: 600px;"
      header="Set API key response"
      >
      <code>
        {{setResponse}}
      </code>
    </b-card>

  </div>
</template>

<script>

import { mapState } from 'vuex'

export default {
  name: 'SetApiKey',
  data () {
    return {
      form: {
        apiKey: '',
        bearerToken: ''
      },
      setResponse: '(apiKey not stored yet)',
      crumbs: [
        {
          text: this.$t('home.name'),
          to: '/'
        },
        // {
        //   text: 'OAuth',
        //   to: '/'
        // },
        {
          text: this.$t('auth.setApiToken'),
          active: true
        }
      ]
    }
  },
  created () {
    
    this.form.apiKey = this.options.apiKey
    this.form.bearerToken = this.tokens.access && this.tokens.access.value
  },
  computed: {
    ...mapState({
      log: (state) => state.global.log,

      specs: (state) => state.swagwrap.specs,
      options: (state) => state.swagwrap.options,

      // loginUrl: (state) => state.oauth.loginUrl,
      // authUrl: (state) => state.oauth.authUrl,
      // logoutUrl: (state) => state.oauth.logoutUrl,
      tokens: (state) => state.oauth.tokens

    })
  },
  methods: {
    setApiKeyHeader (evt) {
      evt.preventDefault()
      
      const cliAuthOptions = { apiKey: this.form.apiKey }
      this.$APIcli.resetCli(cliAuthOptions)
      this.setResponse = 'your API key was updated in $APIcli'
    },
    setBearerHeader (evt) {
      evt.preventDefault()
      
      const cliAuthOptions = {
        bearerAuth: this.form.bearerToken,
        clientId: process.env.VUE_APP_DEFAULT_CLIENT_ID,
        clientSecret: process.env.VUE_APP_DEFAULT_CLIENT_SECRET
      }
      this.$APIcli.resetCli(cliAuthOptions)
      this.setResponse = 'your Header key was updated in $APIcli'
    }
  }
}

</script>
