<template>
  <div class="user_update">

    <NavCrumbs
      :crumbs="crumbs"
    />

    <div>
      <b-sidebar
        id="sidebar-moderation"
        title="Moderation"
        width="600px"
        bg-variant="light"
        text-variant="dark"
        shadow
        backdrop
        >
        <div class="px-3 py-2">
          <ModerationRowCard
            :hasHeader="true"
            :dgfType="dgfType"
            :endpoint="endpointModeration"
            :item="user"
          />
        </div>
      </b-sidebar>
    </div>

    <PageHeader
      :dgfType="'user'"
      :customClass="'mb-5'"
      :subtitleLink="userRequest"
      >
      <template v-slot:dialogLeft>
        <b-button v-b-toggle.sidebar-moderation pill>
          <b-icon icon="eye-fill" aria-hidden=""></b-icon>
          <span class="ml-2">
            {{$t('moderation.moderation', { prefix: '' })}}
          </span>
        </b-button>
      </template>
      <template v-slot:badge>
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
      </template>
    </PageHeader>

    <b-row class="mx-0">

      <!-- MODERATION BOX -->
      <!-- <b-col sm="6" md="4">
        <ModerationRowCard
          :hasHeader="true"
          :dgfType="dgfType"
          :endpoint="endpointModeration"
          :item="user"
        />
      </b-col> -->

      <!-- DISPLAY USER -->
      <b-col class="px-0">
        <UserCard
          :cardTitle="`${$t('basics.user')} n° ${userId}`"
          :cardFooter="undefined"
          :userData="user"
          :userId="userId"
          height="800px"
        >
        </UserCard>
      </b-col>

    </b-row>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import NavCrumbs from '@/components/ux/NavCrumbs.vue'
import PageHeader from '@/components/ux/PageHeader.vue'
import ModerationRowCard from '@/components/moderation/ModerationRowCard.vue'

import UserCard from '@/components/users/UserCard.vue'

export default {
  name: 'UserUpdate',
  components: {
    NavCrumbs,
    PageHeader,
    ModerationRowCard,
    UserCard
  },
  data () {
    return {
      isLoading: false,
      dgfType: 'user',
      getOperationId: 'get_user',
      putOperationId: 'update_user',
      endpointModeration: 'user',
      userId: this.$route.params.id,
      userRequest: undefined,
      user: undefined,
      needsModerationData: false,
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
  watch: {
    async user (next) {
      if (next && this.needsModerationData) {
        this.user = await this.appendModerationData(next)
      }
    }
  },
  computed: {
    ...mapState({
      log: (state) => state.log
    })
  },
  methods: {
    async appendModerationData (itemObject) {
      const itemStatus = await this.$MODERATIONcli.getModeration(this.dgfType, itemObject)
      const consolidated = this.$MODERATIONcli.addModerationData(itemObject, itemStatus)
      this.needsModerationData = false
      return consolidated
    },
    getUser () {
      const API = this.$APIcli

      const params = { user: this.userId }
      this.isLoading = true
      API._request(this.getOperationId, { params }).then(
        results => {
          this.userRequest = results.url
          this.user = results.body
          this.needsModerationData = true
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
