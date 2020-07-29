<template>
  <div>
    <!-- <b-button
      id="popover-button-sync"
      pill
      variant="outline-white"
      class="white-override"
      @click="show = !show"
      >
      {{locales[locale].text}}
    </b-button>
    <b-popover
      :show.sync="show"
      target="popover-button-sync"
      :title="$t('locales.choose')"
      placement="topleft"
      class="p-0"
      >
      <b-list-group>
        <b-list-group-item
          v-for="loc of locales"
          :key="loc.code"
          @click="changeLoc(loc.code)"
          >
          <span
            :class="`text-capitalize ${ loc.code === locale ? 'font-weight-bold' : '' }`"
            >
            {{ loc.text }}
          </span>
        </b-list-group-item>
      </b-list-group>
    </b-popover> -->

    <b-dropdown
      dropup
      v-if="locale"
      :text="locales[locale].text"
      class="pill-override white-override m-2"
      >
      <b-dropdown-header id="locales-header-label">
        {{ $t('locales.choose')}}
      </b-dropdown-header>
      <b-dropdown-item
        v-for="loc of locales"
        :key="loc.code"
        @click="changeLoc(loc.code)"
        aria-describedby="locales-header-label"
        >
        <span
          :class="`text-capitalize ${ loc.code === locale ? 'font-weight-bold' : '' }`"
          >
          {{ loc.text }}
        </span>
      </b-dropdown-item>
    </b-dropdown>

  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'Locales',
  components: {
  },
  data () {
    return {
      show: false
    }
  },
  created () {
    console.log('-C- Locales > created > this.locale : ', this.locale)
  },
  computed: {
    ...mapState({
      log: (state) => state.global.log,
      // locale: (state) => state.global.locale,
      locales: (state) => state.global.locales
    }),
    ...mapGetters({
      locale: 'global/getLocale'
    })
  },
  methods: {
    ...mapActions({
      changeLocale: 'global/changeLocale'
    }),
    changeLoc (locCode) {
      this.show = !this.show
      this.$i18n.locale = locCode
      this.changeLocale(locCode)
    }

  }
}
</script>

<style>
  .pill-override > .btn {
    border-radius: 50rem !important;
  }
  .white-override .btn {
    color: white !important;
    border-color: white !important;
  }
</style>
