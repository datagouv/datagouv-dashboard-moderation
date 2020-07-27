<template>
  <div class="organization_update">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

    <h2>
      Organization update
    </h2>
    <div>
      from :
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

    <!-- DISPLAY ISSUE -->
    <OrganizationCard
      :cardTitle="`organization n° ${organizationId}`"
      :cardFooter="undefined"
      :organizationData="organization"
      :organizationId="organizationId"
      height="800px"
      width="600px"
    >
    </OrganizationCard>

  </div>
</template>

<script>
import OrganizationCard from '@/components/organizations/OrganizationCard.vue'
import { mapState } from 'vuex'

export default {
  name: 'OrganizationUpdate',
  components: {
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
          text: 'Home',
          to: '/'
        },
        {
          text: 'Organizations',
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
          this.crumbs[2].text = `${this.organization.name}`
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
