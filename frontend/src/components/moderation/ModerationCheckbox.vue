<template>
  <div>
    <b-form
      inline
      v-if="!isLoading"
      class="justify-content-center">

      <!-- <code>{{itemModerationValue}}</code> -->

      <b-form-checkbox
        v-model="itemModerationValue"
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
    <div v-if="isLoading"
      :class="spinnerClass ? 'pt-2' : ''"
      >
      <b-spinner
        style="width: 1.5rem; height: 1.5rem;"
        label="loading"
        variant="primary"
        >
      </b-spinner>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

// import { APIresponses } from '@/config/APIoperations.js'

export default {
  name: 'ModerationCheckbox',
  props: [
    'dgfType',
    'item',
    'field',
    'spinnerClass'
  ],
  data () {
    return {
      isLoading: false,
      itemModerationValue: undefined,
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
    console.log('-C- ModerationCheckbox > updateModeration > this.item : ', this.item)
    this.itemModerationValue = this.item[this.field]
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
      console.log('-C- ModerationCheckbox > updateModeration > evt : ', evt)
      const updatedItem = await this.$MODERATIONcli.updateModeration(this.dgfType, item, field, evt)
      console.log('-C- ModerationCheckbox > updateModeration > updatedItem : ', updatedItem)
      const categ = `update_${field}`
      const respData = {
        category: categ,
        item: updatedItem,
        msg: `response action : ${this.dgfType}-${categ}`
      }
      this.$makeToast(updatedItem, this.item.id, 'PUT', this.dgfType, this.field)
      this.itemModerationValue = evt
      this.emitResponse(respData)
      this.isLoading = false
    },
    // makeToast (moderationResponse) {
    //   const h = this.$createElement
    //   const variant = !APIresponses.success.includes(moderationResponse.status) ? 'danger' : 'success'
    //   const title = !APIresponses.success.includes(moderationResponse.status) ? 'error' : 'success'
    //   const msg = !APIresponses.success.includes(moderationResponse.status) ? this.$t('toastsModeration.errorTxt', { code: moderationResponse.status }) : 'ok msg'

    //   const vNodesTitle = h(
    //     'div',
    //     { class: ['d-flex', 'flex-grow-1', 'align-items-baseline', 'ml-2'] },
    //     [
    //       h('strong', { class: ['mr-2', 'text-center'] }, this.$t(`toastsModeration.${title}`))
    //     ]
    //   )
    //   const vNodesMsg = h(
    //     'p',
    //     { class: ['text-center', 'my-2'] },
    //     [
    //       h('strong', `PUT ${this.dgfType} / ${this.field}`),
    //       h('br'),
    //       h('span', `id : ${this.item.id}`), h('hr'),
    //       h('strong', msg), h('br'),
    //       h('p', this.$t(`responseCodes._${moderationResponse.status}`))
    //     ]
    //   )

    //   this.$bvToast.toast([vNodesMsg], {
    //     title: [vNodesTitle],
    //     variant: variant,
    //     solid: true
    //   })
    // },
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
