<template>

  <b-card
    >

    <!-- ACTION BTN -->
    <template v-slot:header v-if="hasHeader">
      <div class="d-flex flex-row justify-content-between align-items-center">
        <div class="flex-fill">
          {{ $t('moderation.moderation', {prefix: ''}) }}
        </div>
        <!-- <ModerationItemBtn
          :endpoint="endpoint"
          :item="item"
          >
        </ModerationItemBtn> -->
      </div>
    </template>

    <!-- MODERATION DATA -->
    <div v-if="item">

      <!-- HORRIZONTAL -->
      <b-row v-if="!hasHeader" class="mb-2">
        <b-col :sm="1">
          {{ $t('moderation.read') }}
          <ModerationCheckbox
            :dgfType="dgfType"
            :item="item"
            :field="'read'"
            >
          </ModerationCheckbox>
        </b-col>

        <b-col :sm="1">
          {{ $t('moderation.suspicious') }}
          <ModerationCheckbox
            :dgfType="dgfType"
            :item="item"
            :field="'suspicious'"
            >
          </ModerationCheckbox>
        </b-col>

        <b-col :sm="1">
          {{ $t('moderation.deleted') }}
          <ModerationCheckbox
            :dgfType="dgfType"
            :item="item"
            :field="'deleted'"
            >
          </ModerationCheckbox>
        </b-col>

        <b-col
          :sm="2"
          class="text-sm-center bg-light pt-3"
          align-self="strech"
          >
          <p class="font-weight-bold">
            {{ $t('moderation.comments') }}
          </p>
        </b-col>
        <b-col
          :sm="7"
          class="bg-light"
          >
          <ModerationComments
            :comments="item.comments"
          />
        </b-col>
      </b-row>

      <!-- VERTICAL -->
      <b-row v-if="hasHeader" class="mb-2" align-h="center">
        <b-col :sm="2">
          {{ $t('moderation.read') }}
          <ModerationCheckbox
            :dgfType="dgfType"
            :item="item"
            :field="'read'"
            >
          </ModerationCheckbox>
        </b-col>

        <b-col :sm="2">
          {{ $t('moderation.suspicious') }}
          <ModerationCheckbox
            :dgfType="dgfType"
            :item="item"
            :field="'suspicious'"
            >
          </ModerationCheckbox>
        </b-col>

        <b-col :sm="2">
          {{ $t('moderation.deleted') }}
          <ModerationCheckbox
            :dgfType="dgfType"
            :item="item"
            :field="'deleted'"
            >
          </ModerationCheckbox>
        </b-col>
      </b-row>

      <!-- COMMENTS -->
      <b-row v-if="hasHeader" class="mb-2" align-h="center">
        <b-col :sm="10" class="mb-3">
          <hr>
          <p>
            {{ $t('moderation.comments') }}
          </p>
        </b-col>
        <b-col :sm="10">
          <ModerationComments
            :comments="item.comments"
          />
        </b-col>
      </b-row>

    </div>
  </b-card>

</template>

<script>

// import ModerationItemBtn from '@/components/moderation/ModerationItemBtn.vue'
import ModerationCheckbox from '@/components/moderation/ModerationCheckbox.vue'
import ModerationComments from '@/components/moderation/ModerationComments.vue'

export default {
  name: 'ModerationRowCard',
  components: {
    // ModerationItemBtn,
    ModerationCheckbox,
    ModerationComments
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
