<template>

  <div class="organizations">

    <b-breadcrumb
      class="mb-5"
      :items="crumbs">
    </b-breadcrumb>

    <PreviousPage/>

    <h2>
      {{ $t('basics.organizations', {list: $t('basics.list')}) }}
    </h2>

    <br>

    <!-- DISPLAY DISCUSSIONS IN TABLE -->
    <OrganizationsList
      height="800px"
      width="900px"
      >
    </OrganizationsList>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import PreviousPage from '@/components/ux/PreviousPage.vue'
import OrganizationsList from '@/components/organizations/OrganizationsList.vue'

export default {
  name: 'Organizations',
  components: {
    PreviousPage,
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
