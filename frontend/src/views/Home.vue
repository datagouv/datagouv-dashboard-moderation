<template>

  <div class="home">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

    <Homepage msg="Welcome to a naked datagouv SPA (oulala)"/>
    <br>
    <!-- <b-card
      class="mt-3 mx-auto text-center"
      style="width: 600px;"
      header="localStorageContainer"
      >
      <pre class="m-0">
        {{ localStorageContainer }}
      </pre>
    </b-card> -->

    <b-container fluid class="bv-example-row">
    <b-row
      align-h="center"
      cols="3"
      >
      <b-col cols="12" class="mt-4 mb-5">
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
      <b-col cols="8" class="mt-4 mb-5">
        <DatasetsSuggest
          >
          <template v-slot:blockTitle>
            <b-button variant="outline-primary" to="/datasets">
              DATASETS SUGGEST
            </b-button>
          </template>
        </DatasetsSuggest>
      </b-col>
      <b-col cols="6">
        <DatasetsList
          height="400px"
          width="100%"
          :small="true"
          :customFields="customeFields.datasets"
          >
          <template v-slot:blockTitle>
            <b-button variant="outline-primary" to="/datasets">
              DATASETS LIST
            </b-button>
          </template>
        </DatasetsList>
      </b-col>
      <b-col cols="6">
        <ReusesList
          height="400px"
          width="100%"
          :small="true"
          :customFields="customeFields.reuses"
          >
          <template v-slot:blockTitle>
            <b-button variant="outline-primary" to="/reuses">
              REUSES LIST
            </b-button>
          </template>
        </ReusesList>
      </b-col>
      <b-col cols="6">
        <DiscussionsList
          height="400px"
          width="100%"
          :small="true"
          :customFields="customeFields.discussions"
          >
          <template v-slot:blockTitle>
            <b-button variant="outline-primary" to="/discussions">
              DISCUSSIONS LIST
            </b-button>
          </template>
        </DiscussionsList>
      </b-col>
      <b-col cols="6">
        <IssuesList
          height="400px"
          width="100%"
          :small="true"
          :customFields="customeFields.issues"
          >
          <template v-slot:blockTitle>
            <b-button variant="outline-primary" to="/issues">
              ISSUES LIST
            </b-button>
          </template>
        </IssuesList>
      </b-col>
      <b-col cols="6">
        <UsersList
          height="400px"
          width="100%"
          :small="true"
          :customFields="customeFields.users"
          >
          <template v-slot:blockTitle>
            <b-button variant="outline-primary" to="/users">
              USERS LIST
            </b-button>
          </template>
        </UsersList>
      </b-col>
      <b-col cols="6">
        <OrganizationsList
          height="400px"
          width="100%"
          :small="true"
          :customFields="customeFields.organizations"
          >
          <template v-slot:blockTitle>
            <b-button variant="outline-primary" to="/organizations">
              ORGANIZATIONS LIST
            </b-button>
          </template>
        </OrganizationsList>
      </b-col>
    </b-row>
    </b-container>

  </div>

</template>

<script>
// @ is an alias to /src
import Homepage from '@/components/Homepage.vue'

import DatasetsList from '@/components/datasets/DatasetsList.vue'
import DatasetsSuggest from '@/components/datasets/DatasetsSuggest.vue'
import ReusesList from '@/components/reuses/ReusesList.vue'
import DiscussionsList from '@/components/discussions/DiscussionsList.vue'
import IssuesList from '@/components/issues/IssuesList.vue'
import UsersList from '@/components/users/UsersList.vue'
import OrganizationsList from '@/components/organizations/OrganizationsList.vue'

export default {
  name: 'Home',
  components: {
    Homepage,
    DatasetsList,
    DatasetsSuggest,
    ReusesList,
    DiscussionsList,
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
      customeFields: {
        datasets: [
          { key: 'created', label: 'Created at', sortable: true },
          { key: 'title', stickyColumn: true, isRowHeader: true },
          { key: 'organizationlogo', label: 'Organization logo' },
          { key: 'nameowner', label: 'Owner name' },
          { key: 'page', label: 'Page on datagouv' },
          { key: 'followers', label: 'Followers', sortable: true },
          { key: 'reuses', label: 'Reuses', sortable: true },
          { key: 'views', label: 'Views', sortable: true },
          { key: 'discussions', label: 'Discussions' },
          { key: 'issues', label: 'Issues' }
        ],
        reuses: [
          { key: 'imagethumbnail', label: 'image' },
          { key: 'created_at', label: 'created at', sortable: true },
          { key: 'title', label: 'title', stickyColumn: true, isRowHeader: true }
        ],
        discussions: [
          { key: 'created', label: 'created at', sortable: true },
          { key: 'title', label: 'title', stickyColumn: true, isRowHeader: true },
          { key: 'discussion', label: 'number of discussions', sortable: true },
          { key: 'subject', label: 'related to' }
        ],
        issues: [
          { key: 'created', label: 'created at', sortable: true },
          { key: 'title', label: 'title', stickyColumn: true, isRowHeader: true },
          { key: 'discussion', label: 'number of discussions', sortable: true },
          { key: 'subject', label: 'related to' }
        ],
        users: [
          { key: 'since', label: 'exists since', sortable: true },
          { key: 'name', label: 'Full Name', stickyColumn: true, isRowHeader: true, sortable: true },
          { key: 'datasets', label: 'datasets', sortable: true },
          { key: 'followers', label: 'followers', sortable: true },
          // { key: 'following', label: 'following' },
          { key: 'reuses', label: 'reuses', sortable: true }
        ],
        organizations: [
          { key: 'created_at', label: 'created at', sortable: true },
          { key: 'organizationlogo', label: 'logo' },
          { key: 'name', label: 'name', stickyColumn: true, isRowHeader: true }
        ]
      },
      crumbs: [
        {
          text: 'Home',
          active: true
        }
      ]
    }
  },
  created () {
    console.log('-V- HOME > created ...')
    this.getSite()
  },
  computed: {
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
          console.log('-V- HOME > created > results :', results)
          console.log('-V- HOME > created > results.body :', results.body)
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
