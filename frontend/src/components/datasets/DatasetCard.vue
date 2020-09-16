<template>
  <div
    id="dataset-card"
    class="dataset-card-component">

    <b-card
      no-body
      class="border-0 "
      footer-tag="footer"
      :footer="cardFooter"
      >

      <!-- <template v-slot:header>
        <div class="d-flex flex-row justify-content-between align-items-center">
          <div class="flex-fill align-content-center">
            {{`dataset n° ${datasetId}`}}
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
      </template> -->

      <!-- VIEW -->
      <b-card-body
        v-if="dataset && !edit"
        class="px-0"
        >

        <CardTitle
          :title="dataset.title"
          :dgfType="dgfType"
          :endpoint="putOperationId"
          :item="dataset"
          :hideFields="['chat']"
          @responseAction="callbackAction"
        />

        <CardProducer
          :item="dataset"
        />

        <CardDescription
          :text="dataset.description"
        />

        <CardLicence
          :dataset="dataset"
        />

        <CardResources
          :resources="dataset.resources"
        />

      </b-card-body>

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
      <div
        v-if="!dataset"
        class="py-5 my-5">
        <b-spinner
          style="width: 5rem; height: 5rem;"
          label="loading"
          variant="primary"
          >
        </b-spinner>
      </div>

      <RawData
        :customClass="`my-3`"
        :dataRaw="dataset"
        :see="seeRaw"
      ></RawData>

      <RawData
        :customClass="`my-3`"
        :see="seeRawActivity"
        title="dataset activity"
        :dataRaw="datasetActivity"
      ></RawData>

    </b-card>
  </div>

</template>

<script>
import { mapState, mapGetters } from 'vuex'

import { APIoperations } from '@/config/APIoperations.js'

import CardTitle from '@/components/blocks/CardTitle.vue'
import CardProducer from '@/components/blocks/CardProducer.vue'
import CardDescription from '@/components/blocks/CardDescription.vue'
import CardLicence from '@/components/blocks/CardLicence.vue'
import CardResources from '@/components/blocks/CardResources.vue'

// import EditItemBtn from '@/components/ux/EditItemBtn.vue'
import RawData from '@/components/ux/RawData.vue'

export default {
  name: 'DatasetCard',
  components: {
    CardTitle,
    CardProducer,
    CardDescription,
    CardLicence,
    CardResources,
    // EditItemBtn,
    RawData
  },
  props: [
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
      switch (evt.category) {
        case 'openEdit':
          this.edit = true
          break
      }
    },
    getDatasetActivity () {
      const API = this.$APIcli
      const params = { dataset: this.datasetId }
      this.isLoading = true
      API._request(this.activityOperationId, { params }).then(
        results => {
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
      this.isLoading = true
      const params = {
        dataset: this.datasetId,
        payload: this.dataset
      }
      const body = {}
      API._request(this.putOperationId, { params, body, needAuth: true }).then(
        results => {
          this.isLoading = false
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
