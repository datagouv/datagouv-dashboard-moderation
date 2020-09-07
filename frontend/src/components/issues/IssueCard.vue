<template>
  <div class="issue-card-component">

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
            :item="issue"
            :hideFields="['chat']"
            @responseAction="callbackAction"
            >
          </EditItemBtn>
        </div>
      </template>

      <RawData
        :customClass="`mb-3`"
        :see="seeRaw"
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
        <!-- <b-button
          v-if="isAuthenticated && !edit"
          @click="edit=true"
          variant="primary"
          >
          <b-icon icon="pencil" aria-hidden="true"></b-icon>
          {{ $t('actions.edit') }}
        </b-button> -->
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
            <b-button @click="edit=false; seeRaw=true" class="mx-2" variant="danger">
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

import EditItemBtn from '@/components/ux/EditItemBtn.vue'
import RawData from '@/components/ux/RawData.vue'

export default {
  name: 'IssueCard',
  components: {
    EditItemBtn,
    RawData
  },
  props: [
    'cardTitle',
    'cardFooter',
    'issueData',
    'issueId',
    'height'
  ],
  data () {
    return {
      dgfType: 'issue',
      edit: false,
      seeRaw: true,
      isLoading: false,
      defaultText: 'issue is loading',
      putOperationId: 'comment_issue',
      issue: undefined,
      comment: '',
      closeIssue: false
    }
  },
  created () {
    // console.log('-C- IssueCard > created ... ')
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
    callbackAction (evt) {
      // console.log('-C- DatasetCard > callbackAction > evt : ', evt)
      switch (evt.category) {
        case 'openEdit':
          this.edit = true
          this.seeRaw = false
          break
        case 'comment':
          this.edit = true
          break
      }
    },
    commentIssue (evt) {
      evt.preventDefault()
      const API = this.$APIcli
      // console.log('-C- IssueCard > methods > commentIssue > API :', API)
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
          // console.log('-C- IssueCard > methods > commentIssue > results.body :', results.body)
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
