<template>

  <b-card
    :class="`text-center ${customClass ? customClass : 'mt-3 mx-auto' }`"
    >

    <p v-if="!hide.includes('title')">
      <slot name="blockTitle"></slot>
    </p>

    <p v-if="!hide.includes('link')">
      <slot name="link" class="mb-3"></slot>
    </p>

    <div
      v-if="!hide.includes('from')"
      class="mb-2"
      >
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

    <!-- QUERY -->
    <b-input-group>
      <b-input-group-prepend is-text>
        <b-icon icon="search"></b-icon>
      </b-input-group-prepend>
      <b-form-input
        id="inline-form-input-query"
        :placeholder="$t('actions.searchFor', {target: $t('basics.dataset')})"
        v-model="query"
        @input="suggestDatasets"
        list="suggestions-list"
        >
      </b-form-input>
      <b-input-group-append v-if="query">
        <b-button
          variant="outline-secondary"
          class="bg-light"
          @click="resetQuery"
          >
          <b-icon icon="x" aria-hidden="true"></b-icon>
        </b-button>
      </b-input-group-append>
      <b-form-datalist
        id="suggestions-list"
        :options="suggestions">
      </b-form-datalist>
    </b-input-group>

    <b-table
      v-if="datasets"
      class="bg-light mt-5"
      striped hover responsive scrollable
      small
      :sticky-header="height"
      :items="datasets"
      :fields="fields"
      >

      <template v-slot:cell(image_url)="data">
        <router-link
          :to="`/datasets/${data.item.id}`"
          >
          <b-img
            thumbnail
            fluid
            :src="data.item.image_url"
            :alt="data.item.title">
          </b-img>
        </router-link>
      </template>

      <template v-slot:cell(title)="data">

        <b-button
          variant="link"
          @click="emitResponse(data.item.id)"
          >
          <!-- @click="emitResponse(`/datasets/${data.item.id}`)" -->
          <span
            >
            <b>{{ data.item.title }}</b>
          </span>
        </b-button>
        <!-- <router-link
          :to="`/datasets/${data.item.id}`"
          >
          <span>
            <b>{{ data.item.title }}</b>
          </span>
        </router-link> -->

      </template>

      <template v-slot:cell(page)="data">
        <b-button variant="outline-primary" :href="data.item.page" target="_blank">
          <b-icon icon="link" aria-hidden="true"></b-icon>
        </b-button>
      </template>

    </b-table>

    <RawData
      :customClass="`mt-2`"
      :dataRaw="datasets"
    ></RawData>

    <p v-if="isLoading">
      <b-spinner label="loading"></b-spinner>
    </p>
  </b-card>

</template>

<script>
import { mapState } from 'vuex'

import RawData from '@/components/ux/RawData.vue'

export default {
  name: 'DatasetsSuggest',
  components: {
    RawData
  },
  props: [
    'customClass',
    'hideBlocks',
    'height',
    'width',
    'customFields'
  ],
  data () {
    return {
      isLoading: false,
      hide: undefined,
      seeRaw: false,
      operationId: 'suggest_datasets',
      datasets: undefined,
      datasetsRequest: undefined,
      query: undefined,
      size: 5,
      suggestions: [],
      fields: [
        { key: 'image_url', label: 'Image Avatar' },
        { key: 'title', stickyColumn: true, isRowHeader: true, sortable: true },
        'acronym',
        { key: 'page', label: 'Page on datagouv' },
        { key: 'score', label: 'Score' }
      ]
    }
  },
  created () {
    this.hide = this.hideBlocks ? this.hideBlocks : []
    if (this.customFields) { this.fields = this.customFields }
  },
  computed: {
    ...mapState({
      log: (state) => state.log
    })
  },
  methods: {
    emitResponse (datasetId) {
      console.log('-C- ModerationActionsBtn > emitResponse ...')
      console.log('-C- ModerationActionsBtn > emitResponse > datasetId : ', datasetId)
      this.$emit('closeSearch')
      const newPath = `/datasets/${datasetId}`
      this.$router.push(newPath)
      // this.$router.go({ name: 'DatasetUpdate', params: { id: datasetId } })
      // history.pushState({}, null, newPath)
    },
    suggestDatasets () {
      this.isLoading = true
      const params = {
        q: this.query,
        size: this.size
      }
      const body = {}
      const authNeeded = false
      this.$APIcli._request(this.operationId, { params, body, needAuth: authNeeded }).then(
        results => {
          this.datasetsRequest = results.url
          this.datasets = results.body
          this.isLoading = false
        },
        reason => console.error(`-C- DatasetsSuggest > failed on api call: ${reason}`)
      )
    },
    resetQuery () {
      this.query = ''
      this.datasets = undefined
      this.datasetsRequest = this.operationId
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
