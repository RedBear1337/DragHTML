<template>
  <list/>
</template>

<script>
import electron from "electron";

import list from '../components/elemlist/list'
export default {
  name: "mainPage",
  components: {list},
  data() {
    return {}
  },
  methods: {},
  computed: {},
  watch: {},
  mounted: async function () {
    let elementsList = await electron.ipcRenderer.invoke('get', {action: 'getElementList'});
    let stylesList = await electron.ipcRenderer.invoke('get', {action: 'getStylesList'});
    this.$store.commit('setElementsList', elementsList);
  }
}
</script>

<style lang="scss">

</style>