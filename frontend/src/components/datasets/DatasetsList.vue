<template>

  <div :class="customClass">

    <PageHeader
      :dgfType="'datasets'"
      :noSubtitle="noOperationLink"
      :linkTitle="datasetsRequest"
      :compact="compact"
      :subtitleLink="datasetsRequest"
      :badgeNumber="pagination.totalItems"
      >
      <template v-slot:subtitle>
        <div class="mb-2">
          {{ $t('navigation.from') }} :
          <span v-if="datasetsRequest">
            <a :href="datasetsRequest" target="blank">
              {{ datasetsRequest }}
            </a>
          </span>
          <span v-else>
            <code>{{ operationId }}</code>
          </span>
        </div>
      </template>
      <!-- <template v-slot:badge>
        <h4 v-if="datasets">
          <b-badge pill variant="primary">
            {{ pagination.totalItems }}
            {{ $t('basics.datasets', {list: ''}) }}
          </b-badge>
        </h4>
      </template> -->
    </PageHeader>

    <b-card
      class="mx-3 text-center border-0"
      >

      <!-- <p><slot name="blockTitle"></slot></p> -->

      <!-- <code>{{itemsSelection}}</code> -->

      <p><slot name="link" class="mb-3"></slot></p>

      <b-row
        align-v="center"
        class="my-3"
        >

        <b-col cols="7" md="5"
          class="pr-0"
          >
          <b-input-group>
            <b-input-group-prepend is-text>
              <b-icon icon="search"></b-icon>
            </b-input-group-prepend>
            <b-form-input
              id="inline-form-input-query-datasets"
              :placeholder="$t('actions.searchFor', {target: $t('basics.dataset')})"
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

        <b-col cols="4" md="6"
          v-if="datasets && pagination.totalItems > pagination.pageSize"
          class="px-0"
          >
          <b-pagination
            @input="changePagination"
            v-model="pagination.page"
            :total-rows="pagination.totalItems"
            :per-page="pagination.pageSize"
            class="my-0 px-0"
            align="center"
            size="sm"
          ></b-pagination>
        </b-col>

        <b-col cols="1" class="text-right pl-0">
          <ModerationActionsBtn
            :dgfType="dgfType"
            :endpoint="endpointModeration"
            :itemsSelection="itemsSelection"
            :itemsList="datasets && datasets.data"
            @responseAction="callbackAction"
            >
          </ModerationActionsBtn>
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
                :variant="`${isSelected(data.item)? 'green' : 'primary'}`"
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

        <template v-slot:cell(moderation_deleted)="row">
          <ModerationCheckbox
            :dgfType="dgfType"
            :item="row.item"
            :field="'deleted'"
            >
          </ModerationCheckbox>
        </template>

        <template v-slot:cell(title)="data">
          <router-link
            :to="`/datasets/${data.item.id}`"
            >
            <b>{{ data.item.title }}</b>
          </router-link>
        </template>

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

        <template v-slot:cell(id)="data">
          <router-link
            class="text-info"
            :to="`/datasets/${data.value}`"
            >
            {{ data.value }}
          </router-link>
        </template>

      </b-table>

      <p v-if="isLoading" class="pt-5 my-5">
        <b-spinner
          style="width: 5rem; height: 5rem;"
          label="loading"
          variant="primary"
          >
        </b-spinner>
      </p>

    </b-card>

  </div>

</template>

<script>
import { mapState, mapGetters } from 'vuex'

import PageHeader from '@/components/ux/PageHeader.vue'

import ModerationRowCard from '@/components/moderation/ModerationRowCard.vue'
import ModerationCheckbox from '@/components/moderation/ModerationCheckbox.vue'
import ModerationActionsBtn from '@/components/moderation/ModerationActionsBtn.vue'

export default {
  name: 'DatasetsList',
  components: {
    PageHeader,
    ModerationActionsBtn,
    ModerationCheckbox,
    ModerationRowCard
  },
  props: [
    'height',
    'small',
    'customFields',
    'noOperationLink',
    'compact',
    'customClass'
  ],
  data () {
    return {
      isLoading: false,
      seeRaw: false,
      dgfType: 'dataset',
      endpointModeration: 'datasets',
      operationId: 'list_datasets',
      datasets: undefined,
      datasetsRequest: undefined,
      itemsSelection: [],
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
        { key: 'selection', label: 'Selection', stickyColumn: true, isRowHeader: true },
        { key: 'moderation', label: 'Moderation', stickyColumn: true, isRowHeader: true },
        { key: 'moderation_read', label: 'Read', stickyColumn: true, isRowHeader: true, sortable: true },
        { key: 'moderation_suspect', label: 'Suspect', stickyColumn: true, isRowHeader: true, sortable: true },
        { key: 'moderation_deleted', label: 'Deleted', stickyColumn: true, isRowHeader: true, sortable: true },
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
    if (this.customFields) { this.fields = this.customFields }
    this.getDatasets()
  },
  watch: {
    async datasets (next) {
      if (next && this.needsModerationData) {
        this.dataset = await this.appendModerationData(next)
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
      if (this.isAuthenticated) {
        const newData = await Promise.all(itemObject.data.map(async (obj) => {
          const itemStatus = await this.$MODERATIONcli.getModeration(obj.id)
          const consolidated = this.$MODERATIONcli.addModerationData(obj, itemStatus)
          return consolidated
        }))
        itemObject.data = newData
      }
      this.needsModerationData = false
      return itemObject
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
          this.datasetsRequest = results.url
          this.datasets = results.body
          this.needsModerationData = true
          this.pagination.totalItems = results.body.total
          this.isLoading = false
        },
        reason => console.error(`-C- DatasetsList > failed on api call: ${reason}`)
      )
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
    },
    resetQuery () {
      this.query = undefined
      this.getDatasets(true)
    },
    changePagination (pageNumber) {
      this.pagination.page = pageNumber
      this.getDatasets()
    },
    changeSorting (sort) {
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
