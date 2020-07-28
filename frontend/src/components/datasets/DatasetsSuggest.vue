<template>

  <b-card
    class="mt-3 mx-auto text-center"
    >
    <p><slot name="blockTitle"></slot></p>

    <p><slot name="link" class="mb-3"></slot></p>
    <div class="mb-2">
      from :
      <span v-if="datasetsRequest">
        <a :href="datasetsRequest" target="blank">
          {{ datasetsRequest }}
        </a>
      </span>
      <span v-else>
        {{ operationId }}
      </span>
    </div>

    <!-- QUERY -->
    <b-form-input
      id="inline-form-input-query"
      placeholder="your query"
      v-model="query"
      @input="suggestDatasets"
      list="suggestions-list"
      >
    </b-form-input>
    <b-form-datalist
      id="suggestions-list"
      :options="suggestions">
    </b-form-datalist>

    <p
      v-if="datasets"
      >
      <code>
        {{ datasets }}
      </code>
    </p>

    <!-- <div
      v-if="datasets && pagination.totalItems > pagination.pageSize"
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
    </div> -->

    <b-table
      v-if="datasets && !isLoading"
      striped hover responsive scrollable
      :small="small"
      :sticky-header="height"
      :items="datasets.data"
      >

    </b-table>

    <p v-if="isLoading">
      <b-spinner label="loading"></b-spinner>
    </p>
  </b-card>

</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'DatasetsSuggest',
  props: [
    'height',
    'width',
    'small',
    'customFields'
  ],
  data () {
    return {
      isLoading: false,
      operationId: 'suggest_territory',
      datasets: undefined,
      datasetsRequest: undefined,
      query: undefined,
      size: 3,
      suggestions: [],
      pagination: {
        // page: 1,
        // pageSize: 10,
        // totalItems: undefined,
        // sortBy: 'created',
        // sortDesc: false
      },
      fields: [
        // 'index',
        { key: 'title', stickyColumn: true, isRowHeader: true, sortable: true },
        'acronym',
        { key: 'nameowner', label: 'Owner name' },
        { key: 'page', label: 'Page on datagouv' },
        { key: 'created', label: 'Created at', sortable: true },
        { key: 'last_modified', label: 'Last modified', sortable: true },
        { key: 'reuses', label: 'Reuses', sortable: true },
        { key: 'views', label: 'Views', sortable: true },
        { key: 'discussions', label: 'Discussions' },
        { key: 'followers', label: 'Followers' },
        { key: 'issues', label: 'Issues' },
        'id'
      ]
    }
  },
  created () {
    console.log('-C- DatasetsSuggest > created ... ')
    if (this.customFields) { this.fields = this.customFields }
    // this.suggestDatasets()
  },
  computed: {
    ...mapState({
      log: (state) => state.log
    })
  },
  methods: {
    suggestDatasets () {
      this.isLoading = true
      const params = {
        q: this.query,
        size: this.size
      }
      const body = {}
      const authNeeded = false
      this.$APIcli._request(this.operationId, { params, body, needAuth: authNeeded }).then(
        results => {
          console.log('-C- DatasetsSuggest > created > results :', results)
          console.log('-C- DatasetsSuggest > created > results.body :', results.body)
          this.datasetsRequest = results.url
          this.datasets = results.body
          this.isLoading = false
        },
        reason => console.error(`-C- DatasetsSuggest > failed on api call: ${reason}`)
      )
    }
    // changePagination (pageNumber) {
    //   console.log('-C- DatasetsSuggest > changePagination > pageNumber ', pageNumber)
    //   this.pagination.page = pageNumber
    //   this.getDatasets()
    // },
    // changeSorting (sort) {
    //   console.log('-C- DatasetsSuggest > changeSorting > sort ', sort)
    //   this.pagination.sortBy = sort.sortBy
    //   this.pagination.sortDesc = sort.sortDesc
    //   this.getDatasets()
    // },
    // formatDate (dateString, addTime) {
    //   return this.$formatDate(dateString, addTime)
    // }
  }
}

</script>

<style>
  .table > tbody > tr > td {
    vertical-align: middle;
  }
  .table > thead > tr > th {
    vertical-align: middle !important;
  }
</style>
