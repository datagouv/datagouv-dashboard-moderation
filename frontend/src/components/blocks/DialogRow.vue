<template>
  <div>

    <!-- COMMENTS -->
    <b-row
      v-for="(discussionItem, index) in item.discussion"
      :key="index"
      :align-h="discussionItem.posted_by.id === userId ? 'end' : 'center'"
      >
      <b-col cols="10">
        <b-card
          :class="`mb-3 ${discussionItem.posted_by.id === userId ? 'bg-info text-white' : 'bg-light'}`"
          >
          <b-card-body>
            <b-card-text class="text-left">
              <b-row>
                <b-col cols="2">
                  <b-icon
                    icon="three-dots"
                    aria-hidden="true"
                    :class="`h3 ${discussionItem.posted_by.id === userId ? 'text-white' : ''}`"
                    >
                  </b-icon>
                </b-col>
                <b-col>
                  {{ discussionItem.content }}
                </b-col>
              </b-row>
            </b-card-text>
          </b-card-body>
          <hr :class="`${discussionItem.posted_by.id === userId ? 'bg-white' : ''}`">
          <b-card-text class="text-center">
            <b-row no-gutters>
              <b-col>
                {{$t('moderation.author')}} :<br>
                {{ discussionItem.posted_by.first_name }}
                {{ discussionItem.posted_by.last_name }}
              </b-col>
              <b-col>
                {{$t('moderation.date')}} :<br>
                {{ discussionItem.posted_on }}
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
  name: 'DialogRow',
  props: [
    'item'
  ],
  computed: {
    ...mapState({
      log: (state) => state.global.log,
      userData: (state) => state.user.user
    }),
    userId () {
      return this.userData && this.userData.id
    }
  }
}
</script>
