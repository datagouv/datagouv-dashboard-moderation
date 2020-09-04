<template>

  <b-card
    >
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
          :sm="hasHeader? 5 : 3"
          class="text-sm-right">
          <b>
            {{ $t('moderation.read') }}:
          </b>
          </b-col>
        <b-col>
          {{ item.read }}
        </b-col>
      </b-row>
      <b-row class="mb-2">
        <b-col
          :sm="hasHeader? 5 : 3"
          class="text-sm-right">
          <b>
          {{ $t('moderation.suspect') }}:</b>
        </b-col>
        <b-col>
          {{ item.suspect }}
        </b-col>
      </b-row>
      <b-row class="mb-2">
        <b-col
          :sm="hasHeader? 5 : 3"
          class="text-sm-right">
          <b>
            {{ $t('moderation.comments') }}:
          </b>
          </b-col>
        <b-col>
          {{ item.comments }}
        </b-col>
      </b-row>
    </div>
  </b-card>

</template>

<script>

import ModerationItemBtn from '@/components/moderation/ModerationItemBtn.vue'

export default {
  name: 'ModerationRowCard',
  components: {
    ModerationItemBtn
  },
  props: [
    'hasHeader',
    'endpoint',
    'item'
  ]
}
</script>
