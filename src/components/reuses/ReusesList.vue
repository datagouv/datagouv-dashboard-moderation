<template>

  <b-card
    class="mt-3 mx-auto text-center"
    :style="`width: ${width};`"
    >
    <p><slot name="blockTitle"></slot></p>
    <p v-if="reuses">
      <b-badge pill variant="primary">
        {{ pagination.totalItems }}
        reuses
      </b-badge>
    </p>

    <p><slot name="link" class="mb-3"></slot></p>
    <div class="mb-2">
      from :
      <span v-if="reusesRequest">
        <a :href="reusesRequest" target="blank">
          {{ reusesRequest }}
        </a>
      </span>
      <span v-else>
        {{ operationId }}
      </span>
    </div>

    <div
      v-if="reuses && pagination.totalItems > pagination.pageSize"
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
      v-if="reuses && !isLoading"
      striped hover responsive
      :sticky-header="height"
      :fields="fields"
      :items="reuses.data"
      >

      <!-- A custom formatted column -->
      <template v-slot:cell(id)="data">
        <router-link
          class="text-info"
          :to="`/reuses/${data.value}`"
          >
          {{ data.value }}
        </router-link>
      </template>

      <!-- A virtual composite column -->
      <template v-slot:cell(title)="data">
        <router-link
          class="text-info"
          :to="`/reuses/${data.item.id}`"
          >
          <span>
            {{ data.item.title }}
          </span>
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
  name: 'ReusesList',
  props: [
    'height',
    'width'
  ],
  data () {
    return {
      isLoading: false,
      operationId: 'list_reuses',
      reuses: undefined,
      reusesRequest: undefined,
      pagination: {
        page: 1,
        pageSize: 20,
        totalItems: undefined,
        sort: 'created'
      },
      fields: [
        // 'index',
        { key: 'title', label: 'title', stickyColumn: true, isRowHeader: true },
        'description',
        { key: 'created_at', label: 'created at' },
        'id'
      ]
    }
  },
  created () {
    console.log('-C- ReusesList > created ... ')
    this.getReuses()
  },
  computed: {
    ...mapState({
      log: (state) => state.log
    })
  },
  methods: {
    getReuses () {
      this.isLoading = true
      const params = {
        page: this.pagination.page,
        page_size: this.pagination.pageSize,
        sort: this.pagination.sort
      }
      this.$APIcli._request(this.operationId, { params }).then(
        results => {
          console.log('-C- ReusesList > created > results.body :', results.body)
          this.reusesRequest = results.url
          this.reuses = results.body
          this.pagination.totalItems = results.body.total
          this.isLoading = false
        },
        reason => console.error(`-C- ReusesList > failed on api call: ${reason}`)
      )
    },
    changePagination (pageNumber) {
      console.log('-C- ReusesList > changePagination > pageNumber ', pageNumber)
      this.pagination.page = pageNumber
      this.getReuses()
    }
  }
}

</script>

<style>
  .table > tbody > tr > td {
    vertical-align: middle;
  }
</style>
