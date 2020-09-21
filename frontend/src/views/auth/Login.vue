<template>

  <div class="">

    <NavCrumbs
      :crumbs="crumbs"
      :hideBackBtn="true"
    />

    <div class="mb-5">

      <h2 class="my-5">
        {{ $t('auth.connecting') }}
      </h2>

      <p v-if="isLoading">
        <custom-spinner/>
      </p>

    </div>

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
  async mounted () {
    this.isLoading = true
    try {
      this.loginResponse = 'we are requesting your tokens to the oauth server... please wait'
      const resp = await this.$OAUTHcli.retrieveToken()
      if (resp && resp.error) throw resp.error

      const authOptions = {
        bearerAuth: this.tokens.access.value
      }
      this.$APIcli.resetCli(authOptions)
      this.loginResponse = `your token '${this.tokens.access.value}' is now set...`
      // log into moderation API
      const loginModerationResponse = await this.$MODERATIONcli.login(this.tokens.access.value)
      this.$makeToast(loginModerationResponse, 'user login', 'GET', 'user')
      this.$router.push(`/get-user-data?redirect=${this.redirection}`)
    } catch (ex) {
      this.$makeToast(ex)
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
  methods: {}
}

</script>
