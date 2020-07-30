<template>
  <div class="issue-card-component">

    <b-card
      header-tag="header"
      :header="cardTitle"
      footer-tag="footer"
      :footer="cardFooter"
      class="mt-3 mx-auto text-center"
      :style="`width: ${width};`"
      >

      <RawData
        :customClass="`mb-3`"
        :see="true"
        :dataRaw="issue"
      ></RawData>

      <!-- VIEW -->
      <div v-if="issue">
        <hr>
        <b-card-text>
          Issue title :<br>
          {{ issue.title }}
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
      <b-container v-if="issue && isAuthenticated && edit">
        <hr>
        <b-form @submit="commentIssue">

          <!-- COMMENT -->
          <b-form-group
            id="input-group-comment"
            label="Comment"
            label-for="issue-comment"
            description="your comment ..."
            >
            <b-form-input
              id="issue-comment"
              v-model="comment"
              placeholder="comment issue..."
            ></b-form-input>
          </b-form-group>

          <!-- CLOSE ISSUE -->
          <b-form-checkbox
            id="checkbox-close-issue"
            v-model="closeIssue"
            name="checkbox-close-issue"
            >
            {{ $t('basics.issues', { list: $t('actions.close')}) }}
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
      <div v-if="!issue">
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
  name: 'IssueCard',
  components: {
    RawData
  },
  props: [
    'cardTitle',
    'cardFooter',
    'issueData',
    'issueId',
    'width',
    'height'
  ],
  data () {
    return {
      edit: false,
      isLoading: false,
      defaultText: 'issue is loading',
      putOperationId: 'comment_issue',
      issue: undefined,
      comment: '',
      closeIssue: false
    }
  },
  created () {
    console.log('-C- IssueCard > created ... ')
  },
  watch: {
    issueData (next) {
      if (next) {
        this.issue = next
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
    commentIssue (evt) {
      evt.preventDefault()
      const API = this.$APIcli
      console.log('-C- IssueCard > methods > commentIssue > API :', API)
      this.isLoading = true
      const params = {
        id: this.issueId,
        payload: {
          comment: this.comment,
          close: this.closeIssue
        }
      }
      const body = {}
      API._request(this.putOperationId, { params, body, needAuth: true }).then(
        results => {
          this.isLoading = false
          console.log('-C- IssueCard > methods > commentIssue > results.body :', results.body)
          this.issue = results.body
        },
        reason => {
          console.error(`-C- IssueCard > failed on api call: ${reason}`)
          this.isLoading = false
        }
      )
    }
  }
}

</script>
