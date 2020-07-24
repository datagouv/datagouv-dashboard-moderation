<template>

  <b-navbar
    fixed="top"
    sticky
    toggleable="lg"
    type="dark"
    variant="primary"
    >
    <b-navbar-brand
      to="/"
      >
      Tableau de bord modération datagouv
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>

      <!-- Left aligned nav items -->
      <!-- <b-navbar-nav>
        <b-nav-item href="#">
          Link
        </b-nav-item>
        <b-nav-item href="#" disabled>
          Disabled
        </b-nav-item>
      </b-navbar-nav> -->

      <!-- Center aligned nav items -->
      <b-navbar-nav class="ml-auto" align="center">
        <b-nav-item to="/datasets">
          Datasets
        </b-nav-item>
        <b-nav-item to="/users">
          Users
        </b-nav-item>
        <b-nav-item to="/issues">
          Issues
        </b-nav-item>
        <b-nav-item to="/discussions">
          Discussions
        </b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">

        <!-- SEARCH FORM -->
        <!-- <b-nav-form>
          <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
          <b-button size="sm" class="my-2 my-sm-0" type="submit">
            Search
          </b-button>
        </b-nav-form> -->

        <!-- LOCALES -->
        <!-- <b-nav-item-dropdown text="Lang" right>
          <b-dropdown-item href="#">EN</b-dropdown-item>
          <b-dropdown-item href="#">ES</b-dropdown-item>
          <b-dropdown-item href="#">RU</b-dropdown-item>
          <b-dropdown-item href="#">FA</b-dropdown-item>
        </b-nav-item-dropdown> -->

        <!-- USER -->
        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template v-slot:button-content>
            <em>
              <span v-if="!isLoading">
                <b-icon v-if="isAuthenticated" icon="box-arrow-right" aria-hidden="true"></b-icon>
                <b-icon v-else icon="box-arrow-in-right" aria-hidden="true"></b-icon>
                &nbsp;
                <span>User</span>
              </span>
              <span v-else>
                <b-spinner label="loading"></b-spinner>
              </span>
            </em>
          </template>
          <!-- <b-dropdown-item
            v-if="isAuthenticated"
            to="/login">
            Login
          </b-dropdown-item> -->
          <!-- <b-dropdown-item
            v-if="!isAuthenticated"
            to="/oauth-client-id">
            Authenticate
          </b-dropdown-item> -->
          <b-dropdown-item
            v-if="!isAuthenticated"
            @click="submitLogin()">
            Authenticate
          </b-dropdown-item>
          <!-- <b-dropdown-item
            v-if="isAuthenticated"
            to="/profile">
            Profile
          </b-dropdown-item> -->
          <b-dropdown-item
            v-if="isAuthenticated"
            @click="submitLogout()">
            Log Out
          </b-dropdown-item>
          <b-dropdown-item
            to="/set-api-key">
            Set API key
          </b-dropdown-item>
        </b-nav-item-dropdown>

      </b-navbar-nav>
    </b-collapse>
  </b-navbar>

</template>

<script>
import { mapState, mapGetters } from 'vuex'

// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Navbar',
  components: {
  },
  data () {
    return {
      isLoading: false
    }
  },
  created () {
    console.log('-C- NAVBAR > created ...')
  },
  computed: {
    ...mapState({
      log: (state) => state.global.log,
      clientId: (state) => state.oauth.clientId,
      tokens: (state) => state.oauth.tokens
    }),
    ...mapGetters({
      isAuthenticated: 'oauth/isAuthenticated'
    })
  },
  methods: {
    async submitLogin () {
      console.log('\n-C- NAVBAR > submitLogin ...')
      // login with OAUTH
      this.isLoading = true
      this.$OAUTHcli.login(this.clientId)
    },
    async submitLogout () {
      // evt.preventDefault()
      console.log('\n-C- NAVBAR > submitLogout ...')
      this.isLoading = true
      await this.$OAUTHcli.logout()
      this.isLoading = false
      console.log('-C- NAVBAR > submitLogout > this.$router : ', this.$router)
      console.log('-C- NAVBAR > submitLogout > this.$router.currentRoute : ', this.$router.currentRoute)
      console.log('-C- NAVBAR > submitLogout > this.$route : ', this.$route)
      if (this.$router.currentRoute.path !== '/') {
        this.$router.push('/')
      }
    }
  }
}
</script>
