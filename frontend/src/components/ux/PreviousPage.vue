<template>
  <div
    :class="customClass"
    >
    <b-button
      v-show="!inactiveBack"
      pill
      :disabled="inactiveBack"
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
      lastPath: 'global/getLastNavPath'
    }),
    inactiveBack () {
      return this.$router.currentRoute.path === this.lastPath
    }
  },
  methods: {
    goBack (e) {
      e.preventDefault()
      this.$router.push(this.lastPath)
    }
  }
}
</script>
