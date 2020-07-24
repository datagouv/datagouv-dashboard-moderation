<template>
  <div class="dataset_update">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

    <h2>
      Dataset update
    </h2>

    <div>
      from :
      <span v-if="datasetsRequest">
        <a :href="datasetsRequest" target="_blank">
          JSON
        </a>
        |
        <a :href="dataset.page" target="_blank">
          datagouv public page
        </a>
      </span>
      <span v-else>
        {{ getOperationId }}
      </span>
    </div>

    <br>

    <!-- DISPLAY DATASET -->
    <DatasetCard
      :cardTitle="`dataset n° ${datasetId}`"
      :cardFooter="undefined"
      :datasetData="dataset"
      :datasetId="datasetId"
      height="800px"
      width="700px"
    >
    </DatasetCard>

  </div>
</template>

<script>
import DatasetCard from '@/components/data/DatasetCard.vue'
import { mapState } from 'vuex'

export default {
  name: 'DatasetUpdate',
  components: {
    DatasetCard
  },
  data () {
    return {
      isLoading: false,
      getOperationId: 'get_dataset',
      putOperationId: 'update_dataset',
      // datasetId: '5efca5f8be419da8fac3c8a4', // DEMO
      // datasetId: '5ee8c506f9b7bda18cd1fb20', // LOCAL
      datasetId: this.$route.params.id,
      datasetsRequest: undefined,
      dataset: undefined,
      crumbs: [
        {
          text: 'Home',
          to: '/'
        },
        {
          text: 'Datasets',
          to: '/datasets'
        },
        {
          text: '...', // this.$route.params.id,
          active: true
        }
      ]
    }
  },
  created () {
    this.getDataset()
  },
  watch: {},
  computed: {
    ...mapState({
      log: (state) => state.log
    })
  },
  methods: {
    getDataset () {
      const API = this.$APIcli
      console.log('-V- DatasetUpdate > methods > getDataset > API :', API)
      const params = { dataset: this.datasetId }
      this.isLoading = true
      API._request(this.getOperationId, { params }).then(
        results => {
          console.log('-V- DatasetUpdate > methods > getDataset > results.body :', results.body)
          this.datasetsRequest = results.url
          this.dataset = results.body
          this.crumbs[2].text = `${this.dataset.title}`
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
