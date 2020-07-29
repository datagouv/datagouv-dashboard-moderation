<template>

  <div class="resources">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

    <PreviousPage/>

    <h2>
      {{ $t('basics.resources', {list: $t('basics.list')}) }}
    </h2>

    <br>

    <!-- DISPLAY DISCUSSIONS IN TABLE -->
    <ResourcesList
      height="800px"
      width="900px"
      >
    </ResourcesList>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import ResourcesList from '@/components/resources/ResourcesList.vue'
import PreviousPage from '@/components/ux/PreviousPage.vue'

export default {
  name: 'Resources',
  components: {
    PreviousPage,
    ResourcesList
  },
  data () {
    return {
      crumbs: [
        {
          text: this.$t('home.name'),
          to: '/'
        },
        {
          text: this.$t('basics.resources', { list: '' }),
          active: true
        }
      ]
    }
  },
  created () {
  },
  computed: {
    ...mapState({
      log: (state) => state.global.log
    })
  }
}

</script>
