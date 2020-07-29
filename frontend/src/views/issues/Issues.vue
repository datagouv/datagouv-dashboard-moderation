<template>

  <div class="issues">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

    <PreviousPage/>

    <h2>
      {{ $t('basics.issues', {list: $t('basics.list')}) }}
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

import PreviousPage from '@/components/ux/PreviousPage.vue'
import IssuesList from '@/components/issues/IssuesList.vue'

export default {
  name: 'Issues',
  components: {
    PreviousPage,
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
