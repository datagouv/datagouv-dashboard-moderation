<template>

  <div class="issues">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

    <h2>
      Issues list
    </h2>

    <br>

    <!-- DISPLAY ISSUES IN TABLE -->
    <IssuesList
      height="800px"
      width="900px"
      >
    </IssuesList>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import IssuesList from '@/components/issues/IssuesList.vue'

export default {
  name: 'Issues',
  components: {
    IssuesList
  },
  data () {
    return {
      crumbs: [
        {
          text: 'Home',
          to: '/'
        },
        {
          text: 'Issues',
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
