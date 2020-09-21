<template>
  <div class="issue_update">

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
            :item="issue"
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
          :item="issue"
        />
      </b-col> -->

      <!-- DISPLAY ISSUE -->
      <b-col class="px-0">
        <IssueCard
          :cardTitle="`${$t('basics.issue')} n° ${issueId}`"
          :cardFooter="undefined"
          :issueData="issue"
          :issueId="issueId"
          height="800px"
        >
        </IssueCard>
      </b-col>

    </b-row>

  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import NavCrumbs from '@/components/ux/NavCrumbs.vue'
import ModerationRowCard from '@/components/moderation/ModerationRowCard.vue'

import IssueCard from '@/components/issues/IssueCard.vue'

export default {
  name: 'IssueUpdate',
  components: {
    NavCrumbs,
    ModerationRowCard,
    IssueCard
  },
  data () {
    return {
      isLoading: false,
      dgfType: 'issue',
      getOperationId: 'get_issue',
      putOperationId: 'update_issue',
      endpointModeration: 'issue',
      issueId: this.$route.params.id,
      issueRequest: undefined,
      issue: undefined,
      needsModerationData: false,
      trimLimit: 50,
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
          text: '...',
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
      if (next && this.needsModerationData && this.isAuthenticated) {
        this.issue = await this.appendModerationData(next)
      }
    },
    '$route.params.id' (next) {
      this.issueId = next
      this.getIssue()
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
      this.$makeToast(itemStatus, this.issue.id, itemStatus.method ? itemStatus.method : 'GET', this.dgfType, 'item')
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
          const title = this.issue.title.length > this.trimLimit ? this.issue.title.slice(0, this.trimLimit) + '...' : this.issue.title
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
