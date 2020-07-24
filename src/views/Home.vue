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
      <!-- <b-card-group
        columns
        > -->
        <b-col cols="6">
          <DatasetsList
            height="400px"
            width="100%"
            >
            <template v-slot:blockTitle>
              <b-button variant="outline-primary" to="/datasets">
                DATASETS LIST
              </b-button>
            </template>
          </DatasetsList>
        </b-col>
        <b-col>
          <DiscussionsList
            :discussions="discussions"
            height="400px"
            width="100%"
            >
            <template v-slot:blockTitle>
              <b-button variant="outline-primary" to="/discussions">
                DISCUSSIONS LIST
              </b-button>
            </template>
          </DiscussionsList>
        </b-col>
        <b-col>
          <IssuesList
            :issues="issues"
            height="400px"
            width="100%"
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
            :users="users"
            height="400px"
            width="100%"
            >
            <template v-slot:blockTitle>
              <b-button variant="outline-primary" to="/users">
                USERS LIST
              </b-button>
            </template>
          </UsersList>
        </b-col>
      <!-- </b-card-group> -->
    </b-row>
    </b-container>

  </div>

</template>

<script>
// @ is an alias to /src
import Homepage from '@/components/Homepage.vue'

import DatasetsList from '@/components/datasets/DatasetsList.vue'
import DiscussionsList from '@/components/discussions/DiscussionsList.vue'
import IssuesList from '@/components/issues/IssuesList.vue'
import UsersList from '@/components/users/UsersList.vue'

export default {
  name: 'Home',
  components: {
    Homepage,
    DatasetsList,
    DiscussionsList,
    IssuesList,
    UsersList
  },
  data () {
    return {
      operations: [
        // { dataKey: 'datasets', operationId: 'list_datasets' },
        { dataKey: 'users', operationId: 'list_users' },
        { dataKey: 'issues', operationId: 'list_issues' },
        { dataKey: 'discussions', operationId: 'list_discussions' }
      ],
      datasets: undefined,
      discussions: undefined,
      issues: undefined,
      users: undefined,
      crumbs: [
        {
          text: 'Home',
          active: true
        }
      ]
      // localStorageContainer: {
      //   codeVerifier: '...',
      //   state: '...',
      //   accessToken: '...',
      //   refreshToken: '...'
      // }
    }
  },
  created () {
    console.log('-V- HOME > created ...')
    // this.localStorageContainer.state = localStorage.dgfState
    // this.localStorageContainer.codeVerifier = localStorage.dgfCodeVerif
    // this.localStorageContainer.accessToken = localStorage.dgfAccessToken
    // this.localStorageContainer.refreshToken = localStorage.dgfRefreshToken
    for (const op of this.operations) {
      console.log('-V- HOME > created > op : ', op)
      this.getDataFromOperationId(op)
    }
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
    getDataFromOperationId (operation) {
      this.$APIcli._request(operation.operationId).then(
        results => {
          console.log('-V- Datasets > getDataFromOperationId > results.body :', results.body)
          this[operation.dataKey] = results.body
        },
        reason => console.error(`-V- Datasets > getDataFromOperationId > failed on api call: ${reason}`)
      )
    }
  }
}
</script>
