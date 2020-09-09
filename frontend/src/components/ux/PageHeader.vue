<template>
  <b-row>

    <b-col cols="2">
      <PreviousPage/>
    </b-col>

    <b-col cols="8">
      <h2>
        {{ $t(textCode) }}
      </h2>
      <slot name="subtitle"></slot>
    </b-col>

    <b-col cols="2">
      <slot name="badge"></slot>
    </b-col>

  </b-row>
</template>

<script>
import PreviousPage from '@/components/ux/PreviousPage.vue'

export default {
  name: 'PageHeader',
  components: {
    PreviousPage
  },
  props: [
    'textCode'
  ]
}
</script>
