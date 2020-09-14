<template>

  <div class="datasets">

    <NavCrumbs
      :crumbs="crumbs"
    />

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

import NavCrumbs from '@/components/ux/NavCrumbs.vue'
import DatasetsList from '@/components/datasets/DatasetsList.vue'

export default {
  name: 'Datasets',
  components: {
    NavCrumbs,
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
