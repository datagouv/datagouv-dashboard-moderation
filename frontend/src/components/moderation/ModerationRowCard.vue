<template>

  <b-card
    >
    <code>
      {{item}}
    </code>

    <!-- ACTION BTN -->
    <template v-slot:header v-if="hasHeader">
      <div class="d-flex flex-row justify-content-between align-items-center">
        <div class="flex-fill">
          {{ $t('moderation.moderation', {prefix: ''}) }}
        </div>

        <ModerationItemBtn
          :endpoint="endpoint"
          :item="item"
          >
        </ModerationItemBtn>

      </div>
    </template>

    <!-- MODERATION DATA -->
    <div v-if="item">

      <b-row class="mb-2">
        <b-col
          :sm="hasHeader? 6 : 3"
          class="text-sm-right">
          <b>
            {{ $t('moderation.read') }}:
          </b>
          </b-col>
        <b-col
          :sm="hasHeader? 6 : 9"
          >
          <!-- {{ item.read }} -->
          <ModerationCheckbox
            :dgfType="dgfType"
            :item="item"
            :field="'read'"
            >
          </ModerationCheckbox>
        </b-col>
      </b-row>

      <b-row class="mb-2">
        <b-col
          :sm="hasHeader? 6 : 3"
          class="text-sm-right">
          <b>
          {{ $t('moderation.suspicious') }}:</b>
        </b-col>
        <b-col
          :sm="hasHeader? 6 : 9"
          >
          <!-- {{ item.suspicious }} -->
          <ModerationCheckbox
            :dgfType="dgfType"
            :item="item"
            :field="'suspicious'"
            >
          </ModerationCheckbox>
        </b-col>
      </b-row>

      <b-row class="mb-2">
        <b-col
          :sm="hasHeader? 6 : 3"
          class="text-sm-right">
          <b>
            {{ $t('moderation.comments') }}:
          </b>
          </b-col>
        <b-col
          :sm="hasHeader? 6 : 9"
          >
          <code>{{ item.comments }}</code>
        </b-col>
      </b-row>

    </div>
  </b-card>

</template>

<script>

import ModerationItemBtn from '@/components/moderation/ModerationItemBtn.vue'
import ModerationCheckbox from '@/components/moderation/ModerationCheckbox.vue'

export default {
  name: 'ModerationRowCard',
  components: {
    ModerationItemBtn,
    ModerationCheckbox
  },
  props: [
    'hasHeader',
    'dgfType',
    'endpoint',
    'item'
  ],
  methods: {
    async updateModeration (item, field, evt) {
      const updatedItem = await this.$MODERATIONcli.updateModeration(this.dgfType, item, field, evt)
      console.log('-C- ModerationRowCard > updateModeration > updatedItem : ', updatedItem)
    }
  }
}
</script>
