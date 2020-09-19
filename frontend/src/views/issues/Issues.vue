<template>

  <div class="issues">

    <NavCrumbs
      :crumbs="crumbs"
    />

    <!-- DISPLAY ISSUES IN TABLE -->
    <IssuesList
      height="800px"
      :customClass="'pb-5'"
      >
    </IssuesList>

    <div class="mb-5"/>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import NavCrumbs from '@/components/ux/NavCrumbs.vue'
import IssuesList from '@/components/issues/IssuesList.vue'

export default {
  name: 'Issues',
  components: {
    NavCrumbs,
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
