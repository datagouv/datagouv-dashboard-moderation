<template>
  <div class="discussion-card-component">

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
            :item="discussion"
            :hideFields="['spotlight','follow', 'share', 'contactProducer']"
            @responseAction="callbackAction"
            >
          </EditItemBtn>
        </div>
      </template>

      <RawData
        :customClass="`mb-3`"
        :see="seeRaw"
        :dataRaw="discussion"
      ></RawData>

      <!-- VIEW -->
      <div v-if="discussion">
        <hr>
        <b-card-text>
          Discussion title :<br>
          {{ discussion.title }}
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
      <b-container v-if="discussion && isAuthenticated && edit">
        <hr>
        <b-form @submit="commentDiscussion">

          <!-- COMMENT -->
          <b-form-group
            id="input-group-comment"
            label="Comment"
            label-for="discussion-comment"
            description="your comment ..."
            >
            <b-form-input
              id="discussion-comment"
              v-model="comment"
              placeholder="comment discussion..."
            ></b-form-input>
          </b-form-group>

          <!-- CLOSE ISSUE -->
          <b-form-checkbox
            id="checkbox-close-discussion"
            v-model="closeDiscussion"
            name="checkbox-close-discussion"
            >
            {{ $t('basics.discussions', { list: $t('actions.close') }) }}
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
      <div v-if="!discussion">
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
  name: 'DiscussionCard',
  components: {
    EditItemBtn,
    RawData
  },
  props: [
    'cardTitle',
    'cardFooter',
    'discussionData',
    'discussionId',
    'height'
  ],
  data () {
    return {
      edit: false,
      seeRaw: true,
      isLoading: false,
      defaultText: 'discussion is loading',
      putOperationId: 'comment_discussion',
      discussion: undefined,
      comment: '',
      closeDiscussion: false
    }
  },
  created () {
    console.log('-C- DiscussionCard > created ... ')
  },
  watch: {
    discussionData (next) {
      if (next) {
        this.discussion = next
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
      console.log('-C- DiscussionCard > callbackAction > evt : ', evt)
      switch (evt.category) {
        case 'openEdit':
          this.edit = true
          this.seeRaw = false
          break
      }
    },
    commentDiscussion (evt) {
      evt.preventDefault()
      const API = this.$APIcli
      console.log('-C- DiscussionCard > methods > commentDiscussion > API :', API)
      this.isLoading = true
      const params = {
        id: this.discussionId,
        payload: {
          comment: this.comment,
          close: this.closeDiscussion
        }
      }
      const body = {}
      API._request(this.putOperationId, { params, body, needAuth: true }).then(
        results => {
          this.isLoading = false
          console.log('-C- DiscussionCard > methods > commentDiscussion > results.body :', results.body)
          this.discussion = results.body
        },
        reason => {
          console.error(`-C- DiscussionCard > failed on api call: ${reason}`)
          this.isLoading = false
        }
      )
    }
  }
}

</script>
