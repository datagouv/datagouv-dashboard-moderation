<template>
  <div class="organization_update">

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
            :item="organization"
          />
        </div>
      </b-sidebar>
    </div>

    <!-- <PageHeader
      :dgfType="'organization'"
      :customClass="'mb-5'"
      :subtitleLink="organizationRequest"
      >
      <template v-slot:dialogLeft>
        <b-button v-if="isAuthenticated" v-b-toggle.sidebar-moderation pill>
          <b-icon icon="eye-fill" aria-hidden=""></b-icon>
          <span class="ml-2">
            {{$t('moderation.moderation', { prefix: '' })}}
          </span>
        </b-button>
      </template>
      <template v-slot:badge>
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
      </template>
    </PageHeader> -->

    <b-row class="mx-0">

      <!-- MODERATION BOX -->
      <!-- <b-col sm="6" md="4">
        <ModerationRowCard
          :hasHeader="true"
          :dgfType="dgfType"
          :endpoint="endpointModeration"
          :item="organization"
        />
      </b-col> -->

      <!-- DISPLAY ORGANIZATION -->
      <b-col class="px-0">
        <OrganizationCard
          :cardTitle="`${$t('basics.organization')} n° ${organizationId}`"
          :cardFooter="undefined"
          :organizationData="organization"
          :organizationId="organizationId"
          height="800px"
        >
        </OrganizationCard>
      </b-col>

    </b-row>

  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import NavCrumbs from '@/components/ux/NavCrumbs.vue'
// import PageHeader from '@/components/ux/PageHeader.vue'
import ModerationRowCard from '@/components/moderation/ModerationRowCard.vue'

import OrganizationCard from '@/components/organizations/OrganizationCard.vue'

export default {
  name: 'OrganizationUpdate',
  components: {
    NavCrumbs,
    // PageHeader,
    ModerationRowCard,
    OrganizationCard
  },
  data () {
    return {
      isLoading: false,
      dgfType: 'organization',
      getOperationId: 'get_organization',
      putOperationId: 'update_organization',
      endpointModeration: 'organization',
      organizationId: this.$route.params.id,
      organizationRequest: undefined,
      organization: undefined,
      needsModerationData: false,
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
  watch: {
    async organization (next) {
      if (next && this.needsModerationData) {
        this.organization = await this.appendModerationData(next)
      }
    },
    '$route.params.id' (next) {
      this.organizationId = next
      this.getOrganization()
    }
  },
  computed: {
    ...mapState({
      log: (state) => state.log
    }),
    ...mapGetters({
      isAuthenticated: 'oauth/isAuthenticated'
    })
  },
  methods: {
    async appendModerationData (itemObject) {
      const itemStatus = await this.$MODERATIONcli.getModeration(this.dgfType, itemObject)
      this.$makeToast(itemStatus, this.organization.id, 'GET', this.dgfType, 'item')
      const consolidated = this.$MODERATIONcli.addModerationData(itemObject, itemStatus)
      this.needsModerationData = false
      return consolidated
    },
    getOrganization () {
      const API = this.$APIcli
      const params = { org: this.organizationId }
      this.isLoading = true
      API._request(this.getOperationId, { params }).then(
        results => {
          this.organizationRequest = results.url
          this.organization = results.body
          this.needsModerationData = true
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
