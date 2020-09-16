<template>
  <div
    id="discussion-card"
    class="discussion-card-component"
    >

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
            :item="discussion"
            :hideFields="['spotlight','follow', 'share', 'contactProducer']"
            @responseAction="callbackAction"
            >
          </EditItemBtn>
        </div>
      </template> -->

      <!-- VIEW -->
      <b-card-body
        v-if="discussion"
        class="px-0"
        >

        <CardTitle
          :title="discussion.title"
          :dgfType="dgfType"
          :endpoint="putOperationId"
          :item="discussion"
          :hideFields="['spotlight','follow', 'share', 'contactProducer']"
          @responseAction="callbackAction"
        />

        <DialogRow
          :item="discussion"
          :customClass="'mb-5'"
        />

      </b-card-body>

      <!-- COMMENT -->
      <b-container
        class="my-5"
        v-if="discussion && isAuthenticated && comment"
        >
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
              v-model="commentContent"
              placeholder="comment discussion..."
            ></b-form-input>
          </b-form-group>

          <!-- CLOSE ISSUE -->
          <b-form-checkbox
            id="checkbox-close-discussion"
            v-model="closeDiscussion"
            name="checkbox-close-discussion"
            >
            {{ $t('basics.discussion', {list: $t('actions.close')}) }}
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

      <!-- EMPTY -->
      <div
        v-if="!discussion"
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
            :dataRaw="discussion"
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
import DialogRow from '@/components/blocks/DialogRow.vue'

// import EditItemBtn from '@/components/ux/EditItemBtn.vue'
import RawData from '@/components/ux/RawData.vue'

export default {
  name: 'DiscussionCard',
  components: {
    CardTitle,
    DialogRow,
    // EditItemBtn,
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
      updateEndpoints: APIoperations.updateEndpoints,
      commentEndpoints: APIoperations.commentEndpoints,
      dgfType: 'discussion',
      edit: false,
      comment: false,
      seeRaw: true,
      isLoading: false,
      defaultText: 'discussion is loading',
      putOperationId: 'comment_discussion',
      discussion: undefined,
      commentContent: '',
      closeDiscussion: false
    }
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
      this.isLoading = true
      const params = {
        id: this.discussionId,
        payload: {
          comment: this.commentComment,
          close: this.closeDiscussion
        }
      }
      const body = {}
      API._request(this.putOperationId, { params, body, needAuth: true }).then(
        results => {
          this.isLoading = false
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
