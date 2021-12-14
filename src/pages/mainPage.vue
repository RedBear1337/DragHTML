<template>
  <div class="mainPage">
    <dropZone :size="{w:'100%',h:'200px'}" :id="1"/>
    <list v-show="IsElementsListShow"/>
  </div>
</template>

<script>
import electron from "electron";

import list from '../components/elemlist/list'
import dropZone from "@/components/drop/dropZone";
export default {
  name: "mainPage",
  components: {list, dropZone},
  data() {
    return {}
  },
  methods: {},
  computed: {
    IsElementsListShow() {
      return this.$store.getters.getIsElementsListShow;
    },
  },
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
  position: relative;
  display: flex;
  flex-flow: column;
  align-items: flex-end;
  justify-content: flex-start;
  height: calc(100vh - 58px);
  overflow-x: hidden;
}
</style>