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
    </b-card>

  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Profile',
  data () {
    return {
      crumbs: [
        {
          text: 'Home',
          to: '/'
        },
        {
          text: 'Settings',
          to: '/settings'
        },
        {
          text: 'Profile',
          // to: '/settings/profile'
          active: true
        }
        // {
        //   text: 'Me',
        //   active: true
        // }
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
