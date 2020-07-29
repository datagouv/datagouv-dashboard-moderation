<template>

  <div class="reuses">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

    <PreviousPage/>

    <h2>
      {{ $t('basics.reuses', {list: $t('basics.list')}) }}
    </h2>

    <br>

    <!-- DISPLAY DISCUSSIONS IN TABLE -->
    <ReusesList
      height="800px"
      width="900px"
      >
    </ReusesList>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import PreviousPage from '@/components/ux/PreviousPage.vue'
import ReusesList from '@/components/reuses/ReusesList.vue'

export default {
  name: 'Reuses',
  components: {
    PreviousPage,
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
