<template>

  <div class="datasets">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

    <PreviousPage/>

    <h2>
      Datasets list
    </h2>

    <br>

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

import PreviousPage from '@/components/ux/PreviousPage.vue'
import DatasetsList from '@/components/datasets/DatasetsList.vue'

export default {
  name: 'Datasets',
  components: {
    PreviousPage,
    DatasetsList
  },
  data () {
    return {
      operationId: 'list_datasets',
      datasets: undefined,
      datasetsRequest: undefined,
      crumbs: [
        {
          text: 'Home',
          to: '/'
        },
        {
          text: 'Datasets',
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
