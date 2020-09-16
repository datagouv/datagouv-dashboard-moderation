<template>
  <b-dropdown
    right
    variant="link"
    no-caret
    size="sm"
    class="m-2"
    :disabled="!isAuthenticated || itemsSelection.length === 0"
    >
    <!-- :variant="!isAuthenticated || itemsSelection.length === 0 ? 'outline-secondary' : 'warning'" -->
    <!-- :text="$t('actions.actions')" -->
        <!-- :pill="itemsSelection.length > 0 " -->

    <template v-slot:button-content >
      <b-button
        id="popover-moderation-edit"
        pill
        :variant="!isAuthenticated || itemsSelection.length === 0 ? 'outline-secondary' : 'primary'"
        class="btn-circle btn-circle-sm"
        >
        <b-icon icon="three-dots-vertical"></b-icon>
      </b-button>
      <b-popover
        target="popover-moderation-edit"
        variant="dark"
        placement="left"
        triggers="hover">
        {{$t('actions.actionsGroupText')}}
      </b-popover>
    </template>

    <b-dropdown-text class="text-center text-muted">
      {{$t('actions.actionsGroupText')}}
    </b-dropdown-text>

    <b-dropdown-divider></b-dropdown-divider>

    <!-- MARK READ -->
    <b-dropdown-item-button
      :disabled="itemsSelection.length === 0"
      @click="isAuthenticated && markSelection('read', true)"
      >
      <b-icon icon="check2-square" aria-hidden="true"></b-icon>
      {{$t('moderation.markAsRead')}}
    </b-dropdown-item-button>

    <!-- MARK SUSPECT -->
    <b-dropdown-item-button
      :disabled="itemsSelection.length === 0"
      @click="isAuthenticated && markSelection('suspicious', true)"
      >
      <b-icon icon="exclamation-triangle-fill" aria-hidden="true"></b-icon>
      {{$t('moderation.markAsSuspect')}}
    </b-dropdown-item-button>

    <b-dropdown-divider
      v-if="isDeleteOperation"
      >
    </b-dropdown-divider>

    <!-- DELETE BATCH -->
    <b-dropdown-item-button
      v-if="isDeleteOperation"
      @click="$bvModal.show('modal-delete')"
      :disabled="itemsSelection.length === 0"
      >
      <b-icon icon="trash-fill" aria-hidden="true"></b-icon>
      {{$t('actions.delete')}}
    </b-dropdown-item-button>

    <!-- DELETE MODAL -->
    <b-modal
      id="modal-delete"
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
          {{ $t('dialogs.sureDelete') }}
        </h4>
        <b-list-group class="mb-5 mx-5">
          <b-list-group-item
            v-for="item in itemsSelection"
            :key="item"
            >
            {{dgfType}} : {{itemField(item)}}
          </b-list-group-item>
        </b-list-group>
      </template>

      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button
          size="md"
          variant="warning"
          @click="isAuthenticated && deleteSelection()"
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
  name: 'ModerationActionsBtn',
  props: [
    'dgfType',
    'endpoint',
    'itemsSelection',
    'itemsList'
  ],
  data () {
    return {
      deleteEndpoints: APIoperations.deleteEndpoints
    }
  },
  computed: {
    ...mapState({
      log: (state) => state.log
    }),
    ...mapGetters({
      isAuthenticated: 'oauth/isAuthenticated'
    }),
    isDeleteOperation () {
      return this.deleteEndpoints[this.dgfType]
    },
    getItemTitleField () {
      let field = 'title'
      switch (this.dgfType) {
        case 'user':
          field = 'last_name'
          break
        case 'organization':
          field = 'name'
          break
      }
      return field
    }
  },
  methods: {
    itemField (itemId) {
      const item = this.itemsList.find(el => el.id === itemId)
      const field = this.getItemTitleField
      return item[field]
    },
    emitResponse (data) {
      this.$emit('responseAction', data)
    },
    async updateModeration (item, field, evt) {
      console.log('-C- ModerationActionsBtn > updateModeration > field : ', field)
      await this.$MODERATIONcli.updateModeration(this.dgfType, item, field, evt)
    },
    async markSelection (field, val) {
      console.log('-C- ModerationActionsBtn > markSelection > field : ', field)
      console.log('-C- ModerationActionsBtn > markSelection > this.itemsSelection : ', this.itemsSelection)
      for (const itemId of this.itemsSelection) {
        const item = this.itemsList.find(it => it.id === itemId)
        await this.updateModeration(item, field, val)
      }
      this.$emit('reloadItems', this.itemsSelection)
    },
    async deleteSelection () {
      // TO DO
      const API = this.$APIcli
      console.log('-C- ModerationActionsBtn > deleteSelection > API :', API)
      console.log('-C- ModerationActionsBtn > deleteItem > this.dgfType : ', this.dgfType)
      const operation = this.deleteEndpoints[this.dgfType]
      if (!operation) return
      console.log('-C- ModerationActionsBtn > deleteItem > operation : ', operation)
      console.log('-C- ModerationActionsBtn > deleteSelection > this.itemsSelection : ', this.itemsSelection)
      const paramsSelection = this.itemsSelection.map(itemId => {
        const params = {}
        operation.params.forEach(opParam => {
          params[opParam.paramKey] = itemId
        })
        return params
      })
      console.log('-C- ModerationActionsBtn > deleteSelection > paramsSelection : ', paramsSelection)
      // const body = {}
      // API._request(this.putOperationId, { params, body, needAuth: true }).then(
      //   results => {
      //     this.isLoading = false
      //
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
