<template>

  <div class="discussions">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

    <h2>
      Discussions list
    </h2>

    <br>

    <!-- DISPLAY DISCUSSIONS IN TABLE -->
    <DiscussionsList
      height="800px"
      width="900px"
      >
    </DiscussionsList>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import DiscussionsList from '@/components/discussions/DiscussionsList.vue'

export default {
  name: 'Discussions',
  components: {
    DiscussionsList
  },
  data () {
    return {
      crumbs: [
        {
          text: 'Home',
          to: '/'
        },
        {
          text: 'Discussions',
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
