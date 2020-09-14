<template>

  <b-card>

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

      <!-- HORIZONTAL / FOR TABLE ROWS -->
      <b-row v-if="!hasHeader" class="mb-2">

        <b-col
          :sm="3"
          class="bg-light p-4 ml-4"
          >
          <p class="font-weight-bold">
            {{ $t('moderation.moderation', {prefix: ''}) }}
            <br>
            {{ $t(dict[dgfType].textCode)}}
          </p>
          <router-link
            :to="`${dict[dgfType].to}/${item.id}`"
            >
            <b-icon icon="link45deg" aria-hidden="true"></b-icon>
            <span class="text-uppercase">
              {{item[dict[dgfType].titleKey]}}
            </span>
          </router-link>

          <div>
            <hr>
            <p
              v-if="dict[dgfType].descriptionKey"
              class="text-left mt-4"
              >
              {{ trim(item[dict[dgfType].descriptionKey], 500) }}
            </p>
          </div>
        </b-col>

        <b-col
          :sm="4"
          class="bg-light p-4 mx-4"
          >
          <p class="font-weight-bold">
            {{ $t('moderation.comments') }}
          </p>
          <ModerationComments
            :dgfType="dgfType"
            :item="item"
          />
        </b-col>

        <b-col
          :sm=1
          class="bg-light pt-3"
          align-self="middle"
          >
          <div class="mt-3 mb-4">
            {{ $t('moderation.read') }}
            <ModerationCheckbox
              :dgfType="dgfType"
              :item="item"
              :field="'read'"
              >
            </ModerationCheckbox>
          </div>
          <div class="mb-4">
            {{ $t('moderation.suspicious') }}
            <ModerationCheckbox
              :dgfType="dgfType"
              :item="item"
              :field="'suspicious'"
              >
            </ModerationCheckbox>
          </div>
          <div class="">
            {{ $t('moderation.deleted') }}
            <ModerationCheckbox
              :dgfType="dgfType"
              :item="item"
              :field="'deleted'"
              >
            </ModerationCheckbox>
          </div>
        </b-col>

      </b-row>

      <!-- VERTICAL -->
      <b-row v-if="hasHeader" class="mb-2" align-h="center">
        <b-col>
          {{ $t('moderation.read') }}
          <ModerationCheckbox
            :dgfType="dgfType"
            :item="item"
            :field="'read'"
            >
          </ModerationCheckbox>
        </b-col>

        <b-col>
          {{ $t('moderation.suspicious') }}
          <ModerationCheckbox
            :dgfType="dgfType"
            :item="item"
            :field="'suspicious'"
            >
          </ModerationCheckbox>
        </b-col>

        <b-col>
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
        <b-col :sm="10" class="mb-0">
          <hr>
          <p class="font-weight-bold">
            {{ $t('moderation.comments') }}
          </p>
        </b-col>
        <b-col :sm="10">
          <ModerationComments
            :dgfType="dgfType"
            :item="item"
          />
        </b-col>
      </b-row>

    </div>
  </b-card>

</template>

<script>

import { MapDgfTypes } from '@/config/MapDgfTypes.js'
import { trimText } from '@/utils/textUtils.js'

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
  data () {
    return {
      dict: MapDgfTypes
    }
  },
  methods: {
    async updateModeration (item, field, evt) {
      const updatedItem = await this.$MODERATIONcli.updateModeration(this.dgfType, item, field, evt)
      console.log('-C- ModerationRowCard > updateModeration > updatedItem : ', updatedItem)
    },
    trim (str, max) {
      return trimText(str, max)
    }
  }
}
</script>
