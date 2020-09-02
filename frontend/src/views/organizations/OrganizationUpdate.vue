<template>
  <div class="organization_update">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

    <PreviousPage/>

    <h2>
      Organization update
    </h2>
    <div>
      {{ $t('navigation.from') }} :
      <span v-if="organizationRequest">
        <a :href="organizationRequest" target="_blank">
          JSON
        </a>
        |
        <a :href="organization.url" target="_blank">
          datagouv organization page
        </a>
      </span>
      <span v-else>
        {{ getOperationId }}
      </span>
    </div>

    <br>

    <b-row class="mx-2">

      <!-- DISPLAY ORGANIZATION -->
      <b-col>
        <OrganizationCard
          :cardTitle="`${$t('basics.organization')} n° ${organizationId}`"
          :cardFooter="undefined"
          :organizationData="organization"
          :organizationId="organizationId"
          height="800px"
        >
        </OrganizationCard>
      </b-col>

      <!-- MODERATION BOX -->
      <b-col sm="6" md="4">
        <ModerationRowCard
          :hasHeader="true"
          :item="organization"
        />
      </b-col>

    </b-row>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import PreviousPage from '@/components/ux/PreviousPage.vue'
import ModerationRowCard from '@/components/moderation/ModerationRowCard.vue'

import OrganizationCard from '@/components/organizations/OrganizationCard.vue'

export default {
  name: 'OrganizationUpdate',
  components: {
    PreviousPage,
    ModerationRowCard,
    OrganizationCard
  },
  data () {
    return {
      isLoading: false,
      getOperationId: 'get_organization',
      putOperationId: 'update_organization',
      organizationId: this.$route.params.id,
      organizationRequest: undefined,
      organization: undefined,
      crumbs: [
        {
          text: this.$t('home.name'),
          to: '/'
        },
        {
          text: this.$t('basics.organizations', { list: '' }),
          to: '/organizations'
        },
        {
          text: '...', // this.$route.params.id,
          active: true
        }
      ]
    }
  },
  created () {
    this.getOrganization()
  },
  watch: {},
  computed: {
    ...mapState({
      log: (state) => state.log
    })
  },
  methods: {
    getOrganization () {
      const API = this.$APIcli
      console.log('-V- OrganizationUpdate > methods > getOrganization > API :', API)
      const params = { org: this.organizationId }
      this.isLoading = true
      API._request(this.getOperationId, { params }).then(
        results => {
          console.log('-V- OrganizationUpdate > methods > getOrganization > results.body :', results.body)
          this.organizationRequest = results.url
          this.organization = results.body
          const name = this.organization.name.length > 25 ? this.organization.name.slice(0, 25) + '...' : this.organization.name
          this.crumbs[2].text = name
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
