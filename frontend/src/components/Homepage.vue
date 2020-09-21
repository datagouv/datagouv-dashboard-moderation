<template>
  <div class="my-5 py-3">
  <h1 v-html="$t('home.intro')">
    </h1>
    <!-- <p v-if="userData">
      {{ $t('home.hello', { name: userData.first_name }) }}
    </p> -->
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
// <style scoped lang="less">
// h3 {
//   margin: 40px 0 0;
// }
// ul {
//   list-style-type: none;
//   padding: 0;
// }
// li {
//   display: inline-block;
//   margin: 0 10px;
// }
// a {
//   color: #42b983;
// }
// </style>
