<template>
  <div class="user-card-component">

    <b-card
      class="border-0"
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
            :item="user"
            :hideFields="['chat', 'comment', 'spotlight', 'share']"
            @responseAction="callbackAction"
            >
          </EditItemBtn>
        </div>
      </template>

      <!-- VIEW -->
      <div v-if="user && !edit">

        <CardProducer
          :item="{owner: user}"
          :hide="['seeProfile']"
        />

        <CardDescription
          :text="user.about"
        />

        <hr>
        <hr>
        <b-card-text>
          Roles :<br>
          <code>
            {{ user.roles.join(" | ") }}
          </code>
        </b-card-text>

      </div>

      <!-- EDIT -->
      <b-container v-if="user && isAuthenticated && edit">

        <b-form @submit="updateUser">

          <!-- FIRST NAME -->
          <b-form-group
            id="input-group-first-name"
            label="First Name"
            label-for="user-first-name"
            description="the user's first name..."
            >
            <b-form-input
              id="user-first-name"
              v-model="user.first_name"
              placeholder="Add user's first name..."
            ></b-form-input>
          </b-form-group>
          <hr>

          <!-- LAST NAME -->
          <b-form-group
            id="input-group-last-name"
            label="Last Name"
            label-for="user-last-name"
            description="the user's last name..."
            >
            <b-form-input
              id="user-last-name"
              v-model="user.last_name"
              placeholder="Add user's last name..."
            ></b-form-input>
          </b-form-group>
          <hr>

          <!-- ABOUT -->
          <b-form-group
            id="input-group-description"
            label="About"
            label-for="textarea"
            description="the user's about description..."
            >
            <b-form-textarea
              id="textarea"
              v-model="user.about"
              placeholder="Add an about description ..."
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
        v-if="!user"
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
        :see="seeRaw"
        title="user data"
        :dataRaw="user"
      ></RawData>

      <RawData
        :customClass="`mb-3`"
        :see="seeRawActivity"
        title="user activity"
        :dataRaw="userActivity"
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
  name: 'UserCard',
  components: {
    CardProducer,
    CardDescription,
    EditItemBtn,
    RawData
  },
  props: [
    'cardTitle',
    'cardFooter',
    'userData',
    'userId',
    'height'
  ],
  data () {
    return {
      activityEndpoints: APIoperations.activityEndpoints,
      dgfType: 'user',
      edit: false,
      seeRaw: true,
      seeRawActivity: false,
      isLoading: false,
      defaultText: 'user is loading',
      activityOperationId: 'activity',
      putOperationId: 'update_user',
      user: undefined,
      userActivity: undefined
    }
  },
  created () {
    this.getUserActivity()
  },
  watch: {
    userData (next) {
      if (next) {
        this.user = next
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
    userTitle () {
      return this.user ? `${this.user.first_name} ${this.user.last_name}` : this.defaultText
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
    getUserActivity () {
      const API = this.$APIcli
      const params = { user: this.userId }
      this.isLoading = true
      API._request(this.activityOperationId, { params }).then(
        results => {
          this.userActivity = results.body
          this.isLoading = false
        },
        reason => {
          console.error(`failed on api call: ${reason}`)
          this.isLoading = false
        }
      )
    },
    updateUser (evt) {
      evt.preventDefault()
      const API = this.$APIcli
      this.isLoading = true
      const params = {
        user: this.userId,
        payload: this.user
      }
      const body = {}
      API._request(this.putOperationId, { params, body, needAuth: true }).then(
        results => {
          this.isLoading = false
          this.user = results.body
        },
        reason => {
          console.error(`-C- UserCard > failed on api call: ${reason}`)
          this.isLoading = false
        }
      )
    }
  }
}

</script>
