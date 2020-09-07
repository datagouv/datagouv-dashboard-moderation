<template>

  <b-card
    class="mt-3 mx-3 text-center"
    >

    <p><slot name="blockTitle"></slot></p>
    <p v-if="users">
      <b-badge pill variant="primary">
        {{ pagination.totalItems }}
        {{ $t('basics.users', {list: ''}) }}
      </b-badge>
    </p>

    <code>{{itemsSelection}}</code>

    <p><slot name="link" class="mb-3"></slot></p>
    <div class="mb-2">
      {{ $t('navigation.from') }} :
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
      <b-col cols="6" md="5">
        <b-input-group>
          <b-input-group-prepend is-text>
            <b-icon icon="search"></b-icon>
          </b-input-group-prepend>
          <b-form-input
            id="inline-form-input-query-users"
            :placeholder="$t('actions.searchFor', {target: $t('basics.user')})"
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

      <b-col cols="4" md="5"
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

      <b-col cols="2" class="text-right">
        <ModerationActionsBtn
          :endpoint="endpointModeration"
          :itemsSelection="itemsSelection"
          :itemsList="users && users.data"
          @responseAction="callbackAction"
          >
        </ModerationActionsBtn>
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

      <template v-slot:cell(selection)="data">
        <b-form inline class="justify-content-center">
          <b-button
            :disabled="!isAuthenticated"
            @click="changeSelection(data.item)"
            button
            variant="link"
            >
            <b-icon
              :icon="`${isSelected(data.item) ? 'check2-' : ''}square`"
              :variant="`${isSelected(data.item)? 'primary' : ''}`"
              aria-hidden="true"
              >
            </b-icon>
          </b-button>
        </b-form>
      </template>

      <template v-slot:cell(moderation)="row">
        <b-button
          v-if="isAuthenticated"
          size="sm"
          @click="row.toggleDetails" class="mx-2">
          <b-icon :icon="row.detailsShowing ? 'eye-slash-fill' : 'eye-fill' " aria-hidden="true"></b-icon>
        </b-button>
      </template>

      <template v-if="isAuthenticated" v-slot:row-details="row">
        <ModerationRowCard
          :dgfType="dgfType"
          :item="row.item"
        />
      </template>

      <template v-slot:cell(moderation_read)="row">
        <ModerationCheckbox
          :dgfType="dgfType"
          :item="row.item"
          :field="'read'"
          >
        </ModerationCheckbox>
      </template>

      <template v-slot:cell(moderation_suspect)="row">
        <ModerationCheckbox
          :dgfType="dgfType"
          :item="row.item"
          :field="'suspicious'"
          >
        </ModerationCheckbox>
      </template>

      <template v-slot:cell(id)="data">
        <router-link
          class="text-info"
          :to="`/users/${data.value}`"
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
          :to="`/users/${data.item.id}`"
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
import { mapState, mapGetters } from 'vuex'

import ModerationRowCard from '@/components/moderation/ModerationRowCard.vue'
import ModerationCheckbox from '@/components/moderation/ModerationCheckbox.vue'
import ModerationActionsBtn from '@/components/moderation/ModerationActionsBtn.vue'

export default {
  name: 'UsersList',
  components: {
    ModerationActionsBtn,
    ModerationCheckbox,
    ModerationRowCard
  },
  props: [
    'height',
    'small',
    'customFields'
  ],
  data () {
    return {
      isLoading: false,
      seeRaw: false,
      dgfType: 'user',
      endpointModeration: 'users',
      operationId: 'list_users',
      users: undefined,
      usersRequest: undefined,
      itemsSelection: [],
      needsModerationData: false,
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
        { key: 'selection', label: 'selection', stickyColumn: true, isRowHeader: true, sortable: false },
        { key: 'moderation', label: 'Moderation', stickyColumn: true, isRowHeader: true },
        { key: 'moderation_read', label: 'Moderation', stickyColumn: true, isRowHeader: true, sortable: true },
        { key: 'moderation_suspect', label: 'Suspect', stickyColumn: true, isRowHeader: true, sortable: true },
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
    // console.log('-C- UsersList > created ... ')
    if (this.customFields) { this.fields = this.customFields }
    this.getUsers()
  },
  watch: {
    async users (next) {
      if (next && this.needsModerationData) {
        // console.log('-C- UsersList > watch > users > next :', next)
        this.users = await this.appendModerationData(next)
      }
    }
  },
  computed: {
    ...mapState({
      log: (state) => state.log
    }),
    ...mapGetters({
      isAuthenticated: 'oauth/isAuthenticated'
    })
  },
  methods: {
    async appendModerationData (itemObject) {
      // console.log('-C- OrganizationsList > appendModerationData > this.isAuthenticated :', this.isAuthenticated)
      if (this.isAuthenticated) {
        const newData = await Promise.all(itemObject.data.map(async (obj) => {
          const itemStatus = await this.$MODERATIONcli.getModeration(obj.id)
          const consolidated = this.$MODERATIONcli.addModerationData(obj, itemStatus)
          return consolidated
        }))
        // console.log('-C- OrganizationsList > appendModerationData > newData :', newData)
        itemObject.data = newData
      }
      this.needsModerationData = false
      return itemObject
    },
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
          // console.log('-C- UsersList > created > results.body :', results.body)
          this.usersRequest = results.url
          this.users = results.body
          this.needsModerationData = true
          this.pagination.totalItems = results.body.total
          this.isLoading = false
        },
        reason => console.error(`-C- UsersList > failed on api call: ${reason}`)
      )
    },
    updateModeration (item) {
      // TO DO
      // console.log('-C- UsersList > updateModeration > item : ', item)
      const itemModerationData = {
        dgf_type: this.dgfType,
        dgf_id: item.id,
        read: item.read,
        suspicious: item.suspicious,
        deleted: item.deleted
      }
      console.log('-C- UsersList > updateModeration > itemModerationData : ', itemModerationData)
      // const updatedItem = await this.$MODERATIONcli.postModeration(itemModerationData, 'users')
      // console.log('-C- UsersList > updateModeration > updatedItem : ', updatedItem)
    },
    changeSelection (item) {
      if (this.isAuthenticated) {
        this.itemsSelection = this.$changeSelection(this.itemsSelection, item.id)
      }
    },
    isSelected (item) {
      return this.itemsSelection.includes(item.id)
    },
    callbackAction (evt) {
      // console.log('-C- UsersList > callbackAction > evt : ', evt)
    },
    resetQuery () {
      this.query = undefined
      this.getUsers(true)
    },
    changePagination (pageNumber) {
      // console.log('-C- UsersList > changePagination > pageNumber ', pageNumber)
      this.pagination.page = pageNumber
      this.getUsers()
    },
    changeSorting (sort) {
      // console.log('-C- UsersList > changeSorting > sort ', sort)
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
  .table > tbody > tr > th {
    vertical-align: middle !important;
  }
  .table > thead > tr > th {
    vertical-align: middle !important;
  }
</style>
