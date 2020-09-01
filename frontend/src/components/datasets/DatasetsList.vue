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

      <b-col cols="3" md="5"
        v-if="datasets && pagination.totalItems > pagination.pageSize"
        class=""
        @click="deleteSelection()"
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

      <b-col cols="1">
        <b-button
          variant="outline-danger"
          >
          <b-icon icon="trash-fill" aria-hidden="true"></b-icon>
        </b-button>
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

      <template v-slot:cell(delete_batch)="data">
        <b-form inline class="justify-content-center">
          <b-form-checkbox
            v-if="isAuthenticated"
            @change="addToDeleteSelection(data.item)"
            button button-variant="outline-danger"
            >
            <b-icon icon="trash-fill" aria-hidden="true"></b-icon>
            <!-- <code>{{data.item.id}}</code> -->
          </b-form-checkbox>
          <b-form-checkbox
            v-else
            disabled
            >
            <b-icon icon="trash-fill" aria-hidden="true"></b-icon>
          </b-form-checkbox>
        </b-form>
      </template>

      <template v-slot:cell(moderation_read)="row">
        <b-form inline class="justify-content-center">
          <b-button
            v-if="isAuthenticated"
            size="sm"
            @click="row.toggleDetails" class="mx-2">
            <b-icon :icon="row.detailsShowing ? 'eye-slash-fill' : 'eye-fill' " aria-hidden="true"></b-icon>
          </b-button>
          <b-form-checkbox
            v-model="row.item.read"
            v-if="isAuthenticated"
            @change="updateModeration(row.item)"
            >
            {{ $t('moderation.read') }}
          </b-form-checkbox>
          <b-form-checkbox
            v-else
            disabled
            v-model="row.item.read"
            >
            {{ $t('moderation.read') }}
          </b-form-checkbox>
        </b-form>
      </template>

      <template v-if="isAuthenticated" v-slot:row-details="row">
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
          :to="`/users/${data.item.owner.id}`"
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
import { mapState, mapGetters } from 'vuex'

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
      selectionToDelete: new Map(),
      needsModerationData: false,
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
        { key: 'delete_batch', label: 'Delete', stickyColumn: true, isRowHeader: true, sortable: false },
        { key: 'moderation_read', label: 'Moderation', stickyColumn: true, isRowHeader: true, sortable: true },
        // { key: 'moderation', stickyColumn: true, isRowHeader: true, sortable: true },
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
    // this.selectionToDelete = new Map()
    this.getDatasets()
  },
  watch: {
    async datasets (next) {
      if (next && this.needsModerationData) {
        console.log('-C- DatasetsList > watch > datasets > next :', next)
        this.dataset = this.appendModerationData(next)
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
    async appendModerationData (dataset) {
      // TO DO (only if logged)
      console.log('-C- DatasetsList > appendModerationData > this.isAuthenticated :', this.isAuthenticated)
      if (this.isAuthenticated) {
        const newData = await Promise.all(dataset.data.map(async (obj) => {
          const readStatus = await this.$MODERATIONcli.getModeration(obj.id, 'datasets')
          // console.log('-C- DatasetsList > appendModerationData > readStatus :', readStatus)
          return { ...obj, read: readStatus.read }
        }))
        console.log('-C- DatasetsList > appendModerationData > newData :', newData)
        dataset.data = newData
      }
      this.needsModerationData = false
      return dataset
    },
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
          this.needsModerationData = true

          this.pagination.totalItems = results.body.total
          this.isLoading = false
        },
        reason => console.error(`-C- DatasetsList > failed on api call: ${reason}`)
      )
    },
    updateModeration (item) {
      // TO DO
      console.log('-C- DatasetsList > updateModeration > item : ', item)
      const itemModerationData = {
        uid: item.id,
        read: item.read
      }
      console.log('-C- DatasetsList > updateModeration > itemModerationData : ', itemModerationData)
      // const updatedItem = await this.$MODERATIONcli.postModeration(itemModerationData, 'datasets')
      // console.log('-C- DatasetsList > updateModeration > updatedItem : ', updatedItem)
    },
    addToDeleteSelection (item) {
      console.log('-C- DatasetsList > addToDeleteSelection > item : ', item)
      if (this.selectionToDelete.has(item.id)) {
        this.selectionToDelete.delete(item.id, item.title)
      } else {
        this.selectionToDelete.set(item.id, item.title)
      }
      console.log('-C- DatasetsList > addToDeleteSelection > this.selectionToDelete : ', this.selectionToDelete)
    },
    deleteSelection () {
      // TO DO
      console.log('-C- DatasetsList > deleteSelection > this.selectionToDelete : ', this.selectionToDelete)
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
  .table > tbody > tr > th {
    vertical-align: middle !important;
  }
  .table > thead > tr > th {
    vertical-align: middle !important;
  }
</style>
