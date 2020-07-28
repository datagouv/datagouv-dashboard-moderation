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
            id="inline-form-input-query-users"
            placeholder="search for an user"
            v-model="query"
            @input="getUsers(true)"
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
        v-if="users && pagination.totalItems > pagination.pageSize"
        class="my-2"
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
      v-if="users && !isLoading"
      striped hover responsive
      @sort-changed="changeSorting"
      :small="small"
      :sticky-header="height"
      :items="users.data"
      :fields="fields"
      :sort-by.sync="pagination.sortBy"
      :sort-desc.sync="pagination.sortDesc"
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

      <template v-slot:cell(since)="data">
        <i>{{ formatDate(data.value, addTime = false) }}</i>
      </template>

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

      <template v-slot:cell(avatarthumbnail)="data">
        <b-img
          v-if="data.item.avatar_thumbnail"
          thumbnail
          fluid
          :src="data.item.avatar_thumbnail"
          :alt="data.item.last_name">
        </b-img>
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
    'width',
    'small',
    'customFields'
  ],
  data () {
    return {
      isLoading: false,
      seeRaw: false,
      operationId: 'list_users',
      users: undefined,
      usersRequest: undefined,
      query: undefined,
      pagination: {
        page: 1,
        pageSize: 20,
        totalItems: undefined,
        sortBy: 'created',
        sortDesc: false
      },
      // "enum": [
      //   "last_name",
      //   "first_name",
      //   "datasets",
      //   "reuses",
      //   "followers",
      //   "views",
      //   "created",
      //   "-last_name",
      //   "-first_name",
      //   "-datasets",
      //   "-reuses",
      //   "-followers",
      //   "-views",
      //   "-created"
      // ],
      fields: [
        // 'index',
        { key: 'avatarthumbnail', label: 'avatar' },
        { key: 'name', label: 'Full Name', stickyColumn: true, isRowHeader: true, sortable: true },
        { key: 'roles', label: 'roles' },
        { key: 'datasets', label: 'datasets', sortable: true },
        { key: 'followers', label: 'followers', sortable: true },
        { key: 'following', label: 'following', sortable: true },
        { key: 'reuses', label: 'reuses', sortable: true },
        { key: 'page', label: 'page' },
        { key: 'since', label: 'exists since', sortable: true },
        'id'
      ]
    }
  },
  created () {
    console.log('-C- UsersList > created ... ')
    if (this.customFields) { this.fields = this.customFields }
    this.getUsers()
  },
  computed: {
    ...mapState({
      log: (state) => state.log
    })
  },
  methods: {
    getUsers (resetPage) {
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
          console.log('-C- UsersList > created > results.body :', results.body)
          this.usersRequest = results.url
          this.users = results.body
          this.pagination.totalItems = results.body.total
          this.isLoading = false
        },
        reason => console.error(`-C- UsersList > failed on api call: ${reason}`)
      )
    },
    resetQuery () {
      this.query = undefined
      this.getUsers(true)
    },
    changePagination (pageNumber) {
      console.log('-C- UsersList > changePagination > pageNumber ', pageNumber)
      this.pagination.page = pageNumber
      this.getUsers()
    },
    changeSorting (sort) {
      console.log('-C- UsersList > changeSorting > sort ', sort)
      switch (sort.sortBy) {
        case 'since':
          this.pagination.sortBy = 'created'
          break
        case 'name':
          this.pagination.sortBy = 'last_name'
          break
        default:
          this.pagination.sortBy = sort.sortBy
      }
      this.pagination.sortDesc = sort.sortDesc
      this.getUsers()
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
