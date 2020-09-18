<template>

  <div
    id="profile"
    class="user-me"
    >

    <NavCrumbs
      :crumbs="crumbs"
    />

    <h2 class="my-5">
      {{$t('settings.myProfile')}}
    </h2>

    <!-- RESPONSE USER -->
    <b-card
      class="mt-3 mx-auto text-center"
      style="width: 600px;"
      >
      <hr>
      {{$t('basics.user')}}

      <RawData
        :customClass="`mb-3`"
        :see="true"
        title="user data"
        :dataRaw="userData"
      ></RawData>

      <RawData
        :customClass="`my-3`"
        :see="false"
        title="user activity"
        :dataRaw="userActivity"
      ></RawData>

    </b-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import NavCrumbs from '@/components/ux/NavCrumbs.vue'
import RawData from '@/components/ux/RawData.vue'

export default {
  name: 'Profile',
  components: {
    NavCrumbs,
    RawData
  },
  data () {
    return {
      isLoading: false,
      activityOperationId: 'activity',
      userActivity: undefined,
      crumbs: [
        {
          text: this.$t('home.name'),
          to: '/'
        },
        {
          text: this.$t('basics.settings'),
          to: '/settings'
        },
        {
          text: this.$t('basics.profile'),
          active: true
        }
      ]
    }
  },
  created () {
    this.getUserActivity()
  },
  computed: {
    ...mapState({
      log: (state) => state.global.log,
      userData: (state) => state.user.user
    })
  },
  methods: {
    getUserActivity () {
      const API = this.$APIcli
      const params = { user: this.userId }
      this.isLoading = true
      API._request(this.activityOperationId, { params }).then(
        results => {
          this.userActivity = results.body
          this.isLoading = false
        },
        reason => {
          console.error(`failed on api call: ${reason}`)
          this.isLoading = false
        }
      )
    }
  }
}

</script>
