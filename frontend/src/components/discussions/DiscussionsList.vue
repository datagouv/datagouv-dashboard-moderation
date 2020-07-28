<template>

  <b-card
    class="mt-3 mx-auto text-center"
    :style="`width: ${width};`"
    >
    <p><slot name="blockTitle"></slot></p>
    <p v-if="discussions">
      <b-badge pill variant="primary">
        {{ pagination.totalItems }}
        discussions
      </b-badge>
    </p>

    <p><slot name="link" class="mb-3"></slot></p>
    <div class="mb-2">
      from :
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

      <b-col cols="8" md="6">
        <b-input-group>
          <b-input-group-prepend is-text>
            <b-icon icon="search"></b-icon>
          </b-input-group-prepend>
          <b-form-input
            id="inline-form-input-query-dicussions"
            placeholder="search for a discussion"
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

      <b-col
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

      <!-- A virtual column -->
      <!-- <template v-slot:cell(index)="data">
        {{ data.index + 1 }}
      </template> -->

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
import { mapState } from 'vuex'

export default {
  name: 'DiscussionsList',
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
      operationId: 'list_discussions',
      discussions: undefined,
      discussionsRequest: undefined,
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
        { key: 'title', label: 'title', stickyColumn: true, isRowHeader: true },
        { key: 'discussion', label: 'number of discussions', sortable: true },
        { key: 'subject', label: 'related to' },
        { key: 'created', label: 'created at', sortable: true },
        'id'
      ]
    }
  },
  created () {
    console.log('-C- DiscussionsList > created ... ')
    if (this.customFields) { this.fields = this.customFields }
    this.getDiscussions()
  },
  computed: {
    ...mapState({
      log: (state) => state.log
    })
  },
  methods: {
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
          console.log('-C- DiscussionsList > created > results.body :', results.body)
          this.discussionsRequest = results.url
          this.discussions = results.body
          this.pagination.totalItems = results.body.total
          this.isLoading = false
        },
        reason => console.error(`-C- DiscussionsList > failed on api call: ${reason}`)
      )
    },
    resetQuery () {
      this.query = undefined
      this.getDiscussions(true)
    },
    changePagination (pageNumber) {
      console.log('-C- DiscussionsList > changePagination > pageNumber ', pageNumber)
      this.pagination.page = pageNumber
      this.getDiscussions()
    },
    changeSorting (sort) {
      console.log('-C- DiscussionsList > changeSorting > sort ', sort)
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
  .table > thead > tr > th {
    vertical-align: middle !important;
  }
</style>
