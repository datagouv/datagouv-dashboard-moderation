<template>
  <div>
    <b-navbar
      fixed="top"
      sticky
      toggleable="lg"
      type="primary"
      variant="white"
      class="light-bottom-border"
      >

      <b-navbar-brand
        to="/"
        >
        <img
          alt="DGF logo"
          class="mr-3"
          src="@/assets/dgf-logo.png"
        />
        {{ $t('navbar.title') }}
      </b-navbar-brand>

      <b-navbar-toggle
        class="ml-auto"
        target="nav-collapse"
        variant="outline-secondary"
        >
        <template v-slot:default="{ expanded }">
          <b-icon v-if="expanded" icon="chevron-bar-up"></b-icon>
          <b-icon v-else icon="chevron-bar-down"></b-icon>
        </template>
      </b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>

        <!-- Center aligned nav items -->
        <b-navbar-nav class="ml-auto" align="center">
          <b-nav-item
            active-class="active-link"
            class="text-capitalize"
            to="/datasets"
            >
            {{ $t('basics.datasets', {list: ''}) }}
          </b-nav-item>
          <b-nav-item
            active-class="active-link"
            class="text-capitalize"
            to="/resources-community"
            >
            {{ $t('basics.resources_community', {list: ''}) }}
          </b-nav-item>
          <b-nav-item
            active-class="active-link"
            class="text-capitalize"
            to="/reuses"
            >
            {{ $t('basics.reuses', {list: ''}) }}
          </b-nav-item>
          <b-nav-item
            active-class="active-link"
            class="text-capitalize"
            to="/users"
            >
            {{ $t('basics.users', {list: ''}) }}
          </b-nav-item>
          <b-nav-item
            active-class="active-link"
            class="text-capitalize"
            to="/organizations"
            >
            {{ $t('basics.organizations', {list: ''}) }}
          </b-nav-item>
          <b-nav-item
            active-class="active-link"
            class="text-capitalize"
            to="/issues"
            >
            {{ $t('basics.issues', {list: ''}) }}
          </b-nav-item>
          <b-nav-item
            active-class="active-link"
            class="text-capitalize"
            to="/discussions"
            >
            {{ $t('basics.discussions', {list: ''}) }}
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

          <!-- USER -->
          <b-nav-item-dropdown right>
            <template v-slot:button-content>
              <em>
                <span v-if="!isLoading">
                  <b-icon v-if="isAuthenticated" icon="person-circle" aria-hidden="true"></b-icon>
                  <b-icon v-else icon="box-arrow-in-right" aria-hidden="true"></b-icon>
                  &nbsp;
                  <span
                    v-if="isAuthenticated"
                    >
                    {{userData && userData.first_name}}
                  </span>
                  <span
                    v-if="!isAuthenticated"
                    >
                    {{$t('settings.logIn')}}
                  </span>
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
              {{$t('settings.authenticate')}}
            </b-dropdown-item>
            <b-dropdown-item
              v-if="isAuthenticated"
              to="/settings/profile">
              {{$t('settings.myProfile')}}
            </b-dropdown-item>
            <b-dropdown-item
              v-if="isAuthenticated"
              @click="submitLogout()">
              {{$t('settings.logOut')}}
            </b-dropdown-item>
          </b-nav-item-dropdown>

        </b-navbar-nav>
      </b-collapse>

      <b-navbar-nav class="ml-auto">
        <b-nav-item>
          <b-button
            v-b-toggle:navbar-toggle-search
            :variant="searchVisible ? 'primary' :'link'"
            >
            <b-icon icon="search"></b-icon>
          </b-button>
        </b-nav-item>
      </b-navbar-nav>

    </b-navbar>

    <b-collapse
      id="navbar-toggle-search"
      v-model="searchVisible"
      is-nav
      >
      <b-card
        class="bg-primary"
        >
        <b-row align-h="center">
          <b-col cols="8">
            <DatasetsSuggest
              :customClass="'bg-primary border-0 pb-2 my-4'"
              :hideBlocks="['title', 'link', 'from']"
            />
          </b-col>
        </b-row>
      </b-card>
    </b-collapse>

  </div>

</template>

<script>
import { mapState, mapGetters } from 'vuex'

import DatasetsSuggest from '@/components/datasets/DatasetsSuggest.vue'

// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Navbar',
  components: {
    DatasetsSuggest
  },
  data () {
    return {
      isLoading: false,
      searchVisible: false
    }
  },
  created () {
    // console.log('-C- NAVBAR > created ...')
  },
  computed: {
    ...mapState({
      log: (state) => state.global.log,
      clientId: (state) => state.oauth.clientId,
      tokens: (state) => state.oauth.tokens,
      userData: (state) => state.user.user
    }),
    ...mapGetters({
      isAuthenticated: 'oauth/isAuthenticated'
    })
  },
  methods: {
    async submitLogin () {
      // console.log('\n-C- NAVBAR > submitLogin ...')
      // login with OAUTH
      this.isLoading = true
      this.$OAUTHcli.login(this.clientId)
    },
    async submitLogout () {
      // evt.preventDefault()
      // console.log('\n-C- NAVBAR > submitLogout ...')
      this.isLoading = true
      await this.$OAUTHcli.logout()

      // TO DO => logout from moderation API
      // await this.$MODERATIONcli.logout()

      this.$store.commit('user/resetUser')
      this.isLoading = false
      // console.log('-C- NAVBAR > submitLogout > this.$router : ', this.$router)
      // console.log('-C- NAVBAR > submitLogout > this.$router.currentRoute : ', this.$router.currentRoute)
      // console.log('-C- NAVBAR > submitLogout > this.$route : ', this.$route)
      if (this.$router.currentRoute.path !== '/') {
        this.$router.push('/')
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/css/custom.scss';

a {
  color: $dgf-grey !important;
}

.active-link {
  color: $dgf-grey !important;
  font-weight: bold;
  border-bottom: 4px solid $dgf-blue;
}

.light-bottom-border {
  border-bottom: .5px solid $dgf-light-grey;
  // -moz-box-shadow: 0 10px 5px rgba(255, 255, 255, 0.4);
  // -webkit-box-shadow: 0 10px 5px rgba(255, 255, 255, 0.4);
  // box-shadow: 0 10px 5px rgba(255, 255, 255, 0.4);
}
</style>
