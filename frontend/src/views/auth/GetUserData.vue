<template>

  <div class="get-user-data">

    <NavCrumbs
      :crumbs="crumbs"
      :hideBackBtn="true"
    />

    <h2 class="mt-5">
      {{$t('settings.getUserData')}}
    </h2>

    <h3 v-if="isLoading" class="mt-3">
      {{$t('actions.wait')}}<br>
    </h3>

    <p v-if="isLoading" class="py-5 my-5">
      <custom-spinner/>
    </p>

    {{$t('basics.redirection')}}
    <code>
      {{redirection}}
    </code>

    <!-- <b-card
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
    </b-card> -->

  </div>
</template>

<script>
import { mapState } from 'vuex'

import NavCrumbs from '@/components/ux/NavCrumbs.vue'

export default {
  name: 'GetUserData',
  components: {
    NavCrumbs
  },
  data () {
    return {
      isLoading: false,
      operationId: 'get_me',
      redirection: this.$route.query.redirect,
      // user: undefined,
      crumbs: [
        {
          text: this.$t('home.name'),
          to: '/'
        },
        {
          text: this.$t('settings.getUserData'),
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
