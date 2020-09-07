<template>
  <div class="dataset-card-component">

    <b-card
      footer-tag="footer"
      :footer="cardFooter"
      >

      <template v-slot:header>
        <div class="d-flex flex-row justify-content-between align-items-center">
          <div class="flex-fill align-content-center">
            {{ cardTitle }}
          </div>
          <EditItemBtn
            :dgfType="dgfType"
            :endpoint="putOperationId"
            :item="dataset"
            :hideFields="['chat']"
            @responseAction="callbackAction"
            >
          </EditItemBtn>
        </div>
      </template>

      <RawData
        :customClass="`mb-3`"
        :dataRaw="dataset"
        :see="seeRaw"
      ></RawData>

      <RawData
        :customClass="`my-3`"
        :see="seeRawActivity"
        title="dataset activity"
        :dataRaw="datasetActivity"
      ></RawData>

      <!-- VIEW -->
      <div v-if="dataset && !edit">
        <b-card-text class="mb-5">
          <b-table striped hover :items="[{ frequency: dataset.frequency, license: dataset.license, last_update: dataset.last_update }]"></b-table>
        </b-card-text>
        <b-card-text v-if="dataset.owner">
          Owner :
          <router-link :to="`/users/${dataset.owner.id}`">
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
              {{ $t('basics.resources', { list: '' }) }}
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
        <!-- <b-button
          v-if="isAuthenticated"
          @click="edit=true"
          variant="primary"
          >
          <b-icon icon="pencil" aria-hidden="true"></b-icon>
          {{ $t('actions.edit') }}
        </b-button> -->

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
              {{ $t('actions.cancel') }}
            </b-button>
            <b-button type="submit" class="mx-2" variant="success">
              <b-icon icon="check2" aria-hidden="true"></b-icon>
              {{ $t('actions.save') }}
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

import { APIoperations } from '@/config/APIoperations.js'

import EditItemBtn from '@/components/ux/EditItemBtn.vue'
import RawData from '@/components/ux/RawData.vue'

export default {
  name: 'DatasetCard',
  components: {
    EditItemBtn,
    RawData
  },
  props: [
    'cardTitle',
    'cardFooter',
    'datasetData',
    'datasetId',
    'height'
  ],
  data () {
    return {
      activityEndpoints: APIoperations.activityEndpoints,
      updateEndpoints: APIoperations.updateEndpoints,
      commentEndpoints: APIoperations.commentEndpoints,
      dgfType: 'dataset',
      edit: false,
      comment: false,
      seeRaw: false,
      seeRawActivity: false,
      isLoading: false,
      defaultText: 'dataset is loading',
      defaultOwner: '...',
      putOperationId: 'update_dataset',
      activityOperationId: 'activity',
      dataset: undefined,
      datasetActivity: undefined,
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
    this.getDatasetActivity()
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
    callbackAction (evt) {
      // console.log('-C- DatasetCard > callbackAction > evt : ', evt)
      switch (evt.category) {
        case 'openEdit':
          this.edit = true
          break
      }
    },
    getDatasetActivity () {
      const API = this.$APIcli
      // console.log('-C- DatasetCard > methods > getDatasetActivity > API :', API)
      const params = { dataset: this.datasetId }
      this.isLoading = true
      API._request(this.activityOperationId, { params }).then(
        results => {
          // console.log('-C- DatasetCard > methods > getDatasetActivity > results.body :', results.body)
          this.datasetActivity = results.body
          this.isLoading = false
        },
        reason => {
          console.error(`failed on api call: ${reason}`)
          this.isLoading = false
        }
      )
    },
    updateDataset (evt) {
      evt.preventDefault()
      const API = this.$APIcli
      // console.log('-C- DatasetCard > methods > updateDataset > API :', API)
      this.isLoading = true
      const params = {
        dataset: this.datasetId,
        payload: this.dataset
      }
      const body = {}
      API._request(this.putOperationId, { params, body, needAuth: true }).then(
        results => {
          this.isLoading = false
          // console.log('-C- DatasetCard > methods > updateDataset > results.body :', results.body)
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
