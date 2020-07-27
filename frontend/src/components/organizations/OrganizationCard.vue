<template>
  <div class="organization-card-component">

    <b-card
      header-tag="header"
      :header="cardTitle"
      footer-tag="footer"
      :footer="cardFooter"
      class="mt-3 mx-auto text-center"
      :style="`width: ${width};`"
      >

      <!-- VIEW -->
      <div v-if="organization">
        <hr>
        <b-card-text>
          Organization title :<br>
          {{ organization.title }}
        </b-card-text>
        <hr>
        <b-card-text>
          <code>
            {{ organization }}
          </code>
        </b-card-text>

        <!-- EDIT -->
        <b-button
          v-if="isAuthenticated && !edit"
          @click="edit=true"
          variant="primary"
          >
          <b-icon icon="pencil" aria-hidden="true"></b-icon>
          edit
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
            Close organization
          </b-form-checkbox>

          <hr>

          <div v-if="!isLoading">
            <b-button @click="edit=false" class="mx-2" variant="danger">
              <b-icon icon="x" aria-hidden="true"></b-icon>
              cancel
            </b-button>
            <b-button type="submit" class="mx-2" variant="success">
              <b-icon icon="check2" aria-hidden="true"></b-icon>
              comment
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

export default {
  name: 'OrganizationCard',
  props: [
    'cardTitle',
    'cardFooter',
    'organizationData',
    'organizationId',
    'width',
    'height'
  ],
  data () {
    return {
      edit: false,
      isLoading: false,
      defaultText: 'organization is loading',
      putOperationId: 'comment_organization',
      organization: undefined,
      comment: '',
      closeOrganization: false
    }
  },
  created () {
    console.log('-C- OrganizationCard > created ... ')
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
    commentOrganization (evt) {
      evt.preventDefault()
      const API = this.$APIcli
      console.log('-C- OrganizationCard > methods > commentOrganization > API :', API)
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
          console.log('-C- OrganizationCard > methods > commentOrganization > results.body :', results.body)
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
