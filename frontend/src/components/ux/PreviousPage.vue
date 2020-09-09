<template>
  <div
    class=""
    >
    <b-button
      pill
      variant="outline-secondary"
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
  components: {
  },
  data () {
    return {}
  },
  created () {
    
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
      
      e.preventDefault()
      
      this.$router.push(this.lastPath)
    }
  }
}
</script>
