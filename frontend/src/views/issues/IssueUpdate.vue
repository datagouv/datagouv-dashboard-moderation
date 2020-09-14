<template>
  <div class="issue_update">

    <NavCrumbs
      :crumbs="crumbs"
    />

    <PageHeader
      :dgfType="'issue'"
      :customClass="'mb-5'"
      :subtitleLink="issueRequest"
      >
      <template v-slot:badge>
        <div>
          {{ $t('navigation.from') }} :
          <span v-if="issueRequest">
            <a :href="issueRequest" target="_blank">
              JSON
            </a>
            |
            <a :href="issue.url" target="_blank">
              datagouv issue page
            </a>
          </span>
          <span v-else>
            {{ getOperationId }}
          </span>
        </div>
      </template>
    </PageHeader>

    <b-row class="mx-2">

      <!-- DISPLAY ISSUE -->
      <b-col>

        <IssueCard
          :cardTitle="`${$t('basics.issue')} n° ${issueId}`"
          :cardFooter="undefined"
          :issueData="issue"
          :issueId="issueId"
          height="800px"
        >
        </IssueCard>
      </b-col>

      <!-- MODERATION BOX -->
      <b-col sm="6" md="4">
        <ModerationRowCard
          :hasHeader="true"
          :dgfType="dgfType"
          :endpoint="endpointModeration"
          :item="issue"
        />
      </b-col>

    </b-row>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import NavCrumbs from '@/components/ux/NavCrumbs.vue'
import PageHeader from '@/components/ux/PageHeader.vue'
import ModerationRowCard from '@/components/moderation/ModerationRowCard.vue'

import IssueCard from '@/components/issues/IssueCard.vue'

export default {
  name: 'IssueUpdate',
  components: {
    NavCrumbs,
    PageHeader,
    ModerationRowCard,
    IssueCard
  },
  data () {
    return {
      isLoading: false,
      dgfType: 'dataset',
      getOperationId: 'get_issue',
      putOperationId: 'update_issue',
      endpointModeration: 'issue',
      issueId: this.$route.params.id,
      issueRequest: undefined,
      issue: undefined,
      needsModerationData: false,
      crumbs: [
        {
          text: this.$t('home.name'),
          to: '/'
        },
        {
          text: this.$t('basics.issues', { list: '' }),
          to: '/issues'
        },
        {
          text: '...', // this.$route.params.id,
          active: true
        }
      ]
    }
  },
  created () {
    this.getIssue()
  },
  watch: {
    async issue (next) {
      if (next && this.needsModerationData) {
        this.issue = await this.appendModerationData(next)
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
      const consolidated = this.$MODERATIONcli.addModerationData(itemObject, itemStatus)
      this.needsModerationData = false
      return consolidated
    },
    getIssue () {
      const API = this.$APIcli
      const params = { id: this.issueId }
      this.isLoading = true
      API._request(this.getOperationId, { params }).then(
        results => {
          this.issueRequest = results.url
          this.issue = results.body
          this.needsModerationData = true
          const title = this.issue.title.length > 25 ? this.issue.title.slice(0, 25) + '...' : this.issue.title
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
