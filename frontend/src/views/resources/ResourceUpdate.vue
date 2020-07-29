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

    <!-- DISPLAY ISSUE -->
    <ResourceCard
      :cardTitle="`resource n° ${resourceId}`"
      :cardFooter="undefined"
      :resourceData="resource"
      :resourceId="resourceId"
      height="800px"
      width="600px"
    >
    </ResourceCard>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import PreviousPage from '@/components/ux/PreviousPage.vue'
import ResourceCard from '@/components/resources/ResourceCard.vue'

export default {
  name: 'ResourceUpdate',
  components: {
    PreviousPage,
    ResourceCard
  },
  data () {
    return {
      isLoading: false,
      getOperationId: 'get_resource',
      putOperationId: 'update_resource',
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
      console.log('-V- ResourceUpdate > methods > getResource > API :', API)
      const params = { id: this.resourceId }
      this.isLoading = true
      API._request(this.getOperationId, { params }).then(
        results => {
          console.log('-V- ResourceUpdate > methods > getResource > results.body :', results.body)
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
