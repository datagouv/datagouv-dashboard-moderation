<template>
  <b-dropdown
    right
    block
    size="sm"
    :variant="isAuthenticated ? 'outline-primary' : 'outline-secondary'"
    :disabled="!isAuthenticated"
    :text="$t('actions.actions')"
    class="m-2"
    >

    <b-dropdown-item-button
      :disabled="itemsSelection.size === 0"
      @click="isAuthenticated && markSelection('read')"
      >
      <b-icon icon="check2-square" aria-hidden="true"></b-icon>
      {{$t('moderation.markAsRead')}}
    </b-dropdown-item-button>
    <b-dropdown-item-button
      :disabled="itemsSelection.size === 0"
      @click="isAuthenticated && markSelection('suspect')"
      >
      <b-icon icon="exclamation-triangle-fill" aria-hidden="true"></b-icon>
      {{$t('moderation.markAsSuspect')}}
    </b-dropdown-item-button>
    <b-dropdown-divider></b-dropdown-divider>
    <b-dropdown-item-button
      :disabled="itemsSelection.size === 0"
      @click="isAuthenticated && deleteSelection()"
      >
      <b-icon icon="trash-fill" aria-hidden="true"></b-icon>
      {{$t('actions.delete')}}
    </b-dropdown-item-button>

  </b-dropdown>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'ModerationActionsBtn',
  props: [
    'endpoint',
    'itemsSelection'
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
    markSelection (category) {
      // TO DO
      console.log('-C- ModerationActionsBtn > markSelection > category : ', category)
      console.log('-C- ModerationActionsBtn > markSelection > this.itemsSelection : ', this.itemsSelection)
      const respData = { msg: `response action : ${this.endpoint}-${category}` }
      this.emitResponse(respData)
    },
    deleteSelection () {
      // TO DO
      console.log('-C- ModerationActionsBtn > deleteSelection > this.itemsSelection : ', this.itemsSelection)
      const respData = { msg: `response action : ${this.endpoint}-delete` }
      this.emitResponse(respData)
    }
  }
}

</script>
