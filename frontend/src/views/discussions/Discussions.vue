<template>

  <div class="discussions">

    <NavCrumbs
      :crumbs="crumbs"
    />

    <!-- DISPLAY DISCUSSIONS IN TABLE -->
    <DiscussionsList
      height="800px"
      :customClass="'pb-5'"
      >
    </DiscussionsList>

    <div class="mb-5"/>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import NavCrumbs from '@/components/ux/NavCrumbs.vue'
import DiscussionsList from '@/components/discussions/DiscussionsList.vue'

export default {
  name: 'Discussions',
  components: {
    NavCrumbs,
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
