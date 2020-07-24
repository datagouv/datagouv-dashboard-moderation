<template>

  <b-card
    class="mt-3 mx-auto text-center"
    :style="`width: ${width};`"
    >
    <p><slot name="blockTitle"></slot></p>
    <p v-if="issues">
      <b-badge pill variant="primary">
        {{ pagination.totalItems }}
        issues
      </b-badge>
    </p>

    <p><slot name="link" class="mb-3"></slot></p>
    <div class="mb-2">
      from :
      <span v-if="issuesRequest">
        <a :href="issuesRequest" target="blank">
          {{ issuesRequest }}
        </a>
      </span>
      <span v-else>
        {{ operationId }}
      </span>
    </div>

    <div
      v-if="issues && pagination.totalItems > pagination.pageSize"
      class="my-2"
      >
      <b-pagination
        @input="changePagination"
        v-model="pagination.page"
        :total-rows="pagination.totalItems"
        :per-page="pagination.pageSize"
        align="center"
        size="sm"
      ></b-pagination>
    </div>

    <b-table
      v-if="issues && !isLoading"
      striped hover responsive
      :sticky-header="height"
      :fields="fields"
      :items="issues.data"
      >

      <!-- A virtual column -->
      <!-- <template v-slot:cell(index)="data">
        {{ data.index + 1 }}
      </template> -->

      <template v-slot:cell(discussion)="data">
        {{ data.item.discussion.length }}
      </template>

      <!-- A custom formatted column -->
      <template v-slot:cell(id)="data">
        <router-link
          class="text-info"
          :to="`/issue/${data.value}`"
          >
          {{ data.value }}
        </router-link>
      </template>

      <!-- A virtual composite column -->
      <template v-slot:cell(title)="data">
        <router-link
          class="text-info"
          :to="`/issue/${data.item.id}`"
          >
          <span>
            {{ data.item.title }}
          </span>
        </router-link>
      </template>

      <template v-slot:cell(subject)="data">
        <b-button
          variant="outline-primary"
          :to="`/${data.item.subject.class.toLowerCase()}/${data.item.subject.id}`"
          >
          {{ data.item.subject.class.toLowerCase() }}
        </b-button>
      </template>

    </b-table>

    <p v-if="isLoading">
      <b-spinner label="loading"></b-spinner>
    </p>
  </b-card>

</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'IssuesList',
  props: [
    'height',
    'width'
  ],
  data () {
    return {
      isLoading: false,
      operationId: 'list_issues',
      issues: undefined,
      issuesRequest: undefined,
      pagination: {
        page: 1,
        pageSize: 20,
        sort: '-created'
      },
      fields: [
        // 'index',
        { key: 'title', label: 'title', stickyColumn: true, isRowHeader: true },
        { key: 'discussion', label: 'number of discussions' },
        { key: 'subject', label: 'related to' },
        'id'
      ]
    }
  },
  created () {
    console.log('-C- IssuesList > created ... ')
    this.getIssues()
  },
  computed: {
    ...mapState({
      log: (state) => state.log
    })
  },
  methods: {
    getIssues () {
      this.isLoading = true
      const params = {
        page: this.pagination.page,
        page_size: this.pagination.pageSize,
        totalItems: undefined,
        sort: this.pagination.sort
      }
      this.$APIcli._request(this.operationId, { params }).then(
        results => {
          console.log('-C- IssuesList > created > results.body :', results.body)
          this.issuesRequest = results.url
          this.issues = results.body
          this.pagination.totalItems = results.body.total
          this.isLoading = false
        },
        reason => console.error(`-C- IssuesList > failed on api call: ${reason}`)
      )
    },
    changePagination (pageNumber) {
      console.log('-C- IssuesList > changePagination > pageNumber ', pageNumber)
      this.pagination.page = pageNumber
      this.getIssues()
    }
  }
}

</script>

<style>
  .table > tbody > tr > td {
    vertical-align: middle;
  }
</style>
