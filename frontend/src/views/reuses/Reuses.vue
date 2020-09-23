<template>

  <div class="reuses">

    <NavCrumbs
      :crumbs="crumbs"
    />

    <!-- DISPLAY REUSES IN TABLE -->
    <ReusesList
      height="800px"
      :customClass="'pb-5'"
      >
    </ReusesList>

    <div class="mb-5"/>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import NavCrumbs from '@/components/ux/NavCrumbs.vue'
import ReusesList from '@/components/reuses/ReusesList.vue'

export default {
  name: 'Reuses',
  components: {
    NavCrumbs,
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
