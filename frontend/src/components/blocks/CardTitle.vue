<template>
  <b-card-title>
    <b-container
      fluid
      class="my-4"
      >
      <b-row>
        <b-col
          md="10"
          offset-md="2"
          :class="`h1 text-left ${customClass}`"
          >
          {{title}}
        </b-col>
      </b-row>
    </b-container>
  </b-card-title>
</template>

<script>
export default {
  name: 'CardTitle',
  props: [
    'title',
    'customClass'
  ]
}
</script>
