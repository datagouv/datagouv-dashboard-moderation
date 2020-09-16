<template>

  <b-card
    id="moderation-row-card"
    class="border-0 mx-3"
    >

    <!-- ACTION BTN -->
    <!-- <template v-slot:header v-if="hasHeader">
      <div class="d-flex flex-row justify-content-between align-items-center py-2">
        <div class="flex-fill">
          {{ $t('moderation.moderation', {prefix: ''}) }}
        </div> -->
        <!-- <ModerationItemBtn
          :endpoint="endpoint"
          :item="item"
          >
        </ModerationItemBtn> -->
      <!-- </div>
    </template> -->

    <div
      v-if="!item"
      class="py-5 my-5">
      <custom-spinner/>
    </div>

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
          v-if="isAuthenticated"
          :sm="4"
          class="bg-light p-4 mx-4"
          >
          <p class="font-weight-bold">
            {{ $t('moderation.comments') }}
          </p>
          <ModerationComments
            :dgfType="dgfType"
            :item="item"
            @responseAction="callbackAction"
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
              @responseAction="callbackAction"
              >
            </ModerationCheckbox>
          </div>
          <div class="mb-4">
            {{ $t('moderation.suspicious') }}
            <ModerationCheckbox
              :dgfType="dgfType"
              :item="item"
              :field="'suspicious'"
              @responseAction="callbackAction"
              >
            </ModerationCheckbox>
          </div>
          <div class="">
            {{ $t('moderation.deleted') }}
            <ModerationCheckbox
              :dgfType="dgfType"
              :item="item"
              :field="'deleted'"
              @responseAction="callbackAction"
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
            @responseAction="callbackAction"
            spinnerClass="true"
            >
          </ModerationCheckbox>
        </b-col>

        <b-col>
          {{ $t('moderation.suspicious') }}
          <ModerationCheckbox
            :dgfType="dgfType"
            :item="item"
            :field="'suspicious'"
            @responseAction="callbackAction"
            spinnerClass="true"
            >
          </ModerationCheckbox>
        </b-col>

        <b-col>
          {{ $t('moderation.deleted') }}
          <ModerationCheckbox
            :dgfType="dgfType"
            :item="item"
            :field="'deleted'"
            @responseAction="callbackAction"
            spinnerClass="true"
            >
          </ModerationCheckbox>
        </b-col>
      </b-row>

      <!-- COMMENTS -->
      <b-row v-if="hasHeader && isAuthenticated" class="mb-2" align-h="center">
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
            @responseAction="callbackAction"
          />
        </b-col>
      </b-row>

    </div>
  </b-card>

</template>

<script>
import { mapGetters } from 'vuex'

import { MapDgfTypes } from '@/config/MapDgfTypes.js'
import { trimText } from '@/utils/textUtils.js'

import ModerationCheckbox from '@/components/moderation/ModerationCheckbox.vue'
import ModerationComments from '@/components/moderation/ModerationComments.vue'

export default {
  name: 'ModerationRowCard',
  components: {
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
      dict: MapDgfTypes,
      // itemModeration: undefined,
      isLoading: false
    }
  },
  // created () {
  //   console.log('-C- ModerationRowCard > created > this.item : ', this.item)
  // },
  watch: {
    item (next) {
      console.log('-C- ModerationRowCard > watch > item > next : ', next)
      // this.itemModeration = next
    }
  },
  computed: {
    ...mapGetters({
      isAuthenticated: 'oauth/isAuthenticated'
    })
  },
  methods: {
    emitChange (data) {
      this.$emit('valueChange', data)
    },
    callbackAction (evt) {
      // TO DO
      this.isLoading = true
      console.log('-C- ModerationRowCard > callbackAction > evt.category : ', evt.category)
      switch (evt.category) {
        case 'update_read':
          console.log('-C- ModerationRowCard > callbackAction > update_read ')
          break
        case 'update_suspicious':
          console.log('-C- ModerationRowCard > callbackAction > update_suspicious ')
          break
        case 'update_deleted':
          console.log('-C- ModerationRowCard > callbackAction > update_deleted ')
          break
        case 'update_comment':
          console.log('-C- ModerationRowCard > callbackAction > update_comment ')
          break
      }
      this.isLoading = false
    },
    trim (str, max) {
      return trimText(str, max)
    }
  }
}
</script>
