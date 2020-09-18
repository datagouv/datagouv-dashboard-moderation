<template>

  <b-row
    v-if="anchorLinks"
    class="text-left"
    >
    <b-col
      md="8"
      offset-md="2"
      >
      <b-button
        v-for="anchor in anchorLinks"
        :key="anchor.link"
        pill
        size="sm"
        :class="`button mr-2 ${ customClass ? customClass : '' }`"
        variant="outline-dark"
        :href="`#${anchor.link}`"
        >
        {{ $t(anchor.textCode) }}
        <b-icon icon="chevron-down" aria-hidden="true" class="ml-1 mb-0"></b-icon>
      </b-button>
    </b-col>
  </b-row>

</template>

<script>
export default {
  name: 'AnchorsButtons',
  props: [
    'anchorLinks',
    'customClass'
  ]
}
</script>
