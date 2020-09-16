<template>
  <b-card-text>
    <b-container
      fluid
      class="my-5 pb-5"
      >
      <b-row>
        <b-col
          md="8"
          offset-md="2"
          :class="`text-left ${customClass}`"
          >
          <vue-simple-markdown :source="text">
          </vue-simple-markdown>
        </b-col>
      </b-row>
    </b-container>
  </b-card-text>
</template>

<script>
export default {
  name: 'CardDescription',
  props: [
    'text',
    'customClass'
  ]
}
</script>
