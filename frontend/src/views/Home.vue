<template>

  <div class="home">

    <NavCrumbs
      :crumbs="crumbs"
    />

    <Homepage/>

    <b-container fluid >
      <b-row
        align-h="center"
        cols="3"
        class="bg-light px-4"
        >

        <b-col cols="12" class="pt-5">
          <h3 v-if="!isLoading && site">
            <b-badge
              class="mr-2 mb-2"
              v-for="(metric, key, index) in site.metrics"
              :key="index"
              pill
              medium
              variant="secondary"
              >
              {{metric}}
              {{key}}
            </b-badge>
          </h3>
        </b-col>

        <b-col cols="6" class="px-3">
          <DatasetsList
            height="400px"
            :small="true"
            :noQueryAdd="true"
            :customFields="customFields.datasets"
            :customClass="'mt-5 pt-4 bg-white'"
            :noOperationLink="true"
            :compact="true"
            >
            <!-- <template v-slot:blockTitle>
              <b-button variant="outline-primary" to="/datasets">
                {{ $t('basics.datasets', {list: $t('basics.list')}) }}
              </b-button>
            </template> -->
          </DatasetsList>
        </b-col>

        <!-- <b-col cols="6" class="px-3">
          <ResourcesList
            height="400px"
            :small="true"
            :noQueryAdd="true"
            :customFields="customFields.resourcesCommunity"
            :customClass="'mt-5 pt-4 bg-white'"
            :noOperationLink="true"
            resourcesType="community"
            >
            <template v-slot:blockTitle>
              <b-button variant="outline-primary" to="/resources-community">
                {{ $t('basics.community_resource', {list: $t('basics.list')}) }}
              </b-button>
            </template>
          </ResourcesList>
        </b-col> -->

        <!-- <b-col cols="6" class="px-3">
          <ReusesList
            height="400px"
            :small="true"
            :noQueryAdd="true"
            :customFields="customFields.reuses"
            :customClass="'mt-5 pt-4 bg-white'"
            :noOperationLink="true"
            :compact="true"
            >
            <template v-slot:blockTitle>
              <b-button variant="outline-primary" to="/reuses">
                {{ $t('basics.reuses', {list: $t('basics.list')}) }}
              </b-button>
            </template>
          </ReusesList>
        </b-col> -->

        <!-- <b-col cols="6" class="px-3">
          <DiscussionsList
            height="400px"
            :small="true"
            :noQueryAdd="true"
            :customFields="customFields.discussions"
            :customClass="'mt-5 pt-4 bg-white'"
            :noOperationLink="true"
            :compact="true"
            >
            <template v-slot:blockTitle>
              <b-button variant="outline-primary" to="/discussions">
                {{ $t('basics.discussions', {list: $t('basics.list')}) }}
              </b-button>
            </template>
          </DiscussionsList>
        </b-col> -->

        <b-col cols="6" class="px-3">
          <IssuesList
            height="400px"
            :small="true"
            :noQueryAdd="true"
            :customFields="customFields.issues"
            :customClass="'mt-5 pt-4 bg-white'"
            :noOperationLink="true"
            :compact="true"
            >
            <template v-slot:blockTitle>
              <b-button variant="outline-primary" to="/issues">
                {{ $t('basics.issues', {list: $t('basics.list')}) }}
              </b-button>
            </template>
          </IssuesList>
        </b-col>

        <b-col cols="6" class="px-3">
          <UsersList
            height="400px"
            :small="true"
            :noQueryAdd="true"
            :customFields="customFields.users"
            :customClass="'mt-5 pt-4 bg-white'"
            :noOperationLink="true"
            :compact="true"
            >
            <template v-slot:blockTitle>
              <b-button variant="outline-primary" to="/users">
                {{ $t('basics.users', {list: $t('basics.list')}) }}
              </b-button>
            </template>
          </UsersList>
        </b-col>

        <b-col cols="6" class="px-3">
          <OrganizationsList
            height="400px"
            :small="true"
            :noQueryAdd="true"
            :customFields="customFields.organizations"
            :customClass="'mt-5 pt-4 bg-white'"
            :noOperationLink="true"
            :compact="true"
            >
            <template v-slot:blockTitle>
              <b-button variant="outline-primary" to="/organizations">
                {{ $t('basics.organizations', {list: $t('basics.list')}) }}
              </b-button>
            </template>
          </OrganizationsList>
        </b-col>

      </b-row>
    </b-container>

  </div>

