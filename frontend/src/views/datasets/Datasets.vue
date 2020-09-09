<template>

  <div class="datasets">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

    <!-- DISPLAY DATASETS IN TABLE -->
    <DatasetsList
      height="800px"
      width="100%"
      >
    </DatasetsList>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import DatasetsList from '@/components/datasets/DatasetsList.vue'

export default {
  name: 'Datasets',
  components: {
    DatasetsList
  },
  data () {
    return {
      operationId: 'list_datasets',
      datasets: undefined,
      datasetsRequest: undefined,
      crumbs: [
        {
          text: this.$t('home.name'),
          to: '/'
        },
        {
          text: this.$t('basics.datasets', { list: '' }),
          active: true
        }
      ]
    }
  },
  computed: {
    ...mapState({
      log: (state) => state.global.log
    })
  }
}

</script>
