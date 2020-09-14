<template>
  <div class="discussion_update">

    <NavCrumbs
      :crumbs="crumbs"
    />

    <PageHeader
      :dgfType="'discussion'"
      :customClass="'mb-4'"
      :subtitleLink="discussionRequest"
      >
      <template v-slot:badge>
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
      </template>
    </PageHeader>

    <b-row class="mx-2">

      <!-- DISPLAY DISCUSSION -->
      <b-col>
        <DiscussionCard
          :cardTitle="`${$t('basics.discussion')} n° ${discussionId}`"
          :cardFooter="undefined"
          :discussionData="discussion"
          :discussionId="discussionId"
          height="800px"
        >
        </DiscussionCard>
      </b-col>

      <!-- MODERATION BOX -->
      <b-col sm="6" md="4">
        <ModerationRowCard
          :hasHeader="true"
          :dgfType="dgfType"
          :endpoint="endpointModeration"
          :item="discussion"
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

import DiscussionCard from '@/components/discussions/DiscussionCard.vue'

export default {
  name: 'DiscussionUpdate',
  components: {
    NavCrumbs,
    PageHeader,
    ModerationRowCard,
    DiscussionCard
  },
  data () {
    return {
      isLoading: false,
      dgfType: 'dicussion',
      getOperationId: 'get_discussion',
      putOperationId: 'update_discussion',
      endpointModeration: 'discussion',
      discussionId: this.$route.params.id,
      discussionRequest: undefined,
      discussion: undefined,
      needsModerationData: false,
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
  watch: {
    async discussion (next) {
      if (next && this.needsModerationData) {
        this.discussion = await this.appendModerationData(next)
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
    getDiscussion () {
      const API = this.$APIcli
      const params = { id: this.discussionId }
      this.isLoading = true
      API._request(this.getOperationId, { params }).then(
        results => {
          this.discussionRequest = results.url
          this.discussion = results.body
          this.needsModerationData = true
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
