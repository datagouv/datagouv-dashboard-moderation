<template>
  <div class="user-card-component">

    <b-card
      header-tag="header"
      :header="cardTitle"
      footer-tag="footer"
      :footer="cardFooter"
      :title="userTitle"
      class="mt-3 mx-auto text-center"
      :style="`width: ${width};`"
      >

      <!-- VIEW -->
      <div v-if="user && !edit">
        <hr>
        <b-card-text>
          About :<br>
          {{ user.about }}
        </b-card-text>
        <hr>
        <b-card-text>
          Roles :<br>
          <code>
            {{ user.roles.join(" | ") }}
          </code>
        </b-card-text>
        <!-- <hr>
        <b-card-text>
          <code>
            {{ user }}
          </code>
        </b-card-text> -->

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
            <b-button type="submit" variant="primary">
              <b-icon icon="check2" aria-hidden="true"></b-icon>
              save
            </b-button>
            &nbsp;
            <b-button @click="edit=false" variant="light">
              <b-icon icon="x" aria-hidden="true"></b-icon>
              cancel
            </b-button>
          </div>
          <div v-else>
            <b-spinner label="loading"></b-spinner>
          </div>

        </b-form>

      </b-container>

      <!-- EMPTY -->
      <div v-if="!user">
        <!-- {{ defaultText }} -->
        <b-spinner label="loading"></b-spinner>
      </div>

    </b-card>
  </div>

</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'UserCard',
  props: [
    'cardTitle',
    'cardFooter',
    'userData',
    'userId',
    'width',
    'height'
  ],
  data () {
    return {
      edit: false,
      isLoading: false,
      defaultText: 'user is loading',
      putOperationId: 'update_user',
      user: undefined
    }
  },
  created () {
    console.log('-C- UserCard > created ... ')
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
    updateUser (evt) {
      evt.preventDefault()
      const API = this.$APIcli
      console.log('-C- UserCard > methods > updateUser > API :', API)
      this.isLoading = true
      const params = {
        user: this.userId,
        payload: this.user
      }
      const body = {}
      API._request(this.putOperationId, { params, body, needAuth: true }).then(
        results => {
          this.isLoading = false
          console.log('-C- UserCard > methods > updateUser > results.body :', results.body)
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
