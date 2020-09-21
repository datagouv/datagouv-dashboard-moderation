<template>
  <div>
    <b-form
      inline
      v-if="!isLoading"
      class="justify-content-center">

      <!-- <code>{{itemModerationValue}}</code> -->
      <!-- {{disabled}} -->

      <b-form-checkbox
        v-if="isAuthenticated && !disabled"
        v-model="itemModerationValue"
        button
        button-variant="link"
        @change="updateModeration(item, field, $event)"
        >
        <b-icon
          :icon="getIcon(field)"
          :variant="getColor(field)"
          >
        </b-icon>
      </b-form-checkbox>

      <b-form-checkbox
        v-else
        disabled
        button
        button-variant="link"
        :value="item[field]"
        >
        <b-icon
          :icon="getIcon(field)"
          :variant="getColor(field)"
          >
        </b-icon>
      </b-form-checkbox>
    </b-form>
    <div v-if="isLoading"
      :class="spinnerClass ? 'pt-2' : ''"
      >
      <custom-spinner :size="1.5"/>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

// import { APIresponses } from '@/config/APIoperations.js'
import { APIoperations } from '@/config/APIoperations.js'

export default {
  name: 'ModerationCheckbox',
  props: [
    'dgfType',
    'item',
    'field',
    'spinnerClass',
    'disabled'
  ],
  data () {
    return {
      isLoading: false,
      itemModerationValue: undefined,
      deleteEndpoints: APIoperations.deleteEndpoints,
      buttons: {
        read: {
          icons: [
            'circle', 'check2-circle'
          ],
          colors: [
            'outline-secondary', 'success'
          ]
        },
        suspicious: {
          icons: [
            'triangle', 'exclamation-triangle-fill'
          ],
          colors: [
            'outline-secondary', 'warning'
          ]
        },
        deleted: {
          icons: [
            'octagon', 'x-octagon-fill'
          ],
          colors: [
            'outline-secondary', 'danger'
          ]
        },
        comments: {
          icons: [
            'chat-left', 'chat-left-text'
          ],
          colors: [
            'outline-info', 'info'
          ]
        }
      }
    }
  },
  created () {
    this.itemModerationValue = this.item[this.field]
  },
  watch: {
    item (next) {
      this.itemModerationValue = next[this.field]
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
    }
  },
  methods: {
    async updateModeration (item, field, evt) {
      this.isLoading = true

      if (field === 'deleted' && evt) {
        // TO DO : finish/apply delete action in datagouv
        // const API = this.$APIcli
        const operation = this.isDeleteOperation
        const params = {}
        operation.params.forEach(opParam => {
          params[opParam.paramKey] = this.item[opParam.itemKey]
          return params
        })
      }
      const updatedItem = await this.$MODERATIONcli.updateModeration(this.dgfType, item, field, evt)
      this.$makeToast(updatedItem, this.item.id, 'PUT', this.dgfType, this.field)
      this.itemModerationValue = evt
      this.$emit('reloadItem', item)
      this.isLoading = false
    },
    getColor (field) {
      const fieldIcons = this.buttons[field]
      const bool = this.itemModerationValue
      const index = Boolean(bool)
      const color = index ? fieldIcons.colors[1] : fieldIcons.colors[0]
      return color
    },
    getIcon (field) {
      const fieldIcons = this.buttons[field]
      const bool = this.itemModerationValue
      const index = Boolean(bool)
      const icon = index ? fieldIcons.icons[1] : fieldIcons.icons[0]
      return icon
    }
  }
}
</script>
