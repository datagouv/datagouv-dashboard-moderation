<template>

  <div class="organizations">

    <NavCrumbs
      :crumbs="crumbs"
    />

    <!-- DISPLAY ORGANIZATIONS IN TABLE -->
    <OrganizationsList
      height="800px"
      width="1200px"
      >
    </OrganizationsList>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import NavCrumbs from '@/components/ux/NavCrumbs.vue'
import OrganizationsList from '@/components/organizations/OrganizationsList.vue'

export default {
  name: 'Organizations',
  components: {
    NavCrumbs,
    OrganizationsList
  },
  data () {
    return {
      crumbs: [
        {
          text: this.$t('home.name'),
          to: '/'
        },
        {
          text: this.$t('basics.organizations', { list: '' }),
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
