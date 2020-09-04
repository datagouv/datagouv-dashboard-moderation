<template>

  <b-card
    class="mt-3 mx-3 text-center"
    >

    <p><slot name="blockTitle"></slot></p>
    <p v-if="reuses">
      <b-badge pill variant="primary">
        {{ pagination.totalItems }}
        {{ $t('basics.reuses', {list: ''}) }}
      </b-badge>
    </p>

    <code>{{itemsSelection}}</code>

    <p><slot name="link" class="mb-3"></slot></p>
    <div class="mb-2">
      {{ $t('navigation.from') }} :
      <span v-if="reusesRequest">
        <a :href="reusesRequest" target="blank">
          {{ reusesRequest }}
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
            id="inline-form-input-query-reuses"
            :placeholder="$t('actions.searchFor', {target: $t('basics.reuse')})"
            v-model="query"
            @input="getReuses(true)"
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
        v-if="reuses && pagination.totalItems > pagination.pageSize"
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
          :itemsList="reuses && reuses.data"
          @responseAction="callbackAction"
          >
        </ModerationActionsBtn>
      </b-col>

    </b-row>

    <b-table
      v-if="reuses && !isLoading"
      striped hover responsive
      @sort-changed="changeSorting"
      :small="small"
      :sticky-header="height"
      :items="reuses.data"
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
          :item="row.item"
        />
      </template>

      <template v-slot:cell(moderation_read)="row">
        <b-form inline class="justify-content-center">
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

      <template v-slot:cell(id)="data">
        <router-link
          class="text-info"
          :to="`/reuses/${data.value}`"
          >
          {{ data.value }}
        </router-link>
      </template>

      <template v-slot:cell(imagethumbnail)="data">
        <b-img-lazy
          v-if="data.item.image"
          thumbnail
          fluid
          :src="data.item.image"
          :alt="data.item.title">
        </b-img-lazy>
      </template>

      <template v-slot:cell(created_at)="data">
        <i>{{ formatDate(data.value, addTime = false) }}</i>
      </template>

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
import { mapState, mapGetters } from 'vuex'

import ModerationRowCard from '@/components/moderation/ModerationRowCard.vue'
import ModerationActionsBtn from '@/components/moderation/ModerationActionsBtn.vue'

export default {
  name: 'ReusesList',
  components: {
    ModerationActionsBtn,
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
      endpointModeration: 'reuses',
      operationId: 'list_reuses',
      reuses: undefined,
      reusesRequest: undefined,
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
      fields: [
        // 'index',
        { key: 'selection', label: 'selection', stickyColumn: true, isRowHeader: true, sortable: false },
        { key: 'moderation', label: 'Moderation', stickyColumn: true, isRowHeader: true },
        { key: 'moderation_read', label: 'Moderation', stickyColumn: true, isRowHeader: true, sortable: true },
        { key: 'imagethumbnail', label: 'image' },
        { key: 'title', label: 'title', stickyColumn: true, isRowHeader: true },
        'description',
        { key: 'created_at', label: 'created at', sortable: true },
        'id'
      ]
    }
  },
  created () {
    // console.log('-C- ReusesList > created ... ')
    if (this.customFields) { this.fields = this.customFields }
    this.getReuses()
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
      // console.log('-C- ReusesList > appendModerationData > this.isAuthenticated :', this.isAuthenticated)
      if (this.isAuthenticated) {
        const newData = await Promise.all(itemObject.data.map(async (obj) => {
          const itemStatus = await this.$MODERATIONcli.getModeration(obj.id, this.endpointModeration)
          return {
            ...obj,
            read: itemStatus.read,
            suspect: itemStatus.suspect,
            deleted: itemStatus.deleted
          }
        }))
        // console.log('-C- ReusesList > appendModerationData > newData :', newData)
        itemObject.data = newData
      }
      this.needsModerationData = false
      return itemObject
    },
    getReuses (resetPage) {
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
          // console.log('-C- ReusesList > created > results.body :', results.body)
          this.reusesRequest = results.url
          this.reuses = results.body
          this.needsModerationData = true
          this.pagination.totalItems = results.body.total
          this.isLoading = false
        },
        reason => console.error(`-C- ReusesList > failed on api call: ${reason}`)
      )
    },
    updateModeration (item) {
      // TO DO
      // console.log('-C- ReusesList > updateModeration > item : ', item)
      const itemModerationData = {
        uid: item.id,
        read: item.read
      }
      // console.log('-C- ReusesList > updateModeration > itemModerationData : ', itemModerationData)
      // const updatedItem = await this.$MODERATIONcli.postModeration(itemModerationData, 'resources')
      // console.log('-C- ReusesList > updateModeration > updatedItem : ', updatedItem)
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
      // console.log('-C- ReusesList > callbackAction > evt : ', evt)
    },
    resetQuery () {
      this.query = undefined
      this.getReuses(true)
    },
    changePagination (pageNumber) {
      // console.log('-C- ReusesList > changePagination > pageNumber ', pageNumber)
      this.pagination.page = pageNumber
      this.getReuses()
    },
    changeSorting (sort) {
      // console.log('-C- ReusesList > changeSorting > sort ', sort)
      this.pagination.sortBy = (sort.sortBy === 'created_at') ? 'created' : sort.sortBy
      this.pagination.sortDesc = sort.sortDesc
      this.getReuses()
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
