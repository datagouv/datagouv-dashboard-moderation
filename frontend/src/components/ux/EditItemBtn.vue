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

    <!-- EDIT -->
    <b-dropdown-item-button
      v-if="!hide.includes('openEdit')"
      @click="isAuthenticated && editItem('openEdit')"
      >
      <b-icon icon="pencil"></b-icon>
      {{$t('actions.edit')}}
    </b-dropdown-item-button>

    <!-- COMMENT -->
    <b-dropdown-item-button
      v-if="!hide.includes('comment')"
      @click="isAuthenticated && editItem('comment')"
      >
      <b-icon icon="chat"></b-icon>
      {{$t('actions.comment')}}
    </b-dropdown-item-button>

    <!-- SPOTLIGHT -->
    <b-dropdown-item-button
      v-if="!hide.includes('spotlight')"
      @click="isAuthenticated && editItem('spotlight')"
      >
      <b-icon icon="star"></b-icon>
      {{$t('actions.spotlight')}}
    </b-dropdown-item-button>

    <!-- CONTACT PRODUCER -->
    <b-dropdown-item-button
      v-if="!hide.includes('contactProducer')"
      @click="isAuthenticated && editItem('contactProducer')"
      >
      <b-icon icon="envelope"></b-icon>
      {{$t('actions.contactProducer')}}
    </b-dropdown-item-button>

    <!-- FOLLOW -->
    <b-dropdown-item-button
      v-if="!hide.includes('follow')"
      @click="isAuthenticated && editItem('follow')"
      >
      <b-icon icon="bell"></b-icon>
      {{$t('actions.follow')}}
    </b-dropdown-item-button>

    <!-- SHARE -->
    <b-dropdown-item-button
      v-if="!hide.includes('share')"
      @click="isAuthenticated && editItem('share')"
      >
      <b-icon icon="share"></b-icon>
      {{$t('actions.share')}}
    </b-dropdown-item-button>

    <!-- REPORT ISSUE -->
    <b-dropdown-item-button
      v-if="!hide.includes('reportIssue')"
      @click="isAuthenticated && editItem('reportIssue')"
      >
      <b-icon icon="exclamation-triangle"></b-icon>
      {{$t('actions.reportIssue')}}
    </b-dropdown-item-button>

    <b-dropdown-divider></b-dropdown-divider>

    <!-- DELETE ITEM -->
    <b-dropdown-item-button
      v-if="!hide.includes('delete')"
      @click="$bvModal.show('modal-delete-item')"
      >
      <b-icon icon="trash-fill"></b-icon>
      {{$t('actions.delete')}}
    </b-dropdown-item-button>

    <!-- DELETE MODAL -->
    <b-modal
      id="modal-delete-item"
      centered
      size="lg"
      header-bg-variant="warning"
      >
      <template v-slot:modal-header="{ close }">
        <h5 class="text-center">
          {{ $t('actions.delete') }}
        </h5>
        <b-button-close
          size="sm"
          @click="close()"
          >
        </b-button-close>
      </template>

      <template v-slot:default>
        <h4 class="text-center my-4">
          {{ $t('dialogs.sureDeleteItem') }}
        </h4>
        {{item.title}}
      </template>

      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button
          size="md"
          variant="warning"
          @click="isAuthenticated && deleteItem()"
          >
          <b-icon icon="trash-fill" aria-hidden="true"></b-icon>
          OK, {{ $t('actions.delete') }}
        </b-button>
        <b-button
          size="md"
          variant="secondary"
          @click="cancel()"
          >
          {{ $t('actions.cancel') }}
        </b-button>
      </template>

    </b-modal>

  </b-dropdown>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'EditItemBtn',
  props: [
    'endpoint',
    'item',
    'hideFields'
  ],
  data () {
    return {
      hide: []
    }
  },
  created () {
    // console.log('-C- EditItemBtn > created ... ')
    if (Array.isArray(this.hideFields)) { this.hide = this.hideFields }
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
    editItem (category) {
      // TO DO
      // console.log('-C- EditItemBtn > editItem > category : ', category)
      // console.log('-C- EditItemBtn > editItem > this.item : ', this.item)
      const respData = {
        category: category,
        msg: `response action : ${this.endpoint}-${category}`
      }
      this.emitResponse(respData)
    },
    deleteItem () {
      // TO DO
      // console.log('-C- EditItemBtn > deleteItem > this.item : ', this.item)
      const respData = { msg: `response action : ${this.endpoint}-delete` }
      this.emitResponse(respData)
    }
  }
}

</script>
