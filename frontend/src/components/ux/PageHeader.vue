<template>
  <b-row
    align-h="between"
    :class="customClass"
    >

    <b-col
      v-if="!compact"
      :cols="compact ? 4 : 3"
      align-self="start"
      class="text-left pl-5"
      >
      <PreviousPage/>
    </b-col>

    <b-col
      :cols="compact ? 8 : 6"
      align-self="center"
      :class="compact ? 'pl-5 text-left' : 'text-center' "
      >
      <router-link
        v-if="compact"
        class='h2 text-dark'
        :to="dict[dgfType].to"
        >
        <b-icon icon="link45deg" aria-hidden="true"></b-icon>
        {{ $t(dict[dgfType].textCode) }}
      </router-link>
      <h2 v-else>
        {{ $t(dict[dgfType].textCode) }}
        <b-button
          v-if="subtitleLink"
          variant="link"
          :href="subtitleLink"
          target="_blank"
          >
          <!-- {{ subtitleLink }} -->
          <b-icon icon="link45deg"></b-icon>
        </b-button>
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

import PreviousPage from '@/components/ux/PreviousPage.vue'

export default {
  name: 'PageHeader',
  components: {
    PreviousPage
  },
  props: [
    'dgfType',
    'linkTitle',
    'compact',
    'noSubtitle',
    'subtitleLink',
    'customClass'
  ],
  data () {
    return {
      dict: MapDgfTypes
    }
  }
}
</script>
