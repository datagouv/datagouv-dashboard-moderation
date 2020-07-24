<template>

  <div class="settings">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

    <h2>
      Settings
    </h2>

    <br>

    <div>
      <b-button
        to="/settings/profile">
        My profile
      </b-button>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Settings',
  data () {
    return {
      crumbs: [
        {
          text: 'Home',
          to: '/'
        },
        {
          text: 'Settings',
          active: true
        }
      ]
    }
  },
  created () {
  },
  computed: {
    ...mapState({
      log: (state) => state.global.log,
      userData: (state) => state.user.user
    })
  }
}

</script>
