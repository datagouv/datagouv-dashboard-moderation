<template>

  <b-card
    class="mt-3 mx-auto text-center"
    :style="`width: ${width};`"
    >
    <p><slot name="blockTitle"></slot></p>
    <p v-if="organizations">
      <b-badge pill variant="primary">
        {{ pagination.totalItems }}
        organizations
      </b-badge>
    </p>

    <p><slot name="link" class="mb-3"></slot></p>
    <div class="mb-2">
      from :
      <span v-if="organizationsRequest">
        <a :href="organizationsRequest" target="blank">
          {{ organizationsRequest }}
        </a>
      </span>
      <span v-else>
        {{ operationId }}
      </span>
    </div>

    <div
      v-if="organizations && pagination.totalItems > pagination.pageSize"
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
      v-if="organizations && !isLoading"
      striped hover responsive
      :small="small"
      :sticky-header="height"
      :fields="fields"
      :items="organizations.data"
      >

      <!-- A custom formatted column -->
      <template v-slot:cell(id)="data">
        <router-link
          class="text-info"
          :to="`/organizations/${data.value}`"
          >
          {{ data.value }}
        </router-link>
      </template>

      <!-- A virtual composite column -->
      <template v-slot:cell(name)="data">
        <router-link
          class="text-info"
          :to="`/organizations/${data.item.id}`"
          >
          <span>
            {{ data.value }}
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
  name: 'OrganizationsList',
  props: [
    'height',
    'width',
    'small',
    'customFields'
  ],
  data () {
    return {
      isLoading: false,
      operationId: 'list_organizations',
      organizations: undefined,
      organizationsRequest: undefined,
      pagination: {
        page: 1,
        pageSize: 20,
        totalItems: undefined,
        sort: '-created'
      },
      fields: [
        // 'index',
        { key: 'name', label: 'name', stickyColumn: true, isRowHeader: true },
        'description',
        { key: 'created_at', label: 'created at' },
        'id'
      ]
    }
  },
  created () {
    console.log('-C- OrganizationsList > created ... ')
    if (this.customFields) { this.fields = this.customFields }
    this.getOrganizations()
  },
  computed: {
    ...mapState({
      log: (state) => state.log
    })
  },
  methods: {
    getOrganizations () {
      this.isLoading = true
      const params = {
        page: this.pagination.page,
        page_size: this.pagination.pageSize,
        sort: this.pagination.sort
      }
      this.$APIcli._request(this.operationId, { params }).then(
        results => {
          console.log('-C- OrganizationsList > created > results.body :', results.body)
          this.organizationsRequest = results.url
          this.organizations = results.body
          this.pagination.totalItems = results.body.total
          this.isLoading = false
        },
        reason => console.error(`-C- OrganizationsList > failed on api call: ${reason}`)
      )
    },
    changePagination (pageNumber) {
      console.log('-C- OrganizationsList > changePagination > pageNumber ', pageNumber)
      this.pagination.page = pageNumber
      this.getOrganizations()
    }
  }
}

</script>

<style>
  .table > tbody > tr > td {
    vertical-align: middle;
  }
</style>
