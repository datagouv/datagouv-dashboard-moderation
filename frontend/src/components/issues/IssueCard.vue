<template>
  <div class="issue-card-component">

    <b-card
      no-body
      class="border-0"
      footer-tag="footer"
      :footer="cardFooter"
      >

      <!-- <template v-slot:header>
        <div class="d-flex flex-row justify-content-between align-items-center">
          <div class="flex-fill align-content-center">
            {{ cardTitle }}
          </div>
          <EditItemBtn
            :dgfType="dgfType"
            :endpoint="putOperationId"
            :item="issue"
            :hideFields="['chat']"
            @responseAction="callbackAction"
            >
          </EditItemBtn>
        </div>
      </template> -->

      <!-- VIEW -->
      <b-card-body
        v-if="issue"
        class="px-0"
        >

        <CardTitle
          :title="issue.title"
          :dgfType="dgfType"
          :endpoint="putOperationId"
          :item="issue"
          :hideFields="['chat']"
          @responseAction="callbackAction"
        />

        <DialogRow
          :item="issue"
          :customClass="'mb-5'"
        />

      </b-card-body>

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
      <div
        v-if="!issue"
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
        :dataRaw="issue"
      ></RawData>

    </b-card>
  </div>

</template>

<script>
import { mapState, mapGetters } from 'vuex'

import { APIoperations } from '@/config/APIoperations.js'

import CardTitle from '@/components/blocks/CardTitle.vue'
import DialogRow from '@/components/blocks/DialogRow.vue'

// import EditItemBtn from '@/components/ux/EditItemBtn.vue'
import RawData from '@/components/ux/RawData.vue'

export default {
  name: 'IssueCard',
  components: {
    CardTitle,
    DialogRow,
    // EditItemBtn,
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
      updateEndpoints: APIoperations.updateEndpoints,
      commentEndpoints: APIoperations.commentEndpoints,
      dgfType: 'issue',
      edit: false,
      comment: false,
      seeRaw: true,
      isLoading: false,
      defaultText: 'issue is loading',
      putOperationId: 'comment_issue',
      issue: undefined,
      commentContent: '',
      closeIssue: false
    }
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
      switch (evt.category) {
        case 'openEdit':
          this.edit = true
          this.seeRaw = false
          break
        case 'comment':
          this.comment = true
          break
      }
    },
    commentIssue (evt) {
      evt.preventDefault()
      const API = this.$APIcli
      this.isLoading = true
      const params = {
        id: this.issueId,
        payload: {
          comment: this.commentContent,
          close: this.closeIssue
        }
      }
      const body = {}
      API._request(this.putOperationId, { params, body, needAuth: true }).then(
        results => {
          this.isLoading = false
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
