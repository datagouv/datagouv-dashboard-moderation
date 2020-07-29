<template>
  <div class="discussion_update">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

    <PreviousPage/>

    <h2>
      Discussion update
    </h2>
    <div>
      {{ $t('navigation.from') }} :
      <span v-if="discussionRequest">
        <a :href="discussionRequest" target="_blank">
          JSON
        </a>
        |
        <a :href="discussion.url" target="_blank">
          datagouv discussion page
        </a>
      </span>
      <span v-else>
        {{ getOperationId }}
      </span>
    </div>

    <br>

    <!-- DISPLAY ISSUE -->
    <DiscussionCard
      :cardTitle="`discussion n° ${discussionId}`"
      :cardFooter="undefined"
      :discussionData="discussion"
      :discussionId="discussionId"
      height="800px"
      width="600px"
    >
    </DiscussionCard>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import PreviousPage from '@/components/ux/PreviousPage.vue'
import DiscussionCard from '@/components/discussions/DiscussionCard.vue'

export default {
  name: 'DiscussionUpdate',
  components: {
    PreviousPage,
    DiscussionCard
  },
  data () {
    return {
      isLoading: false,
      getOperationId: 'get_discussion',
      putOperationId: 'update_discussion',
      discussionId: this.$route.params.id,
      discussionRequest: undefined,
      discussion: undefined,
      crumbs: [
        {
          text: this.$t('home.name'),
          to: '/'
        },
        {
          text: this.$t('basics.discussions', { list: '' }),
          to: '/discussions'
        },
        {
          text: '...', // this.$route.params.id,
          active: true
        }
      ]
    }
  },
  created () {
    this.getDiscussion()
  },
  watch: {},
  computed: {
    ...mapState({
      log: (state) => state.log
    })
  },
  methods: {
    getDiscussion () {
      const API = this.$APIcli
      console.log('-V- DiscussionUpdate > methods > getDiscussion > API :', API)
      const params = { id: this.discussionId }
      this.isLoading = true
      API._request(this.getOperationId, { params }).then(
        results => {
          console.log('-V- DiscussionUpdate > methods > getDiscussion > results.body :', results.body)
          this.discussionRequest = results.url
          this.discussion = results.body
          const title = this.discussion.title.length > 25 ? this.discussion.title.slice(0, 25) + '...' : this.discussion.title
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
