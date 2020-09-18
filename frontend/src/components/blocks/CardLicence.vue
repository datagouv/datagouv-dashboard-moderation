<template>
  <b-card-text
    id="item-licence"
    >
    <b-container
      fluid
      class="my-4"
      >
      <b-row>
        <b-col
          md="8"
          offset-md="2"
          >
          <b-table
            striped
            hover
            :items="licenceData"
          ></b-table>
        </b-col>
      </b-row>
    </b-container>
  </b-card-text>
</template>

<script>
export default {
  name: 'CardLicence',
  props: [
    'dataset'
  ],
  data () {
    return {
      licenceData: [
        {
          frequency: this.dataset.frequency,
          license: this.dataset.license,
          last_update: this.dataset.last_update
        }
      ]
    }
  }
}
</script>
