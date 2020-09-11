<template>

  <div class="reuses">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

    <!-- DISPLAY REUSES IN TABLE -->
    <ReusesList
      height="800px"
      >
    </ReusesList>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import ReusesList from '@/components/reuses/ReusesList.vue'

export default {
  name: 'Reuses',
  components: {
    ReusesList
  },
  data () {
    return {
      crumbs: [
        {
          text: this.$t('home.name'),
          to: '/'
        },
        {
          text: this.$t('basics.reuses', { list: '' }),
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
