<template>
  <div class="dataset_update">

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
            :item="dataset"
          />
        </div>
      </b-sidebar>
    </div>

    <b-row class="mx-0">

      <!-- MODERATION BOX -->
      <!-- <b-col sm="6" md="4">
        <ModerationRowCard
          :hasHeader="true"
          :dgfType="dgfType"
          :endpoint="endpointModeration"
          :item="dataset"
        />
      </b-col> -->

      <!-- DISPLAY DATASET -->
      <b-col class="px-0">
        <DatasetCard
          :cardFooter="undefined"
          :datasetData="dataset"
          :datasetId="datasetId"
          height="800px"
          >
        </DatasetCard>
      </b-col>

    </b-row>

  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import NavCrumbs from '@/components/ux/NavCrumbs.vue'
import ModerationRowCard from '@/components/moderation/ModerationRowCard.vue'

import DatasetCard from '@/components/datasets/DatasetCard.vue'

export default {
  name: 'DatasetUpdate',
  components: {
    NavCrumbs,
    ModerationRowCard,
    DatasetCard
  },
  data () {
    return {
      isLoading: false,
      dgfType: 'dataset',
      getOperationId: 'get_dataset',
      putOperationId: 'update_dataset',
      endpointModeration: 'dataset',
      datasetId: this.$route.params.id,
      datasetRequest: undefined,
      dataset: undefined,
      needsModerationData: false,
      trimLimit: 50,
      crumbs: [
        {
          text: this.$t('home.name'),
          to: '/'
        },
        {
          text: this.$t('basics.datasets', { list: '' }),
          to: '/datasets'
        },
        {
          text: '...',
          active: true
        }
      ]
    }
  },
  created () {
    this.getDataset()
  },
  watch: {
    async dataset (next) {
      if (next && this.needsModerationData && this.isAuthenticated) {
        this.dataset = await this.appendModerationData(next)
      }
    },
    '$route.params.id' (next) {
      this.datasetId = next
      this.getDataset()
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
      this.$makeToast(itemStatus, this.dataset.id, itemStatus.method ? itemStatus.method : 'GET', this.dgfType, 'item')
      const consolidated = await this.$MODERATIONcli.addModerationData(itemObject, itemStatus)
      this.needsModerationData = false
      return consolidated
    },
    async getDataset () {
      const API = this.$APIcli
      const params = { dataset: this.datasetId }
      this.isLoading = true
      API._request(this.getOperationId, { params }).then(
        results => {
          this.datasetRequest = results.url
          this.dataset = results.body
          const title = this.dataset.title.length > this.trimLimit ? this.dataset.title.slice(0, this.trimLimit) + '...' : this.dataset.title
          this.crumbs[2].text = title
          this.isLoading = false
          this.needsModerationData = true
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
