<template>
  <b-card-text>
    <b-container
      fluid
      class="my-5 pb-5"
      >
      <b-row>
        <b-col
          md="10"
          offset-md="2"
          class="text-left"
          >
          {{text}}
        </b-col>
      </b-row>
    </b-container>
  </b-card-text>
</template>

<script>
export default {
  name: 'CardDescription',
  props: [
    'text'
  ]
}
</script>
