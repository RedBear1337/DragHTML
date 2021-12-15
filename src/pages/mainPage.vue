<template>
  <div class="mainPage">
    <eList/>
    <workSpace/>
  </div>
</template>

<script>
import electron from "electron";

import eList from "@/components/elemlist/eList"
import workSpace from "@/layouts/workSpace";

export default {
  name: "mainPage",
  components: {eList, workSpace},
  data() {
    return {}
  },
  methods: {},
  computed: {},
  watch: {},
  mounted: async function () {
    //**** Закоменчено на время тестов

    // let elementsList = await electron.ipcRenderer.invoke('get', {action: 'getElementsList'});
    // let stylesList = await electron.ipcRenderer.invoke('get', {action: 'getStylesList'});
    // this.$store.commit('setElementsList', elementsList);
    // this.$store.commit('setStylesList', stylesList);
  }
}
</script>

<style lang="scss">
.mainPage {
  display: flex;
  flex-flow: row;
  align-items: flex-start;
  justify-content: flex-start;
  height: 100vh;
  overflow-x: hidden;
}
</style>