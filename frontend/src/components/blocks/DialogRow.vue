<template>
  <b-row
    :class="customClass"
    >
    <b-col
      md="10"
      offset-md="2"
      >

      <!-- DIALOG -->
      <b-row
        v-for="(dialog, index) in dialogs"
        :key="index"
        :align-h="dialog.posted_by.id === userId ? 'end' : 'start'"
        >
        <b-col cols="10">
          <b-card
            :class="`mb-3 ${dialog.posted_by.id === userId ? 'bg-info text-white' : 'bg-light'}`"
            >
            <b-card-body>
              <b-card-text class="text-left">
                <b-row>
                  <b-col cols="2">
                    <b-icon
                      icon="three-dots"
                      aria-hidden="true"
                      :class="`h3 ${dialog.posted_by.id === userId ? 'text-white' : ''}`"
                      >
                    </b-icon>
                  </b-col>
                  <b-col>
                    {{ dialog.content }}
                  </b-col>
                </b-row>
              </b-card-text>
            </b-card-body>
            <hr :class="`${dialog.posted_by.id === userId ? 'bg-white' : ''}`">
            <b-card-text class="text-center">
              <b-row no-gutters>
                <b-col>
                  {{$t('moderation.author')}} :<br>
                  {{ dialog.posted_by.first_name }}
                  {{ dialog.posted_by.last_name }}
                </b-col>
                <b-col>
                  {{$t('moderation.date')}} :<br>
                  {{ dialog.posted_on }}
                </b-col>
              </b-row>
            </b-card-text>

          </b-card>
        </b-col>
      </b-row>

    </b-col>
  </b-row>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'DialogRow',
  props: [
    'item',
    'customClass'
  ],
  data () {
    return {
      dialogs: []
    }
  },
  created () {
    if (this.item && this.item.discussion) {
      this.dialogs = this.item.discussion.reverse()
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
  }
}
</script>
