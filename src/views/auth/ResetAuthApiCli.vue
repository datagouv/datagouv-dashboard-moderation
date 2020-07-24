<template>

  <div class="">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

    <h2>
      Reset API client
    </h2>

    <h3 v-if="isLoading">
      <b-spinner label="loading"></b-spinner>
    </h3>

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
  name: 'ResetApiCli',
  data () {
    return {
      isLoading: false,
      redirection: this.$route.query.redirect,
      loginResponse: '(tokens are being requested from oauth store)',
      crumbs: [
        {
          text: 'Home',
          to: '/'
        },
        {
          text: 'Reset API client',
          active: true
        }
      ]
    }
  },
  async mounted () {
    console.log('-V- ResetAuthApiCli > mounted ...')
    console.log('-V- ResetAuthApiCli > this.$route :', this.$route)
    console.log('-V- ResetAuthApiCli > this.$route.query.redirect :', this.$route.query.redirect)
    this.isLoading = true
    try {
      const authOptions = {
        bearerAuth: this.tokens.access.value
      }
      console.log('-V- ResetAuthApiCli > created > authOptions :', authOptions)
      this.$APIcli.resetCli(authOptions)
      this.loginResponse = `your token '${this.tokens.access.value}' is now set...`
      this.$router.push(this.redirection)
    } catch (ex) {
      console.log('error', ex)
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
}

</script>
