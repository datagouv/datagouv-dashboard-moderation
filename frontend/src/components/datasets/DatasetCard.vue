<template>
  <div class="dataset-card-component">

    <b-card
      header-tag="header"
      :header="cardTitle"
      footer-tag="footer"
      :footer="cardFooter"
      :title="datasetTitle"
      class="mt-3 mx-auto text-center"
      :style="`width: ${width};`"
      >

      <RawData
        :customClass="`mb-3`"
        :dataRaw="dataset"
      ></RawData>

      <!-- VIEW -->
      <div v-if="dataset && !edit">
        <b-card-text class="mb-5">
          <b-table striped hover :items="[{ frequency: dataset.frequency, license: dataset.license, last_update: dataset.last_update }]"></b-table>
        </b-card-text>
        <b-card-text v-if="dataset.owner">
          Owner :
          <router-link :to="`/user/${dataset.owner.id}`">
            {{ datasetOwner }}
          </router-link>
        </b-card-text>
        <hr>
        <b-card-text class="mb-3">
          Description :<br><br>
          <div class="text-justify">
            {{ dataset.description }}
          </div>
        </b-card-text>

        <!-- RESOURCES -->
        <b-card-text
          v-if="dataset.resources"
          >
          <hr>
          <div class="mb-3">
            <b>
              {{ dataset.resources.length }}
              resources
            </b>
          </div>
          <b-table
            striped hover
            :fields="fields"
            :items="dataset.resources"
            >

            <template v-slot:cell(title)="data">
              <router-link
                :to="`/resource/${data.item.id}`"
                >
                <b>{{ data.item.title }}</b>
              </router-link>
            </template>

            <template v-slot:cell(url)="data">
              <b-button variant="outline-primary" :href="data.value" target="_blank">
                <b-icon icon="link" aria-hidden="true"></b-icon>
              </b-button>
            </template>

          </b-table>
        </b-card-text>

        <!-- EDIT -->
        <b-button
          v-if="isAuthenticated"
          @click="edit=true"
          variant="primary"
          >
          <b-icon icon="pencil" aria-hidden="true"></b-icon>
          edit
        </b-button>
      </div>

      <!-- EDIT -->
      <b-container v-if="dataset && isAuthenticated && edit">

        <b-form @submit="updateDataset">

          <!-- TITLE -->
          <b-form-group
            id="input-group-title"
            label="Title"
            label-for="dataset-title"
            description="the dataset's title..."
          >
            <b-form-input
              id="dataset-title"
              v-model="dataset.title"
              placeholder="Add title something..."
            ></b-form-input>
          </b-form-group>
          <hr>

          <!-- DESCRIPTION -->
          <b-form-group
            id="input-group-description"
            label="Description"
            label-for="textarea"
            description="the dataset's description..."
          >
            <b-form-textarea
              id="textarea"
              v-model="dataset.description"
              placeholder="Add a description ..."
              rows="3"
              max-rows="6"
            ></b-form-textarea>
          </b-form-group>
          <hr>

          <div v-if="!isLoading">
            <b-button @click="edit=false" class="mx-2" variant="danger">
              <b-icon icon="x" aria-hidden="true"></b-icon>
              cancel
            </b-button>
            <b-button type="submit" class="mx-2" variant="success">
              <b-icon icon="check2" aria-hidden="true"></b-icon>
              save
            </b-button>
          </div>
          <div v-else>
            <b-spinner label="loading"></b-spinner>
          </div>

        </b-form>

      </b-container>

      <!-- EMPTY -->
      <div v-if="!dataset">
        <!-- {{ defaultText }} -->
        <b-spinner label="loading"></b-spinner>
      </div>

    </b-card>
  </div>

</template>

<script>
import { mapState, mapGetters } from 'vuex'

import RawData from '@/components/ux/RawData.vue'

export default {
  name: 'DatasetCard',
  components: {
    RawData
  },
  props: [
    'cardTitle',
    'cardFooter',
    'datasetData',
    'datasetId',
    'width',
    'height'
  ],
  data () {
    return {
      edit: false,
      isLoading: false,
      seeRaw: false,
      defaultText: 'dataset is loading',
      defaultOwner: '...',
      putOperationId: 'update_dataset',
      dataset: undefined,
      fields: [
        'title',
        { key: 'title', stickyColumn: true, isRowHeader: true },
        { key: 'url', label: 'resource url' },
        { key: 'mime', stickyColumn: true },
        'filesize',
        'id'
      ]
    }
  },
  created () {
    console.log('-C- DatasetCard > created ... ')
  },
  watch: {
    datasetData (next) {
      if (next) {
        this.dataset = next
      }
    }
  },
  computed: {
    ...mapState({
      log: (state) => state.global.log
    }),
    ...mapGetters({
      isAuthenticated: 'oauth/isAuthenticated'
    }),
    datasetTitle () {
      return this.dataset ? this.dataset.title : this.defaultText
    },
    datasetOwner () {
      return this.dataset && this.dataset.owner ? `${this.dataset.owner.first_name} ${this.dataset.owner.last_name}` : this.defaultOwner
    }
  },
  methods: {
    updateDataset (evt) {
      evt.preventDefault()
      const API = this.$APIcli
      console.log('-C- DatasetCard > methods > updateDataset > API :', API)
      this.isLoading = true
      const params = {
        dataset: this.datasetId,
        payload: this.dataset
      }
      const body = {}
      API._request(this.putOperationId, { params, body, needAuth: true }).then(
        results => {
          this.isLoading = false
          console.log('-C- DatasetCard > methods > updateDataset > results.body :', results.body)
          this.dataset = results.body
        },
        reason => {
          console.error(`-C- DatasetCard > failed on api call: ${reason}`)
          this.isLoading = false
        }
      )
    }
  }
}

</script>
