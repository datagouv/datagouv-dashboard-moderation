<template>
  <div>

    <!-- ADD COMMENT FORM -->
    <b-row
      v-if="isAuthenticated"
      align-h="center"
      >
      <b-col cols="10">

        <b-button
          block
          :class="`mt-2 mb-3 ${formCommentVisible ? null : 'collapsed'}`"
           aria-controls="collapse-add-comment"
          @click="formCommentVisible = !formCommentVisible"
          >
          <b-icon
            :icon="formCommentVisible ? 'dash' : 'plus'"
            >
          </b-icon>
          {{$t('moderation.addComment')}}
        </b-button>

        <b-collapse
          id="collapse-add-comment"
          v-model="formCommentVisible"
          >

          <div v-if="isLoading" class="pt-4 pb-5">
            <custom-spinner :size="1"/>
          </div>

          <b-form
            @submit="submitComment"
            @reset="resetTextArea"
            class="mb-5"
            v-if="show && !isLoading"
            >
            <b-form-textarea
              id="textarea"
              v-model="commentContent"
              :placeholder="$t('moderation.enterComment')"
              rows="5"
              max-rows="10"
              class="mb-2"
              >
            </b-form-textarea>

            <b-form-row class="mt-3">
              <b-col cols="6">
                <b-button block class="" type="reset" variant="danger">
                  <b-icon icon="x" aria-hidden="true"></b-icon>
                  {{$t('actions.reset')}}
                </b-button>
              </b-col>
              <b-col>
                <b-button block class="" type="submit" variant="success">
                  <b-icon icon="check2" aria-hidden="true"></b-icon>
                  {{$t('actions.comment')}}
                </b-button>
              </b-col>
            </b-form-row>

          </b-form>

        </b-collapse>
      </b-col>
    </b-row>

    <!-- COMMENTS -->
    <div v-if="isAuthenticated">
      <b-row
        v-for="(comment, index) in itemComments"
        :key="index"
        :align-h="comment.author.dgf_id === userId ? 'end' : 'center'"
        >
        <b-col cols="10">
          <b-card
            no-body
            :class="`px-3 pb-4 pt-0 mb-3 mt-0 ${comment.author.dgf_id  === userId ? 'bg-info text-white' : 'bg-light text-grey'}`"
            >
            <b-row class="mt-0 p-1" align-h="end">
              <b-button
                size="sm"
                variant="link"
                @click="deleteComment(comment.id)"
                >
                <b-icon
                  icon="x"
                  :variant="comment.author.dgf_id  === userId ? 'white' : ''"
                >
                </b-icon>
              </b-button>
            </b-row>

            <b-card-body class="py-2 mb-2" v-if="isCommentLoading === comment.id">
              <custom-spinner :size="1"/>
            </b-card-body>

            <div v-else>
              <b-card-body class="py-0">
                <b-card-text class="text-left">
                  <b-row>
                    <b-col cols="2">
                      <b-icon
                        icon="three-dots"
                        aria-hidden="true"
                        :class="`h3 ${comment.author.dgf_id  === userId ? 'text-white' : 'text-grey'}`"
                        >
                      </b-icon>
                    </b-col>
                    <b-col>
                      <vue-simple-markdown
                        :source="comment.content "
                        >
                      </vue-simple-markdown>
                    </b-col>
                  </b-row>
                </b-card-text>
              </b-card-body>
              <hr :class="`${comment.author.dgf_id  === userId ? 'bg-white' : 'bg-white'}`">
              <b-card-text class="text-center">
                <b-row no-gutters>
                  <b-col>
                    {{$t('moderation.author')}} :<br>
                    {{ comment.author.first_name }} {{ comment.author.last_name }}
                  </b-col>
                  <b-col>
                    {{$t('moderation.date')}} :<br>
                    {{ comment.written_at }}
                  </b-col>
                </b-row>
              </b-card-text>
            </div>

          </b-card>
        </b-col>
      </b-row>
    </div>

  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

// import { APIresponses } from '@/config/APIoperations.js'

export default {
  name: 'ModerationComments',
  props: [
    'dgfType',
    'item'
  ],
  data () {
    return {
      isLoading: false,
      isCommentLoading: '',
      commentContent: '',
      itemComments: [],
      show: true,
      formCommentVisible: false
    }
  },
  created () {
    this.itemComments = this.item.comments ? this.item.comments : []
  },
  watch: {
    item (next) {
      this.itemComments = next.comments && next.comments.reverse()
    }
  },
  computed: {
    ...mapState({
      log: (state) => state.global.log,
      userData: (state) => state.user.user
    }),
    ...mapGetters({
      isAuthenticated: 'oauth/isAuthenticated'
    }),
    userId () {
      return this.userData && this.userData.id
    }
  },
  methods: {
    emitResponse (data) {
      this.$emit('responseAction', data)
    },
    async submitComment (evt) {
      evt.preventDefault()
      console.log('-C- ModerationComments > submitComment > this.item : ', this.item)
      this.isLoading = true
      if (this.commentContent.length > 0) {
        const comment = {
          author: {
            dgf_id: this.userId,
            first_name: this.userData.first_name,
            last_name: this.userData.last_name
          },
          content: this.commentContent
        }
        console.log('-C- ModerationComments > submitComment > comment : ', comment)
        const updatedItem = await this.$MODERATIONcli.addComment(this.item.id, comment)
        console.log('-C- ModerationComments > submitComment > updatedItem : ', updatedItem)
        const moderationData = await updatedItem.json()
        console.log('-C- ModerationComments > submitComment > moderationData : ', moderationData)
        // const categ = 'update_comments'
        // const respData = {
        //   category: categ,
        //   item: updatedItem,
        //   msg: `response action : ${this.dgfType}-${categ}`
        // }
        // this.emitResponse(respData)
        this.$makeToast(updatedItem, this.dgfType, 'POST', this.dgfType, 'comments')
        this.itemComments.unshift(moderationData)
      }
      this.resetTextArea(evt)
    },
    resetTextArea (evt) {
      evt.preventDefault()
      // Reset our form values
      this.commentContent = ''
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
      this.isLoading = false
    },
    async deleteComment (commentId) {
      this.isCommentLoading = commentId
      const deletedItem = await this.$MODERATIONcli.deleteComment(this.item.id, commentId)
      console.log('-C- ModerationComments > deleteComment > deletedItem : ', deletedItem)
      this.$makeToast(deletedItem, this.dgfType, 'DELETE', this.dgfType, 'comments')
      this.itemComments = this.itemComments.filter(comment => comment.id !== commentId)
      this.isCommentLoading = ''
    }
  }
}
</script>
