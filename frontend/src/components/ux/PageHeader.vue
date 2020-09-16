<template>
  <b-row
    id="page-header"
    align-h="between"
    :class="`${customClass} mt-5`"
    >

    <b-col
      v-if="!compact"
      :cols="compact ? 4 : 2"
      align-self="start"
      class="text-center pl-5"
      >
      <slot name="dialogLeft"></slot>
    </b-col>

    <b-col
      :cols="compact ? 8 : 6"
      :offset-sm="compact ? 0 : 1"
      align-self="center"
      :class="compact ? 'pl-5 text-left' : 'text-center' "
      >

      <router-link
        v-if="compact"
        class='h2 text-dark'
        :to="dict[dgfType].to"
        >
        <b-icon icon="link45deg" aria-hidden="true"></b-icon>
        <span>
          {{ $t(dict[dgfType].textCode) }}
        </span>
        <b-badge
          v-if="badgeNumber"
          pill
          variant="light"
          class="badge-shift"
          >
          {{formattedNumber(badgeNumber)}}
        </b-badge>
      </router-link>

      <h2 v-else>
        <span>
          {{ $t(dict[dgfType].textCode) }}
        </span>
        <b-badge
          v-if="badgeNumber"
          pill
          variant="light"
          class="badge-shift"
          >
          {{formattedNumber(badgeNumber)}}
        </b-badge>

        <b-button
          id="popover-btn-dgf-api-endpoint"
          v-if="subtitleLink"
          variant="link"
          :href="subtitleLink"
          target="_blank"
          >
          <!-- {{ subtitleLink }} -->
          <b-icon icon="link45deg"></b-icon>
        </b-button>
        <b-popover
          v-if="subtitleLink"
          target="popover-btn-dgf-api-endpoint"
          variant="dark"
          placement="right"
          triggers="hover">
          {{$t('popovers.dgfEndpoint')}}
        </b-popover>

      </h2>
      <!-- <template
        v-show="!noSubtitle"
        >
        <slot
          v-if="!noSubtitle"
          name="subtitle"
          >
        </slot>
      </template> -->
    </b-col>

    <b-col
      :cols="compact ? 4 : 3"
      class="text-right pr-5"
      >
      <slot name="badge"></slot>
    </b-col>

  </b-row>
</template>

<script>
import { MapDgfTypes } from '@/config/MapDgfTypes.js'

export default {
  name: 'PageHeader',
  props: [
    'dgfType',
    'linkTitle',
    'compact',
    'noSubtitle',
    'subtitleLink',
    'customClass',
    'badgeNumber'
  ],
  data () {
    return {
      dict: MapDgfTypes
    }
  },
  methods: {
    formattedNumber (value) {
      return value.toLocaleString()
    }
  }
}
</script>

<style scoped>
  .badge-shift {
    vertical-align:text-top;
    font-size: 0.5em;
  }
</style>
