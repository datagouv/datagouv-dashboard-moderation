<template>
  <div
    class="mt-1 mb-4"
    >
    <b-button
      @click="goBack"
      pill
      variant="outline-secondary"
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
  components: {
  },
  data () {
    return {}
  },
  created () {
    console.log('-C- PreviousPage > created ...')
  },
  computed: {
    ...mapState({
      log: (state) => state.global.log,
      history: (state) => state.global.navHistory
    }),
    ...mapGetters({
      lastPath: 'global/getLastNavPath'
    })
  },
  methods: {
    goBack (e) {
      console.log('\n-C- PreviousPage > goBack ...')
      e.preventDefault()
      console.log('-C- PreviousPage > goBack > this.lastPath :', this.lastPath)
      this.$router.push(this.lastPath)
    }
  }
}
</script>
