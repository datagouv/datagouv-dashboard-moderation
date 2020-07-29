<template>

  <div class="discussions">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

    <PreviousPage/>

    <h2>
      {{ $t('basics.discussions', {list: $t('basics.list')}) }}
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
import PreviousPage from '@/components/ux/PreviousPage.vue'

export default {
  name: 'Discussions',
  components: {
    PreviousPage,
    DiscussionsList
  },
  data () {
    return {
      crumbs: [
        {
          text: this.$t('home.name'),
          to: '/'
        },
        {
          text: this.$t('basics.discussions', { list: '' }),
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
