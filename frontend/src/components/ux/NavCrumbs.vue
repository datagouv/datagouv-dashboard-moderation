<template>
  <b-row class="bg-light mb-5">
    <b-col
      cols="1" sm="2"
      align-self="center"
      class="mx-1"
      >
      <PreviousPage
        v-show="!Boolean(hideBackBtn)"
        :customClass="'text-dark'"
        :customClassBtn="'link'"
      />
    </b-col>
    <b-col
      align-self="start"
      >
      <b-breadcrumb
        class="mb-0 bg-light"
        :items="crumbs">
      </b-breadcrumb>
    </b-col>
  </b-row>
</template>

<script>
import PreviousPage from '@/components/ux/PreviousPage.vue'

export default {
  name: 'NavCrumbs',
  components: {
    PreviousPage
  },
  props: [
    'crumbs',
    'hideBackBtn'
  ]
}
</script>
