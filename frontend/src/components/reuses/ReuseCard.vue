<template>
  <div class="reuse-card-component">

    <b-card
      header-tag="header"
      :header="cardTitle"
      footer-tag="footer"
      :footer="cardFooter"
      class="mt-3 mx-auto text-center"
      :style="`width: ${width};`"
      >

      <!-- VIEW -->
      <div v-if="reuse">
        <hr>
        <b-card-text>
          Reuse title :<br>
          {{ reuse.title }}
        </b-card-text>
        <hr>
        <b-card-text>
          <code>
            {{ reuse }}
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
      <b-container v-if="reuse && isAuthenticated && edit">
        <hr>
        <b-form @submit="commentReuse">

          <!-- COMMENT -->
          <b-form-group
            id="input-group-comment"
            label="Comment"
            label-for="reuse-comment"
            description="your comment ..."
            >
            <b-form-input
              id="reuse-comment"
              v-model="comment"
              placeholder="comment reuse..."
            ></b-form-input>
          </b-form-group>

          <!-- CLOSE ISSUE -->
          <b-form-checkbox
            id="checkbox-close-reuse"
            v-model="closeReuse"
            name="checkbox-close-reuse"
            >
            Close reuse
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
      <div v-if="!reuse">
        <!-- {{ defaultText }} -->
        <b-spinner label="loading"></b-spinner>
      </div>

    </b-card>
  </div>

</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'ReuseCard',
  props: [
    'cardTitle',
    'cardFooter',
    'reuseData',
    'reuseId',
    'width',
    'height'
  ],
  data () {
    return {
      edit: false,
      isLoading: false,
      defaultText: 'reuse is loading',
      putOperationId: 'comment_reuse',
      reuse: undefined,
      comment: '',
      closeReuse: false
    }
  },
  created () {
    console.log('-C- ReuseCard > created ... ')
  },
  watch: {
    reuseData (next) {
      if (next) {
        this.reuse = next
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
    commentReuse (evt) {
      evt.preventDefault()
      const API = this.$APIcli
      console.log('-C- ReuseCard > methods > commentReuse > API :', API)
      this.isLoading = true
      const params = {
        id: this.reuseId,
        payload: {
          comment: this.comment,
          close: this.closeReuse
        }
      }
      const body = {}
      API._request(this.putOperationId, { params, body, needAuth: true }).then(
        results => {
          this.isLoading = false
          console.log('-C- ReuseCard > methods > commentReuse > results.body :', results.body)
          this.reuse = results.body
        },
        reason => {
          console.error(`-C- ReuseCard > failed on api call: ${reason}`)
          this.isLoading = false
        }
      )
    }
  }
}

</script>
