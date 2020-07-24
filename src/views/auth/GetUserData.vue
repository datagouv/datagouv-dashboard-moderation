<template>

  <div class="get-user-data">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

    <h2>
      Get your user data
    </h2>

    <h3 v-if="isLoading">
      <b-spinner label="loading"></b-spinner>
    </h3>

    redirection :
    <code>
      {{redirection}}
    </code>

    <!-- RESPONSE USER -->
    <b-card
      class="mt-3 mx-auto text-center"
      style="width: 600px;"
      v-if="!isLoading"
      >
      <!-- user (component) :
      <code>
        {{user}}
      </code> -->
      <hr>
      user (store) :
      <code>
        {{userData}}
      </code>
    </b-card>

  </div>
</template>

<script>

import { mapState } from 'vuex'

export default {
  name: 'GetUserData',
  data () {
    return {
      isLoading: false,
      operationId: 'get_me',
      redirection: this.$route.query.redirect,
      // user: undefined,
      crumbs: [
        {
          text: 'Home',
          to: '/'
        },
        {
          text: 'Get your user data',
          active: true
        }
      ]
    }
  },
  created () {
    console.log('-V- GetUserData > created ...')
    this.retrieveUserDataFromCli()
  },
  computed: {
    ...mapState({
      log: (state) => state.global.log,
      tokens: (state) => state.oauth.tokens,
      userData: (state) => state.user.user
    })
  },
  methods: {
    retrieveUserDataFromCli () {
      this.isLoading = true
      this.$APIcli._request(this.operationId, { needAuth: true }).then(
        results => {
          console.log('-V- GetUserData > created > results.body :', results.body)
          this.isLoading = false
          // this.user = results.body
          this.$store.commit('user/setUser', results.body)
          this.$router.push(this.redirection)
        },
        reason => console.error(`-V- GetUserData > failed on api call: ${reason}`)
      )
    }
  }
}

</script>
