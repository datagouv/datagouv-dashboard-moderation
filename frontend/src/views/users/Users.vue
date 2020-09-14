<template>

  <div class="users">

    <NavCrumbs
      :crumbs="crumbs"
    />

    <!-- DISPLAY USERS IN TABLE -->
    <UsersList
      height="800px"
      >
    </UsersList>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import NavCrumbs from '@/components/ux/NavCrumbs.vue'

import UsersList from '@/components/users/UsersList.vue'

export default {
  name: 'Users',
  components: {
    NavCrumbs,
    UsersList
  },
  data () {
    return {
      crumbs: [
        {
          text: this.$t('home.name'),
          to: '/'
        },
        {
          text: this.$t('basics.users', { list: '' }),
          active: true
        }
      ]
    }
  },
  created () {
  },
  computed: {
    ...mapState({
      log: (state) => state.global.log
    })
  }
}

</script>
