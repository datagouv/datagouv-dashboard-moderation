<template>

  <div class="">

    <NavCrumbs
      :crumbs="crumbs"
      :hideBackBtn="true"
    />

    <h2>
      {{ $t('settings.logIn') }}
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

import NavCrumbs from '@/components/ux/NavCrumbs.vue'

export default {
  name: 'Login',
  components: {
    NavCrumbs
  },
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
          text: this.$t('home.name'),
          to: '/'
        },
        {
          text: this.$t('settings.logIn'),
          active: true
        }
      ]
    }
  },
  created () {
    // this.localStorageContainer.state = localStorage.dgfState
    // this.localStorageContainer.codeVerifier = localStorage.dgfCodeVerifier
  },
  async mounted () {
    this.isLoading = true
    try {
      this.loginResponse = 'we are requesting your tokens to the oauth server... please wait'
      const resp = await this.$OAUTHcli.retrieveToken()
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
      this.$APIcli.resetCli(authOptions)
      this.loginResponse = `your token '${this.tokens.access.value}' is now set...`
      // log into moderation API
      const loginModerationResponse = await this.$MODERATIONcli.login(this.tokens.access.value)
      console.log('-V- Login > updateModeration > loginModerationResponse : ', loginModerationResponse)
      await this.makeToast(loginModerationResponse)
      this.$router.push(`/get-user-data?redirect=${this.redirection}`)
    } catch (ex) {
      await this.makeToast(ex)
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
  },
  methods: {
    async makeToast (loginModerationResponse) {
      console.log('-V- Login > makeToast > loginModerationResponse : ', loginModerationResponse)
      const h = this.$createElement
      const variant = loginModerationResponse.status && loginModerationResponse.status === 200 ? 'success' : 'danger'
      const title = loginModerationResponse.status && loginModerationResponse.status === 200 ? 'success' : 'error'
      const msg = loginModerationResponse.status && loginModerationResponse.status === 200 ? 'ok msg' : this.$t('toastsModeration.errorTxt', { code: loginModerationResponse.status })

      const vNodesTitle = h(
        'div',
        { class: ['d-flex', 'flex-grow-1', 'align-items-baseline', 'ml-2'] },
        [
          h('strong', { class: ['mr-2', 'text-center'] }, this.$t(`toastsModeration.${title}`))
        ]
      )
      const vNodesMsg = h(
        'p',
        { class: ['text-center', 'my-2'] },
        [
          h('strong', msg)
        ]
      )
      console.log('-V- Login > makeToast > vNodesTitle : ', vNodesTitle)

      this.$bvToast.toast([vNodesMsg], {
        title: [vNodesTitle],
        variant: variant,
        solid: true
      })
    }
  }
}

</script>
