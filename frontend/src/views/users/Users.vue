<template>

  <div class="users">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

    <h2>
      Users list
    </h2>

    <br>

    <!-- DISPLAY DATASETS IN TABLE -->
    <UsersList
      height="800px"
      width="900px"
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
          text: 'Home',
          to: '/'
        },
        {
          text: 'Users',
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
