<template>
  <b-navbar
    fixed="bottom"
    class="bg-secondary py-3"
    >
    <div class="container">
      <Locales/>
      <span class="text-white">
        sticky footer component
      </span>
    </div>
  </b-navbar>
</template>
<script>
import { mapState } from 'vuex'

import Locales from '@/components/ux/Locales.vue'

export default {
  name: 'Footer',
  components: {
    Locales
  },
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
