<template>

  <b-card
    class="mt-3 mx-auto text-center"
    :style="`width: ${width};`"
    >
    <p><slot name="blockTitle"></slot></p>
    <p v-if="datasets">
      <b-badge pill variant="primary">
        {{ pagination.totalItems }}
        datasets
      </b-badge>
    </p>

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

    <div
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
    </div>

    <b-table
      v-if="datasets && !isLoading"
      striped hover responsive scrollable
      :sticky-header="height"
      :fields="fields"
      :items="datasets.data"
      >

      <!-- A virtual column -->
      <!-- <template v-slot:cell(index)="data">
        {{ data.index + 1 }}
      </template> -->

      <template v-slot:cell(title)="data">
        <router-link
          :to="`/dataset/${data.item.id}`"
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

      <!-- Optional default data cell scoped slot -->
      <template v-slot:cell(created)="data">
        <i>{{ data.item.created_at }}</i>
      </template>

      <!-- Optional default data cell scoped slot -->
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
          :to="`/dataset/${data.value}`"
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
    'width'
  ],
  data () {
    return {
      isLoading: false,
      operationId: 'list_datasets',
      datasets: undefined,
      datasetsRequest: undefined,
      pagination: {
        page: 1,
        pageSize: 10,
        totalItems: undefined,
        sort: '-created'
      },
      fields: [
        // 'index',
        { key: 'title', stickyColumn: true, isRowHeader: true },
        'acronym',
        { key: 'nameowner', label: 'Owner name' },
        { key: 'page', label: 'Page on datagouv' },
        { key: 'created', label: 'Created at' },
        { key: 'discussions', label: 'Discussions' },
        { key: 'followers', label: 'Followers' },
        { key: 'issues', label: 'Issues' },
        { key: 'reuses', label: 'Reuses' },
        { key: 'views', label: 'Views' },
        'id'
      ]
    }
  },
  created () {
    console.log('-C- DatasetsList > created ... ')
    this.getDatasets()
  },
  computed: {
    ...mapState({
      log: (state) => state.log
    })
  },
  methods: {
    getDatasets () {
      this.isLoading = true
      const params = {
        page: this.pagination.page,
        page_size: this.pagination.pageSize,
        sort: this.pagination.sort
      }
      this.$APIcli._request(this.operationId, { params }).then(
        results => {
          console.log('-C- DatasetsList > created > results :', results)
          console.log('-C- DatasetsList > created > results.body :', results.body)
          this.datasetsRequest = results.url
          this.datasets = results.body
          this.pagination.totalItems = results.body.total
          this.isLoading = false
        },
        reason => console.error(`-C- DatasetsList > failed on api call: ${reason}`)
      )
    },
    changePagination (pageNumber) {
      console.log('-C- DatasetsList > changePagination > pageNumber ', pageNumber)
      this.pagination.page = pageNumber
      this.getDatasets()
    }
  }
}

</script>

<style>
  .table > tbody > tr > td {
    vertical-align: middle;
  }
</style>
