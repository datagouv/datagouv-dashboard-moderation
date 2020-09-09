<template>
  <div class="reuse_update">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

    <PageHeader
      :dgfType="'reuse'"
      :customClass="'mb-4'"
      >
      <template v-slot:badge>
        <div>
          {{ $t('navigation.from') }} :
          <span v-if="reuseRequest">
            <a :href="reuseRequest" target="_blank">
              JSON
            </a>
            |
            <a :href="reuse.url" target="_blank">
              datagouv reuse page
            </a>
          </span>
          <span v-else>
            {{ getOperationId }}
          </span>
        </div>
      </template>
    </PageHeader>

    <b-row class="mx-2">

      <!-- DISPLAY REUSE -->
      <b-col>
        <ReuseCard
          :cardTitle="`${$t('basics.reuse')} n° ${reuseId}`"
          :cardFooter="undefined"
          :reuseData="reuse"
          :reuseId="reuseId"
          height="800px"
        >
        </ReuseCard>
      </b-col>

      <!-- MODERATION BOX -->
      <b-col sm="6" md="4">
        <ModerationRowCard
          :hasHeader="true"
          :dgfType="dgfType"
          :endpoint="endpointModeration"
          :item="reuse"
        />
      </b-col>

    </b-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import PageHeader from '@/components/ux/PageHeader.vue'
import ModerationRowCard from '@/components/moderation/ModerationRowCard.vue'

import ReuseCard from '@/components/reuses/ReuseCard.vue'

export default {
  name: 'ReuseUpdate',
  components: {
    PageHeader,
    ModerationRowCard,
    ReuseCard
  },
  data () {
    return {
      isLoading: false,
      dgfType: 'reuse',
      getOperationId: 'get_reuse',
      putOperationId: 'update_reuse',
      endpointModeration: 'reuse',
      reuseId: this.$route.params.id,
      reuseRequest: undefined,
      reuse: undefined,
      needsModerationData: false,
      crumbs: [
        {
          text: this.$t('home.name'),
          to: '/'
        },
        {
          text: this.$t('basics.reuses', { list: '' }),
          to: '/reuses'
        },
        {
          text: '...', // this.$route.params.id,
          active: true
        }
      ]
    }
  },
  created () {
    this.getReuse()
  },
  watch: {
    async reuse (next) {
      if (next && this.needsModerationData) {
        this.reuse = await this.appendModerationData(next)
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
      const itemStatus = await this.$MODERATIONcli.getModeration(itemObject.id)
      const consolidated = this.$MODERATIONcli.addModerationData(itemObject, itemStatus)
      this.needsModerationData = false
      return consolidated
    },
    getReuse () {
      const API = this.$APIcli
      // console.log('-V- ReuseUpdate > methods > getReuse > API :', API)
      const params = { reuse: this.reuseId }
      this.isLoading = true
      API._request(this.getOperationId, { params }).then(
        results => {
          // console.log('-V- ReuseUpdate > methods > getReuse > results.body :', results.body)
          this.reuseRequest = results.url
          this.reuse = results.body
          this.needsModerationData = true
          const title = this.reuse.title.length > 25 ? this.reuse.title.slice(0, 25) + '...' : this.reuse.title
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
