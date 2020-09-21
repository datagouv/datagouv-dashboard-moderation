<template>
  <b-row
    align-v="center"
    >
    <b-col
      align-self="stretch"
      >
      <b-spinner
        :style="`width: ${ size ? size : 5 }rem; height: ${ size ? size : 5 }rem;`"
        label="loading"
        :variant="`${ variant ? variant : 'primary'}`"
        >
      </b-spinner>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'CustomSpinner',
  props: [
    'size',
    'variant'
  ]
}
</script>
