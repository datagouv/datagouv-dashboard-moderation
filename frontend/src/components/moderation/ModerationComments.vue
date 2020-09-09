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
          <b-form
            @submit="onSubmit"
            @reset="onReset"
            class="mb-5"
            v-if="show"
            >
            <b-form-textarea
              id="textarea"
              v-model="commentContent"
              :placeholder="$t('moderation.addComment')"
              rows="3"
              max-rows="6"
              class="mb-2"
              >
            </b-form-textarea>
            <b-button block type="submit" variant="success">
              <b-icon icon="check2" aria-hidden="true"></b-icon>
              {{$t('actions.comment')}}
            </b-button>
            <b-button block type="reset" variant="danger">
              <b-icon icon="x" aria-hidden="true"></b-icon>
              {{$t('actions.reset')}}
            </b-button>
          </b-form>
        </b-collapse>
      </b-col>
    </b-row>

    <!-- COMMENTS -->
    <b-row
      v-for="(comment, index) in comments"
      :key="index"
      :align-h="comment.user_id === userId ? 'center' : 'start'"
      >
      <b-col cols="10">
        <b-card
          :class="`mb-3 ${comment.user_id === userId ? 'bg-info text-white' : 'bg-light'}`"
          >
          <b-card-body>
            <b-card-text class="text-left">
              <b-row>
                <b-col cols="2">
                  <b-icon
                    icon="three-dots"
                    aria-hidden="true"
                    :class="`h3 ${comment.user_id === userId ? 'text-white' : ''}`"
                    >
                  </b-icon>
                </b-col>
                <b-col>
                  {{ comment.content }}
                </b-col>
              </b-row>
            </b-card-text>
          </b-card-body>
          <hr :class="`${comment.user_id === userId ? 'bg-white' : ''}`">
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
    'comments'
  ],
  data () {
    return {
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
    async addModerationComment (comment) {
      console.log('-C- ModerationComments > addModerationComment > comment : ', comment)
    },
    onSubmit (evt) {
      evt.preventDefault()
      alert(JSON.stringify(this.commentContent))
    },
    onReset (evt) {
      evt.preventDefault()
      // Reset our form values
      this.commentContent = ''
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    }
  }
}
</script>
