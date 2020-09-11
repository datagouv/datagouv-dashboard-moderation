<template>
  <b-dropdown
    dropleft
    variant="link"
    no-caret
    size="sm"
    :disabled="!isAuthenticated"
    >

    <template v-slot:button-content >
      <b-button
        :variant="!isAuthenticated ? 'outline-secondary' : 'primary'"
        class="btn-circle btn-circle-sm"
        >
        <b-icon icon="three-dots-vertical"></b-icon>
      </b-button>
    </template>

    <!-- MARK READ -->
    <b-dropdown-item-button
      @click="isAuthenticated && markItem('read')"
      >
      <b-icon icon="check2-square" aria-hidden="true"></b-icon>
      {{$t('moderation.markAsRead')}}
    </b-dropdown-item-button>

    <!-- MARK SUSPECT -->
    <b-dropdown-item-button
      @click="isAuthenticated && markItem('suspect')"
      >
      <b-icon icon="exclamation-triangle-fill" aria-hidden="true"></b-icon>
      {{$t('moderation.markAsSuspect')}}
    </b-dropdown-item-button>

  </b-dropdown>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'ModerationItemBtn',
  props: [
    'endpoint',
    'item'
  ],
  data () {
    return {}
  },
  computed: {
    ...mapState({
      log: (state) => state.log
    }),
    ...mapGetters({
      isAuthenticated: 'oauth/isAuthenticated'
    })
  },
  methods: {
    emitResponse (data) {
      this.$emit('responseAction', data)
    },
    markItem (category) {
      // TO DO
      
      
      const respData = { msg: `response action : ${this.endpoint}-${category}` }
      this.emitResponse(respData)
    }
  }
}

</script>
