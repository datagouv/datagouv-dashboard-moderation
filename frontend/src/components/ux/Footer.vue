<template>
  <b-navbar
    sticky
    class="bg-secondary mt-5 py-5"
    >
    <div class="container">
      <span class="text-white">
        sticky footer component
      </span>
    </div>
  </b-navbar>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'Footer',
  components: {},
  data () {
    return {
      // isFixed: false
    }
  },
  created () {
    console.log('-C- Footer > created ...')
  },
  computed: {
    ...mapState({
      log: (state) => state.global.log
    })
  },
  methods: {

  }
}
</script>
