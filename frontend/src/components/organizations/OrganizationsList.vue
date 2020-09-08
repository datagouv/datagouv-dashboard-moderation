<template>

  <b-card
    class="mt-3 mx-3 text-center border-0"
    >

    <p><slot name="blockTitle"></slot></p>
    <p v-if="organizations">
      <b-badge pill variant="primary">
        {{ pagination.totalItems }}
        {{ $t('basics.organizations', {list: ''}) }}
      </b-badge>
    </p>

    <code>{{itemsSelection}}</code>

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

      <b-col cols="6" md="5">
        <b-input-group>
          <b-input-group-prepend is-text>
            <b-icon icon="search"></b-icon>
          </b-input-group-prepend>
          <b-form-input
            id="inline-form-input-query-organizations"
            :placeholder="$t('actions.searchFor', {target: $t('basics.organization')})"
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

      <b-col cols="4" md="5"
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

      <b-col cols="2" class="text-right">
        <ModerationActionsBtn
          :dgfType="dgfType"
          :endpoint="endpointModeration"
          :itemsSelection="itemsSelection"
          :itemsList="organizations && organizations.data"
          @responseAction="callbackAction"
          >
        </ModerationActionsBtn>
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

      <template v-slot:cell(selection)="data">
        <b-form inline class="justify-content-center">
          <b-form-checkbox
            v-if="isAuthenticated"
            @change="addToSelection(data.item)"
            button button-variant="outline-danger"
            >
            <b-icon icon="trash-fill" aria-hidden="true"></b-icon>
          </b-form-checkbox>
          <b-form-checkbox
            v-else
            disabled
            >
            <b-icon icon="trash-fill" aria-hidden="true"></b-icon>
          </b-form-checkbox>
        </b-form>
      </template>

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

      <template v-slot:cell(moderation_deleted)="row">
        <ModerationCheckbox
          :dgfType="dgfType"
          :item="row.item"
          :field="'deleted'"
          >
        </ModerationCheckbox>
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

import ModerationRowCard from '@/components/moderation/ModerationRowCard.vue'
import ModerationCheckbox from '@/components/moderation/ModerationCheckbox.vue'
import ModerationActionsBtn from '@/components/moderation/ModerationActionsBtn.vue'

export default {
  name: 'OrganizationsList',
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
      dgfType: 'organization',
      endpointModeration: 'organizations',
      operationId: 'list_organizations',
      organizations: undefined,
      organizationsRequest: undefined,
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
        { key: 'selection', label: 'selection', stickyColumn: true, isRowHeader: true, sortable: false },
        { key: 'moderation', label: 'Moderation', stickyColumn: true, isRowHeader: true },
        { key: 'moderation_read', label: 'Moderation', stickyColumn: true, isRowHeader: true, sortable: true },
        { key: 'moderation_suspect', label: 'Suspect', stickyColumn: true, isRowHeader: true, sortable: true },
        { key: 'moderation_deleted', label: 'Deleted', stickyColumn: true, isRowHeader: true, sortable: true },
        { key: 'organizationlogo', label: 'logo' },
        { key: 'name', label: 'name', stickyColumn: true, isRowHeader: true },
        { key: 'description' },
        { key: 'created_at', label: 'created at', sortable: true },
        'id'
      ]
    }
  },
  created () {
    // console.log('-C- OrganizationsList > created ... ')
    if (this.customFields) { this.fields = this.customFields }
    this.getOrganizations()
  },
  watch: {
    async organizations (next) {
      if (next && this.needsModerationData) {
        // console.log('-C- OrganizationsList > watch > organizations > next :', next)
        this.organizations = await this.appendModerationData(next)
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
          // console.log('-C- OrganizationsList > created > results.body :', results.body)
          this.organizationsRequest = results.url
          this.organizations = results.body
          this.needsModerationData = true
          this.pagination.totalItems = results.body.total
          this.isLoading = false
        },
        reason => console.error(`-C- OrganizationsList > failed on api call: ${reason}`)
      )
    },
    async updateModeration (item, field, evt) {
      const updatedItem = await this.$MODERATIONcli.updateModeration(this.dgfType, item, field, evt)
      console.log('-C- DatasetsList > updateModeration > updatedItem : ', updatedItem)
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
      // console.log('-C- OrganizationsList > callbackAction > evt : ', evt)
    },
    resetQuery () {
      this.query = undefined
      this.getOrganizations(true)
    },
    changePagination (pageNumber) {
      // console.log('-C- OrganizationsList > changePagination > pageNumber ', pageNumber)
      this.pagination.page = pageNumber
      this.getOrganizations()
    },
    changeSorting (sort) {
      // console.log('-C- OrganizationsList > changeSorting > sort ', sort)
      this.pagination.sortBy = (sort.sortBy === 'created_at') ? 'created' : sort.sortBy
      this.pagination.sortDesc = sort.sortDesc
      // console.log('-C- OrganizationsList > changeSorting > this.pagination ', this.pagination)
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
  .table > tbody > tr > th {
    vertical-align: middle !important;
  }
  .table > thead > tr > th {
    vertical-align: middle !important;
  }
</style>
