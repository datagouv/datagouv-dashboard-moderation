<template>

  <b-card
    class="mt-3 mx-auto text-center"
    :style="`width: ${width};`"
    >
    <p><slot name="blockTitle"></slot></p>
    <p v-if="organizations">
      <b-badge pill variant="primary">
        {{ pagination.totalItems }}
        {{ $t('basics.organizations', {list: ''}) }}
      </b-badge>
    </p>

    <p><slot name="link" class="mb-3"></slot></p>
    <div class="mb-2">
      {{ $t('navigation.from') }} :
      <span v-if="organizationsRequest">
        <a :href="organizationsRequest" target="blank">
          {{ organizationsRequest }}
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

      <b-col cols="10" md="6">
        <b-input-group>
          <b-input-group-prepend is-text>
            <b-icon icon="search"></b-icon>
          </b-input-group-prepend>
          <b-form-input
            id="inline-form-input-query-organizations"
            placeholder="search for an organization"
            v-model="query"
            @input="getOrganizations(true)"
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
        v-if="organizations && pagination.totalItems > pagination.pageSize"
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
      v-if="organizations && !isLoading"
      striped hover responsive
      @sort-changed="changeSorting"
      :small="small"
      :sticky-header="height"
      :items="organizations.data"
      :fields="fields"
      :sort-by.sync="pagination.sortBy"
      :sort-desc.sync="pagination.sortDesc"
      >

      <template v-slot:cell(moderation_read)="row">
        <b-form align="center" inline>
          <b-button size="sm" @click="row.toggleDetails" class="mx-2">
            <b-icon :icon="row.detailsShowing ? 'eye-slash-fill' : 'eye-fill' " aria-hidden="true"></b-icon>
          </b-button>
          <b-form-checkbox v-model="row.item.read" @change="updateModeration(row.item)">
            {{ $t('moderation.read') }}
          </b-form-checkbox>
        </b-form>
      </template>

      <template v-slot:row-details="row">
        <b-card>
          <b-row class="mb-2">
            <b-col sm="3" class="text-sm-right"><b>
              {{ $t('moderation.read') }}:</b></b-col>
            <b-col>{{ row.item.read }}</b-col>
          </b-row>

          <b-row class="mb-2">
            <b-col sm="3" class="text-sm-right"><b>
              {{ $t('moderation.comments') }}:</b></b-col>
            <b-col>{{ row.item.comments }}</b-col>
          </b-row>
        </b-card>
      </template>

      <template v-slot:cell(created_at)="data">
        <i>{{ formatDate(data.value, addTime = false) }}</i>
      </template>

      <template v-slot:cell(id)="data">
        <router-link
          class="text-info"
          :to="`/organizations/${data.value}`"
          >
          {{ data.value }}
        </router-link>
      </template>

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

      <template v-slot:cell(organizationlogo)="data">
        <b-img
          v-if="data.item.logo_thumbnail"
          thumbnail
          fluid
          :src="data.item.logo_thumbnail"
          :alt="data.item.name">
        </b-img>
      </template>

    </b-table>

    <p v-if="isLoading">
      <b-spinner label="loading"></b-spinner>
    </p>
  </b-card>

</template>

<script>
import { mapState, mapGetters } from 'vuex'

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
      seeRaw: false,
      operationId: 'list_organizations',
      organizations: undefined,
      organizationsRequest: undefined,
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
      //   "name",
      //   "reuses",
      //   "datasets",
      //   "followers",
      //   "views",
      //   "created",
      //   "last_modified",
      //   "-name",
      //   "-reuses",
      //   "-datasets",
      //   "-followers",
      //   "-views",
      //   "-created",
      //   "-last_modified"
      // ],
      fields: [
        // 'index',
        { key: 'moderation_read', label: 'Moderation', stickyColumn: true, isRowHeader: true, sortable: true },
        { key: 'organizationlogo', label: 'logo' },
        { key: 'name', label: 'name', stickyColumn: true, isRowHeader: true },
        { key: 'description' },
        { key: 'created_at', label: 'created at', sortable: true },
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
    }),
    ...mapGetters({
      isAuthenticated: 'oauth/isAuthenticated'
    })
  },
  methods: {
    getOrganizations (resetPage) {
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
          console.log('-C- OrganizationsList > created > results.body :', results.body)
          this.organizationsRequest = results.url
          this.organizations = results.body
          this.needsModerationData = true
          this.pagination.totalItems = results.body.total
          this.isLoading = false
        },
        reason => console.error(`-C- OrganizationsList > failed on api call: ${reason}`)
      )
    },
    updateModeration (item) {
      // TO DO
      console.log('-C- OrganizationsList > updateModeration > item : ', item)
      const itemModerationData = {
        uid: item.id,
        read: item.read
      }
      console.log('-C- OrganizationsList > updateModeration > itemModerationData : ', itemModerationData)
      // const updatedItem = await this.$MODERATIONcli.postModeration(itemModerationData, 'organizations')
      // console.log('-C- OrganizationsList > updateModeration > updatedItem : ', updatedItem)
    },
    resetQuery () {
      this.query = undefined
      this.getOrganizations(true)
    },
    changePagination (pageNumber) {
      console.log('-C- OrganizationsList > changePagination > pageNumber ', pageNumber)
      this.pagination.page = pageNumber
      this.getOrganizations()
    },
    changeSorting (sort) {
      console.log('-C- OrganizationsList > changeSorting > sort ', sort)
      this.pagination.sortBy = (sort.sortBy === 'created_at') ? 'created' : sort.sortBy
      this.pagination.sortDesc = sort.sortDesc
      console.log('-C- OrganizationsList > changeSorting > this.pagination ', this.pagination)
      this.getOrganizations()
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
