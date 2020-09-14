<template>
  <div id="app">
    <Navbar/>
    <div class="footer-space">
      <router-view/>
    </div>
    <Footer/>
  </div>
</template>

<script>
import Navbar from '@/components/ux/Navbar.vue'
import Footer from '@/components/ux/Footer.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    Footer
  },
  data () {
    return {
    }
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

.footer-space {
  margin-bottom: 100px;
}
</style>
