<template>
  <div class="dataset_update">

    <NavCrumbs
      :crumbs="crumbs"
    />

    <PageHeader
      :dgfType="'dataset'"
      :customClass="'mb-5'"
      :subtitleLink="datasetRequest"
      >
      <template v-slot:badge>
        <div>
          {{ $t('navigation.from') }} :
          <span v-if="datasetRequest">
            <a :href="datasetRequest" target="_blank">
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
      </template>
    </PageHeader>

    <b-row class="mx-2">

      <!-- DISPLAY DATASET -->
      <b-col>
        <DatasetCard
          :cardFooter="undefined"
          :datasetData="dataset"
          :datasetId="datasetId"
          height="800px"
          >
        </DatasetCard>
      </b-col>

      <!-- MODERATION BOX -->
      <b-col sm="6" md="4">
        <ModerationRowCard
          :hasHeader="true"
          :dgfType="dgfType"
          :endpoint="endpointModeration"
          :item="dataset"
        />
      </b-col>

    </b-row>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import { APIresponses } from '@/config/APIoperations.js'

import NavCrumbs from '@/components/ux/NavCrumbs.vue'
import PageHeader from '@/components/ux/PageHeader.vue'
import ModerationRowCard from '@/components/moderation/ModerationRowCard.vue'

import DatasetCard from '@/components/datasets/DatasetCard.vue'

export default {
  name: 'DatasetUpdate',
  components: {
    NavCrumbs,
    PageHeader,
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
          text: '...', // this.$route.params.id,
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
      if (next && this.needsModerationData) {
        this.dataset = await this.appendModerationData(next)
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
      console.log('-V- DatasetUpdate > methods > appendModerationData > itemStatus :', itemStatus)
      this.makeToast(itemStatus)
      const consolidated = this.$MODERATIONcli.addModerationData(itemObject, itemStatus)
      console.log('-V- DatasetUpdate > methods > appendModerationData > consolidated :', consolidated)
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
          const title = this.dataset.title.length > 25 ? this.dataset.title.slice(0, 25) + '...' : this.dataset.title
          this.crumbs[2].text = title
          this.isLoading = false
          this.needsModerationData = true
        },
        reason => {
          console.error(`failed on api call: ${reason}`)
          this.isLoading = false
        }
      )
    },
    makeToast (moderationResponse) {
      const h = this.$createElement
      const variant = !APIresponses.success.includes(moderationResponse.status) ? 'danger' : 'success'
      const title = !APIresponses.success.includes(moderationResponse.status) ? 'error' : 'success'
      const msg = !APIresponses.success.includes(moderationResponse.status) ? this.$t('toastsModeration.errorTxt', { code: moderationResponse.status }) : 'ok msg'

      const itemId = this.dataset.id
      const vNodesTitle = h(
        'div', { class: ['d-flex', 'flex-grow-1', 'align-items-baseline', 'ml-2'] },
        [
          h('strong', { class: ['mr-2', 'text-center'] }, this.$t(`toastsModeration.${title}`))
        ]
      )
      const vNodesMsg = h(
        'p', { class: ['text-center', 'my-2'] },
        [
          h('strong', `GET ${this.dgfType}`),
          h('br'),
          h('span', `id : ${itemId}`), h('hr'),
          h('strong', msg), h('br'),
          h('p', this.$t(`responseCodes._${moderationResponse.status}`))
        ]
      )

      this.$bvToast.toast([vNodesMsg], {
        title: [vNodesTitle],
        variant: variant,
        solid: true
      })
    }
  }
}

</script>
