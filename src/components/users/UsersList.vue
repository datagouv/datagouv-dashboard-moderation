<template>

  <b-card
    class="mt-3 mx-auto text-center"
    :style="`width: ${width};`"
    >
    <p><slot name="blockTitle"></slot></p>
    <p v-if="users">
      <b-badge pill variant="primary">
        {{ pagination.totalItems }}
        users
      </b-badge>
    </p>

    <p><slot name="link" class="mb-3"></slot></p>
    <div class="mb-2">
      from :
      <span v-if="usersRequest">
        <a :href="usersRequest" target="blank">
          {{ usersRequest }}
        </a>
      </span>
      <span v-else>
        {{ operationId }}
      </span>
    </div>

    <div
      v-if="users && pagination.totalItems > pagination.pageSize"
      class="my-2">
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
      v-if="users && !isLoading"
      striped hover responsive
      :sticky-header="height"
      :fields="fields"
      :items="users.data"
      >

      <!-- A virtual column -->
      <!-- <template v-slot:cell(index)="data">
        {{ data.index + 1 }}
      </template> -->

      <!-- A custom formatted column -->
      <template v-slot:cell(id)="data">
        <router-link
          class="text-info"
          :to="`/user/${data.value}`"
          >
          {{ data.value }}
        </router-link>
      </template>

      <!-- A virtual composite column -->
      <template v-slot:cell(name)="data">
        <router-link
          class="text-info"
          :to="`/user/${data.item.id}`"
          >
          <span>
            {{ data.item.first_name }} <b>{{ data.item.last_name.toUpperCase() }}</b>
          </span>
        </router-link>
      </template>

      <template v-slot:cell(page)="data">
        <b-button variant="outline-primary" :href="data.item.page" target="_blank">
          <b-icon icon="link" aria-hidden="true"></b-icon>
        </b-button>
      </template>

      <template v-slot:cell(datasets)="data">
        <span>
          {{ data.item.metrics.datasets }}
        </span>
      </template>
      <template v-slot:cell(followers)="data">
        <span>
          {{ data.item.metrics.followers }}
        </span>
      </template>
      <template v-slot:cell(following)="data">
        <span>
          {{ data.item.metrics.following }}
        </span>
      </template>
      <template v-slot:cell(reuses)="data">
        <span>
          {{ data.item.metrics.reuses }}
        </span>
      </template>
      <template v-slot:cell(roles)="data">
        <span>
          {{ data.item.roles.join(" | ") }}
        </span>
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
  name: 'UsersList',
  props: [
    'height',
    'width'
  ],
  data () {
    return {
      isLoading: false,
      operationId: 'list_users',
      users: undefined,
      usersRequest: undefined,
      pagination: {
        page: 1,
        pageSize: 20,
        totalItems: undefined,
        sort: '-created'
      },
      fields: [
        // 'index',
        { key: 'name', label: 'Full Name', stickyColumn: true, isRowHeader: true },
        { key: 'roles', label: 'roles' },
        { key: 'datasets', label: 'datasets' },
        { key: 'followers', label: 'followers' },
        { key: 'following', label: 'following' },
        { key: 'reuses', label: 'reuses' },
        { key: 'page', label: 'page' },
        'id'
      ]
    }
  },
  created () {
    console.log('-C- UsersList > created ... ')
    this.getUsers()
  },
  computed: {
    ...mapState({
      log: (state) => state.log
    })
  },
  methods: {
    getUsers () {
      this.isLoading = true
      const params = {
        page: this.pagination.page,
        page_size: this.pagination.pageSize,
        sort: this.pagination.sort
      }
      this.$APIcli._request(this.operationId, { params }).then(
        results => {
          console.log('-C- UsersList > created > results.body :', results.body)
          this.usersRequest = results.url
          this.users = results.body
          this.pagination.totalItems = results.body.total
          this.isLoading = false
        },
        reason => console.error(`-C- UsersList > failed on api call: ${reason}`)
      )
    },
    changePagination (pageNumber) {
      console.log('-C- UsersList > changePagination > pageNumber ', pageNumber)
      this.pagination.page = pageNumber
      this.getUsers()
    }
  }
}

</script>

<style>
  .table > tbody > tr > td {
    vertical-align: middle;
  }
</style>
