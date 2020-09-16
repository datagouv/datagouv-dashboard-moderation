<template>
  <b-dropdown
    right
    variant="link"
    no-caret
    size="sm"
    >
    <!-- :disabled="!isAuthenticated" -->

    <template v-slot:button-content >
      <b-button
        id="popover-btn-object-actions"
        class="btn-circle btn-circle-sm"
        variant="primary"
        >
        <!-- :variant="!isAuthenticated ? 'outline-secondary' : 'primary'" -->
        <b-icon icon="three-dots-vertical"></b-icon>
      </b-button>
      <b-popover
        target="popover-btn-object-actions"
        variant="dark"
        :placement="`left`"
        triggers="hover">
        {{$t('actions.actionsItem')}}
      </b-popover>
    </template>

    <!-- EDIT -->
    <b-dropdown-item-button
      v-if="isAuthenticated && !hide.includes('openEdit') && isUpdateOperation"
      @click="isAuthenticated && editItem('openEdit')"
      >
      <b-icon icon="pencil"></b-icon>
      {{$t('actions.edit')}}
    </b-dropdown-item-button>

    <!-- COMMENT -->
    <b-dropdown-item-button
      v-if="!hide.includes('comment') && isCommentOperation"
      @click="isAuthenticated && editItem('comment')"
      >
      <b-icon icon="chat"></b-icon>
      {{$t('actions.comment')}}
    </b-dropdown-item-button>

    <!-- SPOTLIGHT -->
    <b-dropdown-item-button
      v-if="!hide.includes('spotlight')"
      disabled
      @click="isAuthenticated && editItem('spotlight')"
      >
      <b-icon icon="star"></b-icon>
      {{$t('actions.spotlight')}}
    </b-dropdown-item-button>

    <!-- CONTACT PRODUCER -->
    <b-dropdown-item-button
      v-if="!hide.includes('contactProducer')"
      disabled
      @click="isAuthenticated && editItem('contactProducer')"
      >
      <b-icon icon="envelope"></b-icon>
      {{$t('actions.contactProducer')}}
    </b-dropdown-item-button>

    <!-- FOLLOW -->
    <b-dropdown-item-button
      v-if="!hide.includes('follow')"
      disabled
      @click="isAuthenticated && editItem('follow')"
      >
      <b-icon icon="bell"></b-icon>
      {{$t('actions.follow')}}
    </b-dropdown-item-button>

    <!-- SHARE -->
    <b-dropdown-item-button
      v-if="!hide.includes('share')"
      disabled
      @click="isAuthenticated && editItem('share')"
      >
      <b-icon icon="box-arrow-up-right"></b-icon>
      {{$t('actions.share')}}
    </b-dropdown-item-button>

    <!-- REPORT ISSUE -->
    <b-dropdown-item-button
      v-if="!hide.includes('reportIssue')"
      disabled
      @click="isAuthenticated && editItem('reportIssue')"
      >
      <b-icon icon="exclamation-triangle"></b-icon>
      {{$t('actions.reportIssue')}}
    </b-dropdown-item-button>

    <b-dropdown-divider
      v-if="isAuthenticated && isDeleteOperation"
      >
    </b-dropdown-divider>

    <!-- DELETE ITEM -->
    <b-dropdown-item-button
      v-if="isAuthenticated && !hide.includes('delete') && isDeleteOperation"
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
        <p class="text-center">
          {{dgfType}} : {{getItemTitle}}
        </p>
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
          <b-icon icon="x" aria-hidden="true"></b-icon>
          {{ $t('actions.cancel') }}
        </b-button>
      </template>

    </b-modal>

  </b-dropdown>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import { APIoperations } from '@/config/APIoperations.js'

export default {
  name: 'EditItemBtn',
  props: [
    'dgfType',
    'endpoint',
    'item',
    'hideFields'
  ],
  data () {
    return {
      updateEndpoints: APIoperations.updateEndpoints,
      commentEndpoints: APIoperations.commentEndpoints,
      deleteEndpoints: APIoperations.deleteEndpoints,
      hide: []
    }
  },
  created () {
    if (Array.isArray(this.hideFields)) { this.hide = this.hideFields }
  },
  computed: {
    ...mapState({
      log: (state) => state.log
    }),
    ...mapGetters({
      isAuthenticated: 'oauth/isAuthenticated'
    }),
    isUpdateOperation () {
      return this.updateEndpoints[this.dgfType]
    },
    isCommentOperation () {
      return this.commentEndpoints[this.dgfType]
    },
    isDeleteOperation () {
      return this.deleteEndpoints[this.dgfType]
    },
    getItemTitle () {
      let field = 'title'
      switch (this.dgfType) {
        case 'user':
          field = 'last_name'
          break
        case 'organization':
          field = 'name'
          break
      }
      return this.item[field]
    }
  },
  methods: {
    emitResponse (data) {
      this.$emit('responseAction', data)
    },
    editItem (category) {
      // TO DO
      const respData = {
        category: category,
        msg: `response action : ${this.endpoint}-${category}`
      }
      this.emitResponse(respData)
    },
    deleteItem () {
      // TO DO
      const API = this.$APIcli
      console.log('-C- EditItemBtn > deleteItem > API :', API)
      console.log('-C- EditItemBtn > deleteItem > this.dgfType : ', this.dgfType)
      const operation = this.isDeleteOperation
      console.log('-C- EditItemBtn > deleteItem > operation : ', operation)
      if (!operation) return
      console.log('-C- EditItemBtn > deleteItem > this.item : ', this.item)
      const params = {}
      operation.params.forEach(opParam => {
        params[opParam.paramKey] = this.item[opParam.itemKey]
        return params
      })
      console.log('-C- EditItemBtn > deleteItem > params : ', params)
      // const body = {}
      // API._request(this.putOperationId, { params, body, needAuth: true }).then(
      //   results => {
      //     this.isLoading = false
      //   },
      //   reason => {
      //     console.error(`-C- EditItemBtn > failed on api call: ${reason}`)
      //     this.isLoading = false
      //   }
      // )

      const respData = { msg: `response action : ${this.endpoint}-delete` }
      this.emitResponse(respData)
    }
  }
}

</script>
