<template>
  <div class="resource_update">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

    <PreviousPage/>

    <h2>
      Resource update
    </h2>
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

    <br>

    <b-row class="mx-2">

      <!-- DISPLAY RESOURCE -->
      <b-col>
        <ResourceCard
          :cardTitle="`${$t('basics.resource')} n° ${resourceId}`"
          :cardFooter="undefined"
          :resourceData="resource"
          :resourceId="resourceId"
          height="800px"
        >
        </ResourceCard>
      </b-col>

      <!-- MODERATION BOX -->
      <b-col sm="6" md="4">
        <ModerationRowCard
          :hasHeader="true"
          :endpoint="endpointModeration"
          :item="resource"
        />
      </b-col>

    </b-row>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import PreviousPage from '@/components/ux/PreviousPage.vue'
import ModerationRowCard from '@/components/moderation/ModerationRowCard.vue'

import ResourceCard from '@/components/resources/ResourceCard.vue'

export default {
  name: 'ResourceUpdate',
  components: {
    PreviousPage,
    ModerationRowCard,
    ResourceCard
  },
  data () {
    return {
      isLoading: false,
      // getOperationId: 'get_resource',
      getOperationId: 'retrieve_community_resource',
      putOperationId: 'update_resource',
      endpointModeration: 'resource',
      resourceId: this.$route.params.id,
      resourceRequest: undefined,
      resource: undefined,
      crumbs: [
        {
          text: this.$t('home.name'),
          to: '/'
        },
        {
          text: this.$t('basics.resources', { list: '' }),
          to: '/resources'
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
  watch: {},
  computed: {
    ...mapState({
      log: (state) => state.log
    })
  },
  methods: {
    getResource () {
      const API = this.$APIcli
      // console.log('-V- ResourceUpdate > methods > getResource > API :', API)
      const params = {
        community: this.resourceId
      }
      this.isLoading = true
      API._request(this.getOperationId, { params }).then(
        results => {
          // console.log('-V- ResourceUpdate > methods > getResource > results.body :', results.body)
          this.resourceRequest = results.url
          this.resource = results.body
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
