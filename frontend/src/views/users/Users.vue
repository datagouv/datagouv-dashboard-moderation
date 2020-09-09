<template>

  <div class="users">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

    <!-- DISPLAY USERS IN TABLE -->
    <UsersList
      height="800px"
      >
    </UsersList>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import UsersList from '@/components/users/UsersList.vue'

export default {
  name: 'Users',
  components: {
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
