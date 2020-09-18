<template>
  <div
    :class="customClass"
    >
    <b-button
      v-show="isHistory"
      pill
      :variant="`${customClassBtn ? customClassBtn + ' text-dark' : 'outline-secondary'}`"
      @click="goBack"
      >
      <b-icon icon="arrow-left" aria-hidden="true"></b-icon>
      {{$t('navigation.back')}}
    </b-button>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'PreviousPage',
  props: [
    'customClass',
    'customClassBtn'
  ],
  data () {
    return {}
  },
  computed: {
    ...mapState({
      log: (state) => state.global.log,
      history: (state) => state.global.navHistory
    }),
    ...mapGetters({
      isHistory: 'global/isHistory',
      getNavHistory: 'global/getNavHistory',
      lastPath: 'global/getLastNavPath'
    })
  },
  methods: {
    async goBack (e) {
      e.preventDefault()
      await this.$router.push(this.lastPath)
      this.$store.commit('global/deleteLastPathfromHistory')
    }
  }
}
</script>
