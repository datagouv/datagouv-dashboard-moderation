<template>

  <div class="settings">

    <NavCrumbs
      :crumbs="crumbs"
    />

    <h2>
      {{ $t('basics.settings') }}
    </h2>

    <br>

    <div>
      <b-button
        to="/settings/profile">
        {{ $t('settings.myProfile') }}
      </b-button>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import NavCrumbs from '@/components/ux/NavCrumbs.vue'

export default {
  name: 'Settings',
  components: {
    NavCrumbs
  },
  data () {
    return {
      crumbs: [
        {
          text: this.$t('home.name'),
          to: '/'
        },
        {
          text: this.$t('basics.settings'),
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
