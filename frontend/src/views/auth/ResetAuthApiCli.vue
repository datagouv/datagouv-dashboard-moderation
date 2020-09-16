<template>

  <div class="">

    <NavCrumbs
      :crumbs="crumbs"
      :hideBackBtn="true"
    />

    <h2 class="mt-5">
    {{ $t('auth.resetApiClient') }}
    </h2>

    <p v-if="isLoading" class="py-5 my-5">
      <b-spinner
        style="width: 5rem; height: 5rem;"
        label="loading"
        variant="primary"
        >
      </b-spinner>
    </p>

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
  name: 'ResetApiCli',
  components: {
    NavCrumbs
  },
  data () {
    return {
      isLoading: false,
      redirection: this.$route.query.redirect,
      loginResponse: '(tokens are being requested from oauth store)',
      crumbs: [
        {
          text: this.$t('home.name'),
          to: '/'
        },
        {
          text: this.$t('auth.resetApiClient'),
          active: true
        }
      ]
    }
  },
  async mounted () {
    this.isLoading = true
    try {
      const authOptions = {
        bearerAuth: this.tokens.access.value
      }
      this.$APIcli.resetCli(authOptions)
      this.loginResponse = `your token '${this.tokens.access.value}' is now set...`
      // log into moderation API here
      const loginModerationResponse = await this.$MODERATIONcli.login(this.tokens.access.value)
      console.log('-V- Login > updateModeration > loginModerationResponse : ', loginModerationResponse)
      this.$router.push(`/get-user-data?redirect=${this.redirection}`)
    } catch (ex) {
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
    makeToast (loginModerationResponse) {
      const h = this.$createElement
      const variant = loginModerationResponse.status !== 200 ? 'danger' : 'success'
      const title = loginModerationResponse.status !== 200 ? 'error' : 'success'
      const msg = loginModerationResponse.status !== 200 ? this.$t('toastsModeration.errorTxt', { code: loginModerationResponse.status }) : 'ok msg'

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
          h('strong', msg), h('br'),
          h('p', this.$t(`responseCodes._${loginModerationResponse.status}`)), h('br'),
          h('p', this.$t(`responseCodes._${loginModerationResponse.status}`))
        ]
      )

      this.$bvToast.toast([vNodesMsg], {
        title: [vNodesTitle],
        variant: variant,
        solid: true
      })
    }
  }
}

</script>
