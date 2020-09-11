<template>
  <div>
    <b-form
      inline
      v-if="!isLoading"
      class="justify-content-center">
      <b-form-checkbox
        v-model="item[field]"
        v-if="isAuthenticated"
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
        variant="link"
        :value="item[field]"
        >
        <b-icon
          :icon="getIcon(field)"
          :variant="getColor(field)"
          >
        </b-icon>
      </b-form-checkbox>
    </b-form>
    <div v-if="isLoading" class="pt-1">
      <b-spinner small label="loading"></b-spinner>
    </div>
  </div>
</template>

<script>

import { mapState, mapGetters } from 'vuex'

export default {
  name: 'ModerationCheckbox',
  props: [
    'dgfType',
    'item',
    'field'
  ],
  data () {
    return {
      isLoading: false,
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
    async updateModeration (item, field, evt) {
      this.isLoading = true
      const updatedItem = await this.$MODERATIONcli.updateModeration(this.dgfType, item, field, evt)
      console.log('-C- ModerationCheckbox > updateModeration > updatedItem : ', updatedItem)
      const categ = `update_${field}`
      const respData = {
        category: categ,
        item: updatedItem,
        msg: `response action : ${this.dgfType}-${categ}`
      }
      this.emitResponse(respData)
      this.isLoading = false
    },
    getColor (field) {
      const fieldIcons = this.buttons[field]
      const bool = this.item[field]
      const index = Boolean(bool)
      const color = index ? fieldIcons.colors[1] : fieldIcons.colors[0]
      return color
    },
    getIcon (field) {
      const fieldIcons = this.buttons[field]
      const bool = this.item[field]
      const index = Boolean(bool)
      const icon = index ? fieldIcons.icons[1] : fieldIcons.icons[0]
      return icon
    }
  }
}
</script>
