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
            :endpoint="putOperationId"
            :item="organization"
            :hideFields="['chat']"
            @responseAction="callbackAction"
            >
          </EditItemBtn>
        </div>
      </template>

      <RawData
        :customClass="`mb-3`"
        :see="seeRaw"
        :dataRaw="organization"
      ></RawData>

      <!-- VIEW -->
      <div v-if="organization">
        <hr>
        <b-card-text>
          Organization name :<br>
          {{ organization.name }}
        </b-card-text>

        <!-- EDIT -->
        <b-button
          v-if="isAuthenticated && !edit"
          @click="edit=true"
          variant="primary"
          >
          <b-icon icon="pencil" aria-hidden="true"></b-icon>
          {{ $t('actions.edit') }}
        </b-button>
      </div>

      <!-- EDIT -->
      <b-container v-if="organization && isAuthenticated && edit">
        <hr>
        <b-form @submit="commentOrganization">

          <!-- COMMENT -->
          <b-form-group
            id="input-group-comment"
            label="Comment"
            label-for="organization-comment"
            description="your comment ..."
            >
            <b-form-input
              id="organization-comment"
              v-model="comment"
              placeholder="comment organization..."
            ></b-form-input>
          </b-form-group>

          <!-- CLOSE ISSUE -->
          <b-form-checkbox
            id="checkbox-close-organization"
            v-model="closeOrganization"
            name="checkbox-close-organization"
            >
            {{ $t('basics.organizations', {list: $t('actions.close')}) }}
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
            <b-spinner label="loading"></b-spinner>
          </div>

        </b-form>

      </b-container>

      <!-- EMPTY -->
      <div v-if="!organization">
        <!-- {{ defaultText }} -->
        <b-spinner label="loading"></b-spinner>
      </div>

    </b-card>
  </div>

</template>

<script>
import { mapState, mapGetters } from 'vuex'

import EditItemBtn from '@/components/ux/EditItemBtn.vue'
import RawData from '@/components/ux/RawData.vue'

export default {
  name: 'OrganizationCard',
  components: {
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
      edit: false,
      seeRaw: true,
      isLoading: false,
      defaultText: 'organization is loading',
      putOperationId: 'comment_organization',
      organization: undefined,
      comment: '',
      closeOrganization: false
    }
  },
  created () {
    // console.log('-C- OrganizationCard > created ... ')
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
      // console.log('-C- OrganizationCard > callbackAction > evt : ', evt)
      switch (evt.category) {
        case 'openEdit':
          this.edit = true
          break
        case 'comment':
          this.edit = true
          break
      }
    },
    commentOrganization (evt) {
      evt.preventDefault()
      const API = this.$APIcli
      // console.log('-C- OrganizationCard > methods > commentOrganization > API :', API)
      this.isLoading = true
      const params = {
        id: this.organizationId,
        payload: {
          comment: this.comment,
          close: this.closeOrganization
        }
      }
      const body = {}
      API._request(this.putOperationId, { params, body, needAuth: true }).then(
        results => {
          this.isLoading = false
          // console.log('-C- OrganizationCard > methods > commentOrganization > results.body :', results.body)
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
