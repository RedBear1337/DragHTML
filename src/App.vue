<template>
  <div id="app">
    <!-- Main content -->
<!--    <settings/>-->
    <modalBackground :type="'blur'">
      <welcome slot="win"/>
    </modalBackground>
    <router-view/>
  </div>
</template>

<script>
import modalBackground from "./components/modal/modalBackground";
import settings from "./components/header/settings";
import welcome from "./layouts/welcome";

export default {
  name: "app",
  components: {modalBackground, settings, welcome},
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
  -webkit-user-select: none;
  //font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
