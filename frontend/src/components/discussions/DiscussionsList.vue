<template>

  <b-card
    class="mt-3 mx-3 text-center"
    >

    <p><slot name="blockTitle"></slot></p>
    <p v-if="discussions">
      <b-badge pill variant="primary">
        {{ pagination.totalItems }}
        {{ $t('basics.discussions', {list: ''}) }}
      </b-badge>
    </p>

    <code>{{itemsSelection}}</code>

    <p><slot name="link" class="mb-3"></slot></p>
    <div class="mb-2">
      {{ $t('navigation.from') }} :
      <span v-if="discussionsRequest">
        <a :href="discussionsRequest" target="blank">
          {{ discussionsRequest }}
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
            id="inline-form-input-query-dicussions"
            :placeholder="$t('actions.searchFor', {target: $t('basics.discussion')})"
            v-model="query"
            @input="getDiscussions(true)"
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
        v-if="discussions && pagination.totalItems > pagination.pageSize"
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
          :itemsList="discussions && discussions.data"
          @responseAction="callbackAction"
          >
        </ModerationActionsBtn>
      </b-col>

    </b-row>

    <b-table
      v-if="discussions && !isLoading"
      striped hover responsive
      @sort-changed="changeSorting"
      :small="small"
      :sticky-header="height"
      :items="discussions.data"
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

      <template v-slot:cell(discussion)="data">
        {{ data.item.discussion.length }}
      </template>

      <template v-slot:cell(id)="data">
        <router-link
          class="text-info"
          :to="`/discussions/${data.value}`"
          >
          {{ data.value }}
        </router-link>
      </template>

      <template v-slot:cell(created)="data">
        <i>{{ formatDate(data.value, addTime = false) }}</i>
      </template>

      <template v-slot:cell(title)="data">
        <router-link
          class="text-info"
          :to="`/discussions/${data.item.id}`"
          >
          <span>
            {{ data.item.title }}
          </span>
        </router-link>
      </template>

      <template v-slot:cell(subject)="data">
        <b-button
          variant="outline-primary"
          :to="`/${data.item.subject.class.toLowerCase()}/${data.item.subject.id}`"
          >
          {{ data.item.subject.class.toLowerCase() }}
          <!-- <b-icon icon="link" aria-hidden="true"></b-icon> -->
        </b-button>
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
  name: 'DiscussionsList',
  components: {
    ModerationActionsBtn,
    ModerationCheckbox,
    ModerationRowCard
  },
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
      dgfType: 'discussion',
      endpointModeration: 'discussions',
      operationId: 'list_discussions',
      discussions: undefined,
      discussionsRequest: undefined,
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
        { key: 'moderation_suspect', label: 'Suspect', stickyColumn: true, isRowHeader: true, sortable: true },
        { key: 'title', label: 'title', stickyColumn: true, isRowHeader: true },
        { key: 'discussion', label: 'number of discussions', sortable: true },
        { key: 'subject', label: 'related to' },
        { key: 'created', label: 'created at', sortable: true },
        'id'
      ]
    }
  },
  created () {
    // console.log('-C- DiscussionsList > created ... ')
    if (this.customFields) { this.fields = this.customFields }
    this.getDiscussions()
  },
  watch: {
    async discussions (next) {
      if (next && this.needsModerationData) {
        // console.log('-C- DiscussionsList > watch > discussions > next :', next)
        this.discussions = await this.appendModerationData(next)
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
      // console.log('-C- DiscussionsList > appendModerationData > this.isAuthenticated :', this.isAuthenticated)
      if (this.isAuthenticated) {
        const newData = await Promise.all(itemObject.data.map(async (obj) => {
          const itemStatus = await this.$MODERATIONcli.getModeration(obj.id)
          const consolidated = this.$MODERATIONcli.addModerationData(obj, itemStatus)
          return consolidated
        }))
        // console.log('-C- DiscussionsList > appendModerationData > newData :', newData)
        itemObject.data = newData
      }
      this.needsModerationData = false
      return itemObject
    },
    getDiscussions (resetPage) {
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
          // console.log('-C- DiscussionsList > created > results.body :', results.body)
          this.discussionsRequest = results.url
          this.discussions = results.body
          this.needsModerationData = true
          this.pagination.totalItems = results.body.total
          this.isLoading = false
        },
        reason => console.error(`-C- DiscussionsList > failed on api call: ${reason}`)
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
      // console.log('-C- DiscussionsList > callbackAction > evt : ', evt)
    },
    resetQuery () {
      this.query = undefined
      this.getDiscussions(true)
    },
    changePagination (pageNumber) {
      // console.log('-C- DiscussionsList > changePagination > pageNumber ', pageNumber)
      this.pagination.page = pageNumber
      this.getDiscussions()
    },
    changeSorting (sort) {
      // console.log('-C- DiscussionsList > changeSorting > sort ', sort)
      this.pagination.sortBy = sort.sortBy
      this.pagination.sortDesc = sort.sortDesc
      this.getDiscussions()
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
