<template>
  <div class="hello">
    <h1>{{ $t('home.intro') }}</h1>
    <p v-if="userData">
      {{ $t('home.hello', { name: userData.first_name }) }}
    </p>
    <p v-else>
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
      log: (state) => state.global.log,
      userData: (state) => state.user.user
    }),
    ...mapGetters({
      isAuthenticated: 'oauth/isAuthenticated'
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
