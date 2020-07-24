<template>
  <div id="app">
    <Navbar/>
    <!-- <div id="nav"> -->
      <!-- <router-link to="/">Home</router-link> | -->
      <!-- <router-link to="/login">Login</router-link> | -->
      <!-- <router-link to="/oauth-client-id">Oauth client ID</router-link> | -->
      <!-- <router-link to="/set-api-key">Set API key</router-link> | -->
      <!-- <router-link to="/about">About</router-link> | -->
      <!-- <router-link to="/datasets">Datasets</router-link> |
      <router-link to="/dataset-update">Dataset update</router-link> -->
    <!-- </div> -->
    <router-view/>
  </div>
</template>

<script>
import Navbar from '@/components/ux/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar
  },
  data () {
    return {
    }
  },
  created () {
    console.log('-C- APP > created ...')
  }
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
