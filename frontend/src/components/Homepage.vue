<template>
  <div class="my-5 py-3">
    <h1 v-html="$t('home.intro')">
    </h1>
    <p v-if="!userData">
      {{ $t('home.connect') }}
    </p>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Homepage',
  computed: {
    ...mapState({
      userData: (state) => state.user.user,
      log: (state) => state.global.log
    }),
    ...mapGetters({
      isAuthenticated: 'oauth/isAuthenticated'
    })
  }
}
</script>
