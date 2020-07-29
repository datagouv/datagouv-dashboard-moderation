<template>

  <div class="user-me">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

    <h2>
      Me
    </h2>

    <br>

    <!-- RESPONSE USER -->
    <b-card
      class="mt-3 mx-auto text-center"
      style="width: 600px;"
      >
      <hr>
      user (store) :
      <code>
        {{userData}}
      </code>

      <RawData
        :customClass="`mb-3`"
        :see="true"
        title="user data"
        :dataRaw="user"
      ></RawData>

      <RawData
        :customClass="`mb-3`"
        :see="true"
        title="user activity"
        :dataRaw="userActivity"
      ></RawData>

    </b-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import RawData from '@/components/ux/RawData.vue'

export default {
  name: 'Profile',
  components: {
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
      console.log('-C- UserCard > methods > getUserActivity > API :', API)
      const params = { user: this.userId }
      this.isLoading = true
      API._request(this.activityOperationId, { params }).then(
        results => {
          console.log('-C- UserCard > methods > getUserActivity > results.body :', results.body)
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