</template>

<script>
import { mapState } from 'vuex'

// @ is an alias to /src
import NavCrumbs from '@/components/ux/NavCrumbs.vue'
import Homepage from '@/components/Homepage.vue'

// import DatasetsSuggest from '@/components/datasets/DatasetsSuggest.vue'
import DatasetsList from '@/components/datasets/DatasetsList.vue'
// import ResourcesList from '@/components/resources/ResourcesList.vue'
// import ReusesList from '@/components/reuses/ReusesList.vue'
// import DiscussionsList from '@/components/discussions/DiscussionsList.vue'
import IssuesList from '@/components/issues/IssuesList.vue'
import UsersList from '@/components/users/UsersList.vue'
import OrganizationsList from '@/components/organizations/OrganizationsList.vue'

export default {
  name: 'Home',
  components: {
    NavCrumbs,
    Homepage,
    // DatasetsSuggest,
    DatasetsList,
    // ResourcesList,
    // ReusesList,
    // DiscussionsList,
    IssuesList,
    UsersList,
    OrganizationsList
  },
  data () {
    return {
      isLoading: false,
      operationId: 'get_site',
      site: undefined,
      siteRequest: undefined,
      customFields: {
        datasets: [
          { key: 'selection', label: 'Selection', stickyColumn: true, isRowHeader: true, sortable: false },
          { key: 'moderation', label: 'Moderation', stickyColumn: true, isRowHeader: true },
          { key: 'moderation_read', label: 'Read', stickyColumn: true, isRowHeader: true, sortable: true },
          { key: 'moderation_suspect', label: 'Suspect', stickyColumn: true, isRowHeader: true, sortable: true },
          { key: 'moderation_deleted', label: 'Deleted', stickyColumn: true, isRowHeader: true, sortable: true },
          { key: 'title', stickyColumn: true, isRowHeader: true },
          { key: 'created', label: 'Created at', sortable: true },
          { key: 'organizationlogo', label: 'Organization logo' },
          { key: 'nameowner', label: 'Owner name' },
          { key: 'page', label: 'Page on datagouv' },
          { key: 'followers', label: 'Followers', sortable: true },
          { key: 'reuses', label: 'Reuses', sortable: true },
          { key: 'views', label: 'Views', sortable: true },
          { key: 'discussions', label: 'Discussions' },
          { key: 'issues', label: 'Issues' }
        ],
        resourcesCommunity: [
          { key: 'selection', label: 'Selection', stickyColumn: true, isRowHeader: true, sortable: false },
          { key: 'moderation', label: 'Moderation', stickyColumn: true, isRowHeader: true },
          { key: 'moderation_read', label: 'Read', stickyColumn: true, isRowHeader: true, sortable: true },
          { key: 'moderation_suspect', label: 'Suspect', stickyColumn: true, isRowHeader: true, sortable: true },
          { key: 'moderation_deleted', label: 'Deleted', stickyColumn: true, isRowHeader: true, sortable: true },
          { key: 'title', label: 'title', stickyColumn: true, isRowHeader: true },
          { key: 'created_at', label: 'created at', sortable: true },
          'id'
        ],
        reuses: [
          { key: 'selection', label: 'Selection', stickyColumn: true, isRowHeader: true, sortable: false },
          { key: 'moderation', label: 'Moderation', stickyColumn: true, isRowHeader: true },
          { key: 'moderation_read', label: 'Read', stickyColumn: true, isRowHeader: true, sortable: true },
          { key: 'moderation_suspect', label: 'Suspect', stickyColumn: true, isRowHeader: true, sortable: true },
          { key: 'moderation_deleted', label: 'Deleted', stickyColumn: true, isRowHeader: true, sortable: true },
          { key: 'title', label: 'title', stickyColumn: true, isRowHeader: true },
          { key: 'created_at', label: 'created at', sortable: true },
          { key: 'imagethumbnail', label: 'image' }
        ],
        discussions: [
          { key: 'selection', label: 'Selection', stickyColumn: true, isRowHeader: true, sortable: false },
          { key: 'moderation', label: 'Moderation', stickyColumn: true, isRowHeader: true },
          { key: 'moderation_read', label: 'Read', stickyColumn: true, isRowHeader: true, sortable: true },
          { key: 'moderation_suspect', label: 'Suspect', stickyColumn: true, isRowHeader: true, sortable: true },
          { key: 'moderation_deleted', label: 'Deleted', stickyColumn: true, isRowHeader: true, sortable: true },
          { key: 'title', label: 'title', stickyColumn: true, isRowHeader: true },
          { key: 'created', label: 'created at', sortable: true },
          { key: 'discussion', label: 'number of discussions', sortable: true },
          { key: 'subject', label: 'related to' }
        ],
        issues: [
          { key: 'selection', label: 'Selection', stickyColumn: true, isRowHeader: true, sortable: false },
          { key: 'moderation', label: 'Moderation', stickyColumn: true, isRowHeader: true },
          { key: 'moderation_read', label: 'Read', stickyColumn: true, isRowHeader: true, sortable: true },
          { key: 'moderation_suspect', label: 'Suspect', stickyColumn: true, isRowHeader: true, sortable: true },
          { key: 'moderation_deleted', label: 'Deleted', stickyColumn: true, isRowHeader: true, sortable: true },
          { key: 'title', label: 'title', stickyColumn: true, isRowHeader: true },
          { key: 'created', label: 'created at', sortable: true },
          { key: 'discussion', label: 'number of discussions', sortable: true },
          { key: 'subject', label: 'related to' }
        ],
        users: [
          { key: 'selection', label: 'Selection', stickyColumn: true, isRowHeader: true, sortable: false },
          { key: 'moderation', label: 'Moderation', stickyColumn: true, isRowHeader: true },
          { key: 'moderation_read', label: 'Read', stickyColumn: true, isRowHeader: true, sortable: true },
          { key: 'moderation_suspect', label: 'Suspect', stickyColumn: true, isRowHeader: true, sortable: true },
          { key: 'moderation_deleted', label: 'Deleted', stickyColumn: true, isRowHeader: true, sortable: true },
          { key: 'name', label: 'Full Name', stickyColumn: true, isRowHeader: true, sortable: true },
          { key: 'since', label: 'exists since', sortable: true },
          { key: 'datasets', label: 'datasets', sortable: true },
          { key: 'followers', label: 'followers', sortable: true },
          // { key: 'following', label: 'following' },
          { key: 'reuses', label: 'reuses', sortable: true }
        ],
        organizations: [
          { key: 'selection', label: 'Selection', stickyColumn: true, isRowHeader: true, sortable: false },
          { key: 'moderation', label: 'Moderation', stickyColumn: true, isRowHeader: true },
          { key: 'moderation_read', label: 'Read', stickyColumn: true, isRowHeader: true, sortable: true },
          { key: 'moderation_suspect', label: 'Suspect', stickyColumn: true, isRowHeader: true, sortable: true },
          { key: 'moderation_deleted', label: 'Deleted', stickyColumn: true, isRowHeader: true, sortable: true },
          { key: 'name', label: 'name', stickyColumn: true, isRowHeader: true },
          { key: 'created_at', label: 'created at', sortable: true },
          { key: 'organizationlogo', label: 'logo' }
        ]
      },
      crumbs: [
        {
          text: this.$t('home.name'),
          active: true
        }
      ]
    }
  },
  created () {
    this.getSite()
  },
  computed: {
    ...mapState({
      userData: (state) => state.user.user
    }),
    localStorageContainer () {
      return {
        codeVerifier: localStorage.dgfState,
        state: localStorage.dgfCodeVerif,
        accessToken: localStorage.dgfAccessToken,
        refreshToken: localStorage.dgfRefreshToken,
        expiresIn: localStorage.dgfAccessTokenExpires,
        tokenType: localStorage.dgfTokenType
      }
    }
  },
  methods: {
    getSite () {
      this.isLoading = true
      const params = {}
      this.$APIcli._request(this.operationId, { params }).then(
        results => {
          this.siteRequest = results.url
          this.site = results.body
          this.isLoading = false
        },
        reason => console.error(`-V- HOME > failed on api call: ${reason}`)
      )
    }
  }
}
</script>
