<template>

  <b-card
    class="mt-3 mx-auto text-center"
    :style="`width: ${width};`"
    >
    <p><slot name="blockTitle"></slot></p>
    <p v-if="datasets">
      <b-badge pill variant="primary">
        {{ pagination.totalItems }}
        {{ $t('basics.datasets', {list: ''}) }}
      </b-badge>
    </p>

    <p><slot name="link" class="mb-3"></slot></p>
    <div class="mb-2">
      {{ $t('navigation.from') }} :
      <span v-if="datasetsRequest">
        <a :href="datasetsRequest" target="blank">
          {{ datasetsRequest }}
        </a>
      </span>
      <span v-else>
        {{ operationId }}
      </span>
    </div>

    <b-row
      align-v="center"
      class="my-3"
      >

      <b-col cols="8" md="6">
        <b-input-group>
          <b-input-group-prepend is-text>
            <b-icon icon="search"></b-icon>
          </b-input-group-prepend>
          <b-form-input
            id="inline-form-input-query-datasets"
            placeholder="search for a dataset"
            v-model="query"
            @input="getDatasets(true)"
            >
          </b-form-input>
          <b-input-group-append v-if="query">
            <b-button variant="outline-secondary" @click="resetQuery">
              <b-icon icon="x" aria-hidden="true"></b-icon>
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </b-col>

      <b-col
        v-if="datasets && pagination.totalItems > pagination.pageSize"
        class=""
        >
        <b-pagination
          @input="changePagination"
          v-model="pagination.page"
          :total-rows="pagination.totalItems"
          :per-page="pagination.pageSize"
          class="my-0"
          align="center"
          size="sm"
        ></b-pagination>
      </b-col>
    </b-row>

    <b-table
      v-if="datasets && !isLoading"
      striped hover responsive scrollable
      @sort-changed="changeSorting"
      :small="small"
      :sticky-header="height"
      :items="datasets.data"
      :fields="fields"
      :sort-by.sync="pagination.sortBy"
      :sort-desc.sync="pagination.sortDesc"
      >

      <!-- A virtual column -->
      <!-- <template v-slot:cell(index)="data">
        {{ data.index + 1 }}
      </template> -->

      <template v-slot:cell(title)="data">
        <router-link
          :to="`/datasets/${data.item.id}`"
          >
          <b>{{ data.item.title }}</b>
        </router-link>
      </template>

      <!-- A virtual composite column -->
      <template v-slot:cell(nameowner)="data">
        <router-link
          v-if="data.item.owner"
          :to="`/user/${data.item.owner.id}`"
          >
          {{ data.item.owner.first_name }}
          <b>{{ data.item.owner.last_name.toUpperCase() }}</b>
        </router-link>
      </template>

      <template v-slot:cell(organizationlogo)="data">
        <router-link
          v-if="data.item.organization"
          :to="`/organizations/${data.item.organization.id}`"
          >
          <b-img
            thumbnail
            fluid
            :src="data.item.organization.logo_thumbnail"
            :alt="data.item.organization.name">
          </b-img>
        </router-link>
      </template>

      <template v-slot:cell(created)="data">
        <i>{{ formatDate(data.item.created_at, addTime = false) }}</i>
      </template>
      <template v-slot:cell(last_modified)="data">
        <i>{{ formatDate(data.value) }}</i>
      </template>

      <template v-slot:cell(page)="data">
        <b-button variant="outline-primary" :href="data.item.page" target="_blank">
          <b-icon icon="link" aria-hidden="true"></b-icon>
        </b-button>
      </template>

      <template v-slot:cell(discussions)="data">
        <span>
          {{ data.item.metrics.discussions }}
        </span>
      </template>
      <template v-slot:cell(followers)="data">
        <span>
          {{ data.item.metrics.followers }}
        </span>
      </template>
      <template v-slot:cell(issues)="data">
        <span>
          {{ data.item.metrics.issues }}
        </span>
      </template>
      <template v-slot:cell(reuses)="data">
        <span>
          {{ data.item.metrics.reuses }}
        </span>
      </template>
      <template v-slot:cell(views)="data">
        <span>
          {{ data.item.metrics.views }}
        </span>
      </template>

      <!-- A custom formatted column -->
      <template v-slot:cell(id)="data">
        <router-link
          class="text-info"
          :to="`/datasets/${data.value}`"
          >
          {{ data.value }}
        </router-link>
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
  name: 'DatasetsList',
  props: [
    'height',
    'width',
    'small',
    'customFields'
  ],
  data () {
    return {
      isLoading: false,
      seeRaw: false,
      operationId: 'list_datasets',
      datasets: undefined,
      datasetsRequest: undefined,
      query: undefined,
      pagination: {
        page: 1,
        pageSize: 10,
        totalItems: undefined,
        sortBy: 'created',
        sortDesc: false
      },
      // sortOptions: [
      //   'title',
      //   'created',
      //   'last_modified',
      //   'reuses',
      //   'followers',
      //   'views',
      //   '-title',
      //   '-created',
      //   '-last_modified',
      //   '-reuses',
      //   '-followers',
      //   '-views'
      // ],
      fields: [
        // 'index',
        { key: 'title', stickyColumn: true, isRowHeader: true, sortable: true },
        'acronym',
        { key: 'organizationlogo', label: 'Organization logo' },
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
    console.log('-C- DatasetsList > created ... ')
    if (this.customFields) { this.fields = this.customFields }
    this.getDatasets()
  },
  computed: {
    ...mapState({
      log: (state) => state.log
    })
  },
  methods: {
    getDatasets (resetPage) {
      this.isLoading = true
      const params = {
        q: this.query,
        page: resetPage ? 1 : this.pagination.page,
        page_size: this.pagination.pageSize,
        sort: `${this.pagination.sortDesc ? '' : '-'}${this.pagination.sortBy}`
      }
      if (resetPage) { this.pagination.page = 1 }
      this.$APIcli._request(this.operationId, { params }).then(
        results => {
          // console.log('-C- DatasetsList > created > results :', results)
          console.log('-C- DatasetsList > created > results.body :', results.body)
          this.datasetsRequest = results.url
          this.datasets = results.body
          this.pagination.totalItems = results.body.total
          this.isLoading = false
        },
        reason => console.error(`-C- DatasetsList > failed on api call: ${reason}`)
      )
    },
    resetQuery () {
      this.query = undefined
      this.getDatasets(true)
    },
    changePagination (pageNumber) {
      console.log('-C- DatasetsList > changePagination > pageNumber ', pageNumber)
      this.pagination.page = pageNumber
      this.getDatasets()
    },
    changeSorting (sort) {
      console.log('-C- DatasetsList > changeSorting > sort ', sort)
      this.pagination.sortBy = sort.sortBy
      this.pagination.sortDesc = sort.sortDesc
      this.getDatasets()
    },
    formatDate (dateString, addTime) {
      return this.$formatDate(dateString, addTime)
    }
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
