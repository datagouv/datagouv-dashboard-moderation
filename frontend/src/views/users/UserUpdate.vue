<template>
  <div class="user_update">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

    <PreviousPage/>

    <h2>
      User update
    </h2>
    <div>
      {{ $t('navigation.from') }} :
      <span v-if="userRequest">
        <a :href="userRequest" target="_blank">
          JSON
        </a>
        |
        <a :href="user.page" target="_blank">
          datagouv user page
        </a>
      </span>
      <span v-else>
        {{ getOperationId }}
      </span>
    </div>

    <br>

    <!-- DISPLAY USER -->
    <UserCard
      :cardTitle="`user n° ${userId}`"
      :cardFooter="undefined"
      :userData="user"
      :userId="userId"
      height="800px"
      width="600px"
    >
    </UserCard>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import PreviousPage from '@/components/ux/PreviousPage.vue'
import UserCard from '@/components/users/UserCard.vue'

export default {
  name: 'UserUpdate',
  components: {
    PreviousPage,
    UserCard
  },
  data () {
    return {
      isLoading: false,
      getOperationId: 'get_user',
      putOperationId: 'update_user',
      userId: this.$route.params.id,
      userRequest: undefined,
      user: undefined,
      crumbs: [
        {
          text: this.$t('home.name'),
          to: '/'
        },
        {
          text: this.$t('basics.users', { list: '' }),
          to: '/users'
        },
        {
          text: '...', // this.$route.params.id,
          active: true
        }
      ]
    }
  },
  created () {
    this.getUser()
  },
  watch: {},
  computed: {
    ...mapState({
      log: (state) => state.log
    })
  },
  methods: {
    getUser () {
      const API = this.$APIcli
      console.log('-V- UserUpdate > methods > getUser > API :', API)
      const params = { user: this.userId }
      this.isLoading = true
      API._request(this.getOperationId, { params }).then(
        results => {
          console.log('-V- UserUpdate > methods > getUser > results.body :', results.body)
          this.userRequest = results.url
          this.user = results.body
          this.crumbs[2].text = `${this.user.first_name} ${this.user.last_name}`
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
