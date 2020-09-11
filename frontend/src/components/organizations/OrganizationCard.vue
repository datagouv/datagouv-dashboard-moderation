<template>
  <div class="organization-card-component">

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
            :item="organization"
            :hideFields="['chat']"
            @responseAction="callbackAction"
            >
          </EditItemBtn>
        </div>
      </template>

      <!-- VIEW -->
      <div v-if="organization">

        <CardProducer
          :item="{organization: organization}"
          :hide="['seeProfile']"
        />

        <CardDescription
          :text="organization.description"
        />

      </div>

      <!-- EDIT -->
      <b-container v-if="organization && isAuthenticated && edit">

        <b-form @submit="updateOrganization">

          <!-- TITLE -->
          <b-form-group
            id="input-group-name"
            label="Name"
            label-for="organization-name"
            description="the organization's title..."
          >
            <b-form-input
              id="organization-name"
              v-model="organization.name"
              placeholder="Add name something..."
            ></b-form-input>
          </b-form-group>
          <hr>

          <!-- DESCRIPTION -->
          <b-form-group
            id="input-group-description"
            label="Description"
            label-for="textarea"
            description="the organization's description..."
          >
            <b-form-textarea
              id="textarea"
              v-model="organization.description"
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
        v-if="!organization"
        class="py-5 my-5">
        <b-spinner
          style="width: 5rem; height: 5rem;"
          label="loading"
          variant="primary"
          >
        </b-spinner>
      </div>

      <RawData
        :customClass="`mb-3`"
        :see="seeRaw"
        :dataRaw="organization"
      ></RawData>

      <RawData
        :customClass="`my-3`"
        :see="seeRawActivity"
        title="organization activity"
        :dataRaw="organizationActivity"
      ></RawData>

    </b-card>
  </div>

</template>

<script>
import { mapState, mapGetters } from 'vuex'

import { APIoperations } from '@/config/APIoperations.js'

import CardProducer from '@/components/blocks/CardProducer.vue'
import CardDescription from '@/components/blocks/CardDescription.vue'

import EditItemBtn from '@/components/ux/EditItemBtn.vue'
import RawData from '@/components/ux/RawData.vue'

export default {
  name: 'OrganizationCard',
  components: {
    CardProducer,
    CardDescription,
    EditItemBtn,
    RawData
  },
  props: [
    'cardTitle',
    'cardFooter',
    'organizationData',
    'organizationId',
    'height'
  ],
  data () {
    return {
      activityEndpoints: APIoperations.activityEndpoints,
      updateEndpoints: APIoperations.updateEndpoints,
      commentEndpoints: APIoperations.commentEndpoints,
      dgfType: 'organization',
      edit: false,
      seeRaw: false,
      seeRawActivity: false,
      isLoading: false,
      defaultText: 'organization is loading',
      putOperationId: 'update_organization',
      activityOperationId: 'activity',
      organization: undefined,
      organizationActivity: undefined,
      closeOrganization: false
    }
  },
  created () {
    this.getOrganizationActivity()
  },
  watch: {
    organizationData (next) {
      if (next) {
        this.organization = next
      }
    }
  },
  computed: {
    ...mapState({
      log: (state) => state.global.log
    }),
    ...mapGetters({
      isAuthenticated: 'oauth/isAuthenticated'
    })
  },
  methods: {
    callbackAction (evt) {
      switch (evt.category) {
        case 'openEdit':
          this.edit = true
          break
        case 'comment':
          this.comment = true
          break
      }
    },
    getOrganizationActivity () {
      const API = this.$APIcli
      const params = { organization: this.organizationId }
      this.isLoading = true
      API._request(this.activityOperationId, { params }).then(
        results => {
          this.organizationActivity = results.body
          this.isLoading = false
        },
        reason => {
          console.error(`failed on api call: ${reason}`)
          this.isLoading = false
        }
      )
    },
    updateOrganization (evt) {
      evt.preventDefault()
      const API = this.$APIcli
      this.isLoading = true
      const params = {
        org: this.organizationId,
        payload: this.organization
      }
      const body = {}
      API._request(this.putOperationId, { params, body, needAuth: true }).then(
        results => {
          this.isLoading = false
          this.organization = results.body
        },
        reason => {
          console.error(`-C- OrganizationCard > failed on api call: ${reason}`)
          this.isLoading = false
        }
      )
    }
  }
}

</script>
