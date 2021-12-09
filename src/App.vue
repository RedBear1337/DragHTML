<template>
  <div id="app">
    <!-- Header Bar -->
    <headerBar/>

    <!-- Main content -->
    <router-view/>
  </div>
</template>

<script>
import headerBar from "@/layouts/headerBar";
export default {
  name: "app",
  components: {headerBar},
  data: function () {
    return {}
  },
  computed: {},
  watch: {},
  mounted: async function () {

  },
}
</script>

<style lang="scss">

@import "~@/assets/scss/vendors/bootstrap-vue/index";
@import "~@/assets/scss/app.scss";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
