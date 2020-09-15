<template>
  <div class="resource_update">

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
            :item="resource"
          />
        </div>
      </b-sidebar>
    </div>

    <PageHeader
      :dgfType="dgfType"
      :customClass="'mb-5'"
      :subtitleLink="resourceRequest"
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
          <span v-if="resourceRequest">
            <a :href="resourceRequest" target="_blank">
              JSON
            </a>
            |
            <a :href="resource.url" target="_blank">
              datagouv resource page
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
          :item="resource"
        />
      </b-col> -->

      <!-- DISPLAY RESOURCE -->
      <b-col class="px-0">
        <ResourceCard
          :cardFooter="undefined"
          :resourceData="resource"
          :resourceId="resourceId"
          height="800px"
        >
        </ResourceCard>
      </b-col>

    </b-row>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import NavCrumbs from '@/components/ux/NavCrumbs.vue'
import PageHeader from '@/components/ux/PageHeader.vue'
import ModerationRowCard from '@/components/moderation/ModerationRowCard.vue'

import ResourceCard from '@/components/resources/ResourceCard.vue'

export default {
  name: 'ResourceUpdate',
  components: {
    NavCrumbs,
    PageHeader,
    ModerationRowCard,
    ResourceCard
  },
  data () {
    return {
      isLoading: false,
      dgfType: 'community_resource',
      getOperationId: 'retrieve_community_resource',
      putOperationId: 'update_resource',
      endpointModeration: 'resource',
      resourceId: this.$route.params.id,
      resourceRequest: undefined,
      resource: undefined,
      needsModerationData: false,
      crumbs: [
        {
          text: this.$t('home.name'),
          to: '/'
        },
        {
          text: this.$t('basics.community_resources', { list: '' }),
          to: '/resources-community'
        },
        {
          text: '...', // this.$route.params.id,
          active: true
        }
      ]
    }
  },
  created () {
    this.getResource()
  },
  watch: {
    async resource (next) {
      if (next && this.needsModerationData) {
        this.resource = await this.appendModerationData(next)
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
      this.$makeToast(itemStatus, this.resource.id, 'GET', this.dgfType, 'item')
      const consolidated = this.$MODERATIONcli.addModerationData(itemObject, itemStatus)
      this.needsModerationData = false
      return consolidated
    },
    getResource () {
      const API = this.$APIcli
      const params = {
        community: this.resourceId
      }
      this.isLoading = true
      API._request(this.getOperationId, { params }).then(
        results => {
          this.resourceRequest = results.url
          this.resource = results.body
          this.needsModerationData = true
          const title = this.resource.title.length > 25 ? this.resource.title.slice(0, 25) + '...' : this.resource.title
          this.crumbs[2].text = title
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
