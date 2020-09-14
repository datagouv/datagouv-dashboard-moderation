<template>

  <div class="resources">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

    <!-- DISPLAY RESOURCES IN TABLE -->
    <ResourcesList
      height="800px"
      >
    </ResourcesList>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import ResourcesList from '@/components/resources/ResourcesList.vue'

export default {
  name: 'Resources',
  components: {
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
