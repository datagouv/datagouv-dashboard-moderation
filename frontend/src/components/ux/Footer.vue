<template>
  <footer
    class="bd-footer bg-secondary py-3"
    >
  <!-- <b-navbar
    fixed="bottom"
    class="bg-secondary py-3"
    > -->
    <div class="container">
      <b-row
        align-v="center"
        >
        <b-col cols="2">
          <Locales/>
        </b-col>
        <b-col class="text-white">
          <p class="mb-0 font-weight-bold">
            {{$t('footer.title')}}
          </p>
          <p class="font-weight-lighter">
            {{$t('footer.subtitle')}}
          </p>
        </b-col>
        <b-col cols="1" class="pill-override white-override">
          <b-button
            pill
            class="m-2 btn-circle btn-circle-sm"
            href="https://github.com/etalab/datagouv-dashboard-moderation"
            target="_blank"
            >
            <b-icon icon="code"></b-icon>
          </b-button>
        </b-col>
      </b-row>
    </div>
  <!-- </b-navbar> -->
  </footer>
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
    // console.log('-C- Footer > created ...')
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
