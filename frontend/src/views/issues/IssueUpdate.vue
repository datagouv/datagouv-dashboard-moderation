<template>
  <div class="issue_update">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

    <PreviousPage/>

    <h2>
      Issue update
    </h2>

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

    <br>

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
          :item="issue"
        />
      </b-col>

    </b-row>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import PreviousPage from '@/components/ux/PreviousPage.vue'
import ModerationRowCard from '@/components/moderation/ModerationRowCard.vue'

import IssueCard from '@/components/issues/IssueCard.vue'

export default {
  name: 'IssueUpdate',
  components: {
    PreviousPage,
    ModerationRowCard,
    IssueCard
  },
  data () {
    return {
      isLoading: false,
      getOperationId: 'get_issue',
      putOperationId: 'update_issue',
      issueId: this.$route.params.id,
      issueRequest: undefined,
      issue: undefined,
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
  watch: {},
  computed: {
    ...mapState({
      log: (state) => state.log
    })
  },
  methods: {
    getIssue () {
      const API = this.$APIcli
      console.log('-V- IssueUpdate > methods > getIssue > API :', API)
      const params = { id: this.issueId }
      this.isLoading = true
      API._request(this.getOperationId, { params }).then(
        results => {
          console.log('-V- IssueUpdate > methods > getIssue > results :', results)
          console.log('-V- IssueUpdate > methods > getIssue > results.body :', results.body)
          this.issueRequest = results.url
          this.issue = results.body
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
