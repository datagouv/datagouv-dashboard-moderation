<template>
  <div>

    <!-- ADD COMMENT FORM -->
    <b-row align-h="center">
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
            <b-spinner label="loading"></b-spinner>
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
    <b-row
      v-for="(comment, index) in item.comments"
      :key="index"
      :align-h="comment.user_id === userId ? 'center' : 'start'"
      >
      <b-col cols="10">
        <b-card
          no-body
          :class="`px-3 pb-4 pt-0 mb-3 mt-0 ${comment.user_id === userId ? 'bg-info text-white' : 'bg-light text-grey'}`"
          >
          <b-row class="mt-0 p-1" align-h="end">
            <b-button
              size="sm"
              variant="link"
              @click="deleteComment(comment.id)"
              >
              <b-icon
                icon="x"
                :variant="comment.user_id === userId ? 'white' : ''"
              >
              </b-icon>
            </b-button>
          </b-row>

          <b-card-body class="py-2 mb-2" v-if="isCommentLoading === comment.id">
            <b-spinner label="loading"></b-spinner>
          </b-card-body>

          <div v-else>
            <b-card-body class="py-0">
              <b-card-text class="text-left">
                <b-row>
                  <b-col cols="2">
                    <b-icon
                      icon="three-dots"
                      aria-hidden="true"
                      :class="`h3 ${comment.user_id === userId ? 'text-white' : 'text-grey'}`"
                      >
                    </b-icon>
                  </b-col>
                  <b-col>
                    <p>
                      {{ comment.content }}
                    </p>
                  </b-col>
                </b-row>
              </b-card-text>
            </b-card-body>
            <hr :class="`${comment.user_id === userId ? 'bg-white' : 'bg-white'}`">
            <b-card-text class="text-center">
              <b-row no-gutters>
                <b-col>
                  {{$t('moderation.author')}} :<br>
                  {{ comment.author }}
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
</template>

<script>
import { mapState } from 'vuex'

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
      show: true,
      formCommentVisible: false
    }
  },
  computed: {
    ...mapState({
      log: (state) => state.global.log,
      userData: (state) => state.user.user
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
          author: `${this.userData.first_name} ${this.userData.last_name}`,
          written_at: Date.now(),
          content: this.commentContent
        }
        console.log('-C- ModerationComments > submitComment > comment : ', comment)
        const updatedItem = await this.$MODERATIONcli.addComment(this.item.id, comment)
        console.log('-C- ModerationComments > submitComment > updatedItem : ', updatedItem)
        const categ = 'update_comments'
        const respData = {
          category: categ,
          item: updatedItem,
          msg: `response action : ${this.dgfType}-${categ}`
        }
        this.makeToast(updatedItem)
        this.emitResponse(respData)
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
      this.isCommentLoading = ''
    },
    makeToast (updatedItem) {
      const h = this.$createElement
      const variant = updatedItem.status !== 200 ? 'danger' : 'success'
      const title = updatedItem.status !== 200 ? 'error' : 'success'
      const msg = updatedItem.status !== 200 ? this.$t('toastsModeration.errorTxt', { code: updatedItem.status }) : 'ok msg'

      const vNodesTitle = h(
        'div',
        { class: ['d-flex', 'flex-grow-1', 'align-items-baseline', 'ml-2'] },
        [
          h('strong', { class: ['mr-2', 'text-center'] }, this.$t(`toastsModeration.${title}`))
        ]
      )
      const vNodesMsg = h(
        'p',
        { class: ['text-center', 'my-2'] },
        [
          h('strong', `PUT ${this.dgfType} / comment`),
          h('br'),
          h('strong', msg)
        ]
      )

      this.$bvToast.toast([vNodesMsg], {
        title: [vNodesTitle],
        variant: variant,
        solid: true
      })
    }
  }
}
</script>
