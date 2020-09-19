<template>

  <div class="resources">

    <NavCrumbs
      :crumbs="crumbs"
    />

    <!-- DISPLAY RESOURCES IN TABLE -->
    <ResourcesList
      height="800px"
      :customClass="'pb-5'"
      >
    </ResourcesList>

    <div class="mb-5"/>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import NavCrumbs from '@/components/ux/NavCrumbs.vue'
import ResourcesList from '@/components/resources/ResourcesList.vue'

export default {
  name: 'Resources',
  components: {
    NavCrumbs,
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
