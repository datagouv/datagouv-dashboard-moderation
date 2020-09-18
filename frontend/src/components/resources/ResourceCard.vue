<template>
  <div
    id="resource-card"
    class="resource-card-component"
    >

    <b-card
      no-body
      class="bg-dark border-0"
      footer-tag="footer"
      :footer="cardFooter"
      >

      <!-- <template v-slot:header>
        <div class="d-flex flex-row justify-content-between align-items-center">
          <div class="flex-fill align-content-center text-white">
            {{`resource n° ${resourceId}`}}
          </div>
          <EditItemBtn
            :dgfType="dgfType"
            :endpoint="putOperationId"
            :item="resource"
            :hideFields="['spotlight','follow', 'share']"
            @responseAction="callbackAction"
            >
          </EditItemBtn>
        </div>
      </template> -->

      <!-- VIEW -->
      <b-card-body
        v-if="resource"
        class="px-0"
        >

        <CardTitle
          :title="resource.title"
          customClass="text-white"
          :dgfType="dgfType"
          :endpoint="putOperationId"
          :item="resource"
          :hideFields="['spotlight','follow', 'share']"
          @responseAction="callbackAction"
        />

        <AnchorsButtons
          :anchorLinks="anchorLinks"
          :customBtnClass="'outline-white'"
        />

        <CardProducer
          :item="resource"
          customBgClass="bg-success"
        />

        <CardDescription
          :text="resource.description"
          customClass="text-white"
        />

      </b-card-body>

      <!-- COMMENT -->
      <b-container v-if="resource && isAuthenticated && comment">
        <hr>
        <b-form @submit="commentResource">

          <!-- COMMENT -->
          <b-form-group
            id="input-group-comment"
            label="Comment"
            label-for="resource-comment"
            description="your comment ..."
            >
            <b-form-input
              id="resource-comment"
              v-model="commentContent"
              placeholder="comment resource..."
            ></b-form-input>
          </b-form-group>

          <!-- CLOSE ISSUE -->
          <b-form-checkbox
            id="checkbox-close-resource"
            v-model="closeResource"
            name="checkbox-close-resource"
            >
            {{ $t('basics.resources', { list: $t('actions.close') }) }}
          </b-form-checkbox>

          <hr>

          <div v-if="!isLoading">
            <b-button @click="edit=false" class="mx-2" variant="danger">
              <b-icon icon="x" aria-hidden="true"></b-icon>
              {{ $t('actions.cancel') }}
            </b-button>
            <b-button type="submit" class="mx-2" variant="success">
              <b-icon icon="check2" aria-hidden="true"></b-icon>
              {{ $t('actions.comment') }}
            </b-button>
          </div>
          <div v-else>
            <custom-spinner :size="1"/>
          </div>

        </b-form>

      </b-container>

      <!-- EDIT -->
      <b-container
        class="my-5"
        v-if="resource && isAuthenticated && edit"
        >

        <b-form @submit="updateDataset">

          <!-- TITLE -->
          <b-form-group
            id="input-group-title"
            label="Title"
            label-for="resource-title"
            description="the resource's title..."
          >
            <b-form-input
              id="dataset-title"
              v-model="resource.title"
              placeholder="Add title something..."
            ></b-form-input>
          </b-form-group>
          <hr>

          <!-- DESCRIPTION -->
          <b-form-group
            id="input-group-description"
            label="Description"
            label-for="textarea"
            description="the resource's description..."
          >
            <b-form-textarea
              id="textarea"
              v-model="resource.description"
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
            <custom-spinner :size="1"/>
          </div>

        </b-form>

      </b-container>

      <!-- EMPTY -->
      <div
        v-if="!resource"
        class="py-5 my-5">
        <custom-spinner/>
      </div>

      <b-row fluid>
        <b-col
          md="8"
          offset-md="2"
          >
          <RawData
            :customClass="`my-3`"
            :see="seeRaw"
            :dataRaw="resource"
            >
          </RawData>
        </b-col>
      </b-row>

    </b-card>
  </div>

</template>

<script>
import { mapState, mapGetters } from 'vuex'

import { APIoperations } from '@/config/APIoperations.js'

import CardTitle from '@/components/blocks/CardTitle.vue'
import CardProducer from '@/components/blocks/CardProducer.vue'
import CardDescription from '@/components/blocks/CardDescription.vue'

import AnchorsButtons from '@/components/ux/AnchorsButtons.vue'
// import EditItemBtn from '@/components/ux/EditItemBtn.vue'
import RawData from '@/components/ux/RawData.vue'

export default {
  name: 'ResourceCard',
  components: {
    CardTitle,
    CardProducer,
    CardDescription,
    AnchorsButtons,
    // EditItemBtn,
    RawData
  },
  props: [
    'cardFooter',
    'resourceData',
    'resourceId',
    'height'
  ],
  data () {
    return {
      updateEndpoints: APIoperations.updateEndpoints,
      commentEndpoints: APIoperations.commentEndpoints,
      dgfType: 'community_resource',
      edit: false,
      comment: false,
      seeRaw: true,
      isLoading: false,
      defaultText: 'resource is loading',
      putOperationId: 'comment_resource',
      resource: undefined,
      commentContent: '',
      closeResource: false,
      anchorLinks: [
        { textCode: 'model.description', link: 'item-description' },
        { textCode: 'model.resources', link: 'item-resources' }
      ]
    }
  },
  watch: {
    resourceData (next) {
      if (next) {
        this.resource = next
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
      }
    },
    commentResource (evt) {
      evt.preventDefault()
      const API = this.$APIcli
      this.isLoading = true
      const params = {
        id: this.resourceId,
        payload: {
          comment: this.commentContent,
          close: this.closeResource
        }
      }
      const body = {}
      API._request(this.putOperationId, { params, body, needAuth: true }).then(
        results => {
          this.isLoading = false
          this.resource = results.body
        },
        reason => {
          console.error(`-C- ResourceCard > failed on api call: ${reason}`)
          this.isLoading = false
        }
      )
    }
  }
}

</script>
