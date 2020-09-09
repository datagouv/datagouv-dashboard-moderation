<template>

  <div class="get-user-data">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

    <h2>
      {{$t('settings.getUserData')}}
    </h2>

    <h3 v-if="isLoading" class="mt-3">
      {{$t('actions.wait')}}<br>
      <b-spinner label="loading"></b-spinner>
    </h3>

    {{$t('basics.redirection')}}
    <code>
      {{redirection}}
    </code>

    <b-card
      class="mt-3 mx-auto text-center"
      style="width: 600px;"
      v-if="!isLoading"
      >
      <hr>
      {{$t('basics.user')}}
      (store) :
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
