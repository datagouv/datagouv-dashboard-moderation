<template>

  <div class="reuses">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

    <h2>
      Reuses list
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
          text: 'Home',
          to: '/'
        },
        {
          text: 'Reuses',
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
