<template>
  <div class="reuse_update">

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
            :item="reuse"
          />
        </div>
      </b-sidebar>
    </div>

    <PageHeader
      :dgfType="'reuse'"
      :customClass="'mb-5'"
      :subtitleLink="reuseRequest"
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

    <b-row class="mx-0">

      <!-- MODERATION BOX -->
      <!-- <b-col sm="6" md="4">
        <ModerationRowCard
          :hasHeader="true"
          :dgfType="dgfType"
          :endpoint="endpointModeration"
          :item="reuse"
        />
      </b-col> -->

      <!-- DISPLAY REUSE -->
      <b-col class="px-0">
        <ReuseCard
          :cardTitle="`${$t('basics.reuse')} n° ${reuseId}`"
          :cardFooter="undefined"
          :reuseData="reuse"
          :reuseId="reuseId"
          height="800px"
        >
        </ReuseCard>
      </b-col>

    </b-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import NavCrumbs from '@/components/ux/NavCrumbs.vue'
import PageHeader from '@/components/ux/PageHeader.vue'
import ModerationRowCard from '@/components/moderation/ModerationRowCard.vue'

import ReuseCard from '@/components/reuses/ReuseCard.vue'

export default {
  name: 'ReuseUpdate',
  components: {
    NavCrumbs,
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
      const itemStatus = await this.$MODERATIONcli.getModeration(this.dgfType, itemObject)
      this.$makeToast(itemStatus, this.reuse.id, 'GET', this.dgfType, 'item')
      const consolidated = this.$MODERATIONcli.addModerationData(itemObject, itemStatus)
      this.needsModerationData = false
      return consolidated
    },
    getReuse () {
      const API = this.$APIcli
      const params = { reuse: this.reuseId }
      this.isLoading = true
      API._request(this.getOperationId, { params }).then(
        results => {
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
