<template>

  <div :customClass="customClass">

    <PageHeader
      :dgfType="'discussions'"
      :noSubtitle="noOperationLink"
      :compact="compact"
      :subtitleLink="discussionsRequest"
      :badgeNumber="pagination.totalItems"
      >
      <template v-slot:subtitle>
        <div class="mb-2">
          {{ $t('navigation.from') }} :
          <span v-if="discussionsRequest">
            <a :href="discussionsRequest" target="blank">
              {{ discussionsRequest }}
            </a>
          </span>
          <span v-else>
            <code>{{ operationId }}</code>
          </span>
        </div>
      </template>
      <!-- <template v-slot:badge>
        <h4 v-if="discussions">
          <b-badge pill variant="primary">
            {{ pagination.totalItems }}
            {{ $t('basics.discussions', {list: ''}) }}
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

        <b-col cols="6" md="5">
          <b-input-group>
            <b-input-group-prepend is-text>
              <b-icon icon="search"></b-icon>
            </b-input-group-prepend>
            <b-form-input
              id="inline-form-input-query-discussions"
              :placeholder="$t('actions.searchFor', {target: $t('basics.discussion')})"
              v-model="query"
              @input="getDiscussions(true)"
              @keyup.enter="addQueryAndGet"
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
          class="my-2"
          align-self="center"
          >
          <b-pagination
            v-if="discussions && pagination.totalItems > pagination.pageSize"
            @input="changePagination"
            v-model="pagination.page"
            :total-rows="pagination.totalItems"
            :per-page="pagination.pageSize"
            class="mb-0"
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
            @reloadItems="reloadItemsModerationSelection"
            >
          </ModerationActionsBtn>
        </b-col>

      </b-row>

      <b-table
        v-if="discussions && !isLoading"
        :class="`${ compact ? '' : 'border border-1' }`"
        striped hover responsive
        @sort-changed="changeSorting"
        :small="small"
        :sticky-header="height"
        :items="discussions.data"
        :fields="fieldsTable"
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
            v-b-popover.hover.top="$t('moderation.moderationInfos')"
            pill
            size="sm"
            class=""
            @click="row.toggleDetails"
            >
            <b-icon :icon="row.detailsShowing ? 'eye-slash-fill' : 'eye-fill' " aria-hidden="true"></b-icon>
          </b-button>
        </template>

        <template v-slot:row-details="row">
          <ModerationRowCard
            :dgfType="dgfType"
            :item="row.item"
            @reloadItem="reloadItemModerationData"
          />
        </template>

        <template v-slot:cell(moderation_read)="row">
          <ModerationCheckbox
            :dgfType="dgfType"
            :item="row.item"
            :field="'read'"
            :disabled="row.detailsShowing"
            @reloadItem="reloadItemModerationData"
            >
          </ModerationCheckbox>
        </template>

        <template v-slot:cell(moderation_suspect)="row">
          <ModerationCheckbox
            :dgfType="dgfType"
            :item="row.item"
            :field="'suspicious'"
            :disabled="row.detailsShowing"
            @reloadItem="reloadItemModerationData"
            >
          </ModerationCheckbox>
        </template>

        <template v-slot:cell(moderation_deleted)="row">
          <ModerationCheckbox
            :dgfType="dgfType"
            :item="row.item"
            :field="'deleted'"
            :disabled="row.detailsShowing"
            @reloadItem="reloadItemModerationData"
            >
          </ModerationCheckbox>
        </template>

        <template v-slot:cell(discussion)="data">
          {{ data.item.discussion.length }}
        </template>

        <template v-slot:cell(id)="data">
          <router-link
            class="text-primary"
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
            class="text-primary"
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

      <p v-if="isLoading" class="pt-5 my-5">
        <custom-spinner/>
      </p>

    </b-card>

  </div>

</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { moderationFieldsCodes } from '@/config/APImoderationCodes.js'

import PageHeader from '@/components/ux/PageHeader.vue'

import ModerationRowCard from '@/components/moderation/ModerationRowCard.vue'
import ModerationCheckbox from '@/components/moderation/ModerationCheckbox.vue'
import ModerationActionsBtn from '@/components/moderation/ModerationActionsBtn.vue'

export default {
  name: 'DiscussionsList',
  components: {
    PageHeader,
    ModerationActionsBtn,
    ModerationCheckbox,
    ModerationRowCard
  },
  props: [
    'height',
    'noQueryAdd',
    'width',
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
        { key: 'moderation_deleted', label: 'Deleted', stickyColumn: true, isRowHeader: true, sortable: true },
        { key: 'title', label: 'title', stickyColumn: true, isRowHeader: true },
        { key: 'discussion', label: 'number of discussions', sortable: true },
        { key: 'subject', label: 'related to' },
        { key: 'created', label: 'created at', sortable: true },
        'id'
      ]
    }
  },
  created () {
    if (this.customFields) { this.fields = this.customFields }
    if (this.$router.currentRoute.query) {
      this.pagination.page = this.$router.currentRoute.query.page || 1
      this.query = this.$router.currentRoute.query.q || undefined
    }
    this.getDiscussions()
  },
  watch: {
    '$route' (next) {
      this.pagination.page = next.query.page || 1
      this.getDiscussions()
    },
    async discussions (next) {
      if (next && this.needsModerationData && this.isAuthenticated) {
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
    }),
    fieldsTable () {
      if (this.isAuthenticated) {
        return this.fields
      } else {
        return this.fields.filter(field => !moderationFieldsCodes.includes(field.key))
      }
    }
  },
  methods: {
    async reloadItemsModerationSelection (itemsSelection) {
      for (const itemId of itemsSelection) {
        const item = this.discussions.data.find(it => it.id === itemId)
        this.reloadItemModerationData(item)
      }
    },
    async reloadItemModerationData (itemObject) {
      const itemStatus = await this.$MODERATIONcli.getModeration(this.dgfType, itemObject)
      const consolidated = await this.$MODERATIONcli.addModerationData(itemObject, itemStatus)
      this.discussions.data = this.discussions.data.map(item => (
        item.id === itemObject.id ? consolidated : item
      ))
    },
    async appendModerationData (itemObject) {
      if (this.isAuthenticated) {
        const newData = await Promise.all(itemObject.data.map(async (obj) => {
          const itemStatus = await this.$MODERATIONcli.getModeration(this.dgfType, obj)
          const consolidated = this.$MODERATIONcli.addModerationData(obj, itemStatus)
          return consolidated
        }))
        itemObject.data = newData
      }
      this.needsModerationData = false
      return itemObject
    },
    addQueryAndGet (evt) {
      evt.preventDefault()
      if (!this.noQueryAdd && evt.keyCode === 13) {
        this.$router.push({ path: this.$route.path, query: { page: this.pagination.page, q: this.query } })
      }
      this.getDiscussions(true)
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
          this.discussionsRequest = results.url
          this.discussions = results.body
          this.needsModerationData = true
          this.pagination.totalItems = results.body.total
          this.isLoading = false
        },
        reason => console.error(`-C- DiscussionsList > failed on api call: ${reason}`)
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
      this.getDiscussions(true)
    },
    changePagination (pageNumber) {
      this.pagination.page = pageNumber
      const newPath = { path: this.$route.path, query: { page: pageNumber } }
      if (this.query) { newPath.query.q = this.query }
      if (!this.noQueryAdd) { this.$router.push(newPath) }
    },
    changeSorting (sort) {
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
