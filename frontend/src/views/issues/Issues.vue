<template>

  <div class="issues">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

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
          text: this.$t('home.name'),
          to: '/'
        },
        {
          text: this.$t('basics.issues', { list: '' }),
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
