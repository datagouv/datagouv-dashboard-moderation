<template>
  <div>

    <!-- ADD COMMENT FORM -->
    <b-row align-h="center">
      <b-col cols="8">
        <b-button block v-b-toggle="'collapse-add-comment'" class="my-3">
          <b-icon icon="plus"></b-icon>
          {{$t('moderation.addComment')}}
        </b-button>

        <b-collapse id="collapse-add-comment">
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
      :align-h="comment.author === 'abc' ? 'end' : 'start'"
      >
      <b-col cols="8">
        <b-card
          :class="`mb-3 ${comment.author === 'abc' ? 'bg-info text-white' : 'light'}`"
          >
          <b-row no-gutters>
            <b-col md="3">
              <b-card-text class="text-left">
                <p>
                  {{$t('moderation.author')}} : {{ comment.author }}
                </p>
                <p>
                  {{$t('moderation.date')}} : {{ comment.written_at }}
                </p>
              </b-card-text>
            </b-col>
            <b-col md="9">
              <b-card-body>
                <b-card-text class="text-left">
                  {{ comment.content }}
                </b-card-text>
              </b-card-body>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

  </div>
</template>

<script>
export default {
  name: 'ModerationComments',
  props: [
    'comments'
  ],
  data () {
    return {
      commentContent: '',
      show: true
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
