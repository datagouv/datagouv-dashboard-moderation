<template>

  <div class="datasets">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

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

import DatasetsList from '@/components/data/DatasetsList.vue'

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
  created () {
    // const API = this.$APIcli
    // console.log('-V- Datasets > created > API :', API)
    // API._request(this.operationId).then(
    //   results => {
    //     console.log('-V- Datasets > created > results.body :', results.body)
    //     this.datasetsRequest = results.url
    //     this.datasets = results.body
    //   },
    //   reason => console.error(`-V- Datasets > failed on api call: ${reason}`)
    // )
  },
  computed: {
    ...mapState({
      log: (state) => state.global.log
    })
  }
}

</script>
