<template>

  <div class="home">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
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
    ReusesList,
    DiscussionsList,
    IssuesList,
    UsersList,
    OrganizationsList
  },
  data () {
    return {
      customeFields: {
        datasets: [
          { key: 'title', stickyColumn: true, isRowHeader: true },
          { key: 'nameowner', label: 'Owner name' },
          { key: 'page', label: 'Page on datagouv' },
          { key: 'created', label: 'Created at', sortable: true },
          { key: 'discussions', label: 'Discussions' },
          { key: 'followers', label: 'Followers' },
          { key: 'issues', label: 'Issues' },
          { key: 'reuses', label: 'Reuses' },
          { key: 'views', label: 'Views' }
        ],
        reuses: [
          { key: 'title', label: 'title', stickyColumn: true, isRowHeader: true },
          { key: 'created_at', label: 'created at', sortable: true }
        ],
        discussions: [
          { key: 'title', label: 'title', stickyColumn: true, isRowHeader: true },
          { key: 'discussion', label: 'number of discussions', sortable: true },
          { key: 'subject', label: 'related to' },
          { key: 'created', label: 'created at', sortable: true }
        ],
        issues: [
          { key: 'title', label: 'title', stickyColumn: true, isRowHeader: true },
          { key: 'discussion', label: 'number of discussions', sortable: true },
          { key: 'subject', label: 'related to' },
          { key: 'created', label: 'created at', sortable: true }
        ],
        users: [
          { key: 'name', label: 'Full Name', stickyColumn: true, isRowHeader: true, sortable: true },
          { key: 'datasets', label: 'datasets', sortable: true },
          { key: 'followers', label: 'followers', sortable: true },
          { key: 'following', label: 'following' },
          { key: 'reuses', label: 'reuses', sortable: true },
          { key: 'since', label: 'exists since', sortable: true }
        ],
        organizations: [
          { key: 'name', label: 'name', stickyColumn: true, isRowHeader: true },
          { key: 'created_at', label: 'created at', sortable: true }
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
  }
}
</script>
