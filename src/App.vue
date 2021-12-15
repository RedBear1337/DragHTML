<template>
  <div id="app">


    <!-- Main content -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "app",
  components: {},
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
  //font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
