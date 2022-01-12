<template>
  <section class="headerBar">
    <!-- Sub Actions -->
    <div class="headerBar__actions">
      <div class="headerBar__group">
        <customBtn class="headerBar__btn" :short="true" :data="{img: 'settings', alt: 'Conf', func: ''}"/>
        <customBtn class="headerBar__btn short" :short="true"
                   :data="{img: 'dropZone', alt: 'addZone', func: this.addZone}"/>
      </div>
      <journalNav class="headerBar__group"/>
    </div>
    <!-- Title -->
    <span class="headerBar__title">
    HTML DRAG
    </span>
    <!-- Main Actions -->
    <div class="headerBar__actions">
      <customBtn class="headerBar__btn" :type="'underline'" :data="{message: 'Take a pic'}"/>
      <customBtn class="headerBar__btn" :type="'squared'" :data="{message: 'Export', func: this.exportTemplate}"/>
    </div>
    <button class="headerBar__control" @click="closeWin">
      <img src="../assets/svg/close.svg" alt="X" class="iconBtn">
    </button>
  </section>
</template>

<script>
import electron from "electron";

import customBtn from "@/components/customBtn";
import journalNav from "@/components/header/journalNav";

export default {
  name: "headerBar",
  components: {customBtn, journalNav},
  data: function () {
    return {
      exportData: {}
    }
  },
  methods: {
    hideWin() {
      electron.ipcRenderer.send('window', {action: 'hide-win'});
    },
    closeWin() {
      electron.ipcRenderer.send('window', {action: 'close-win'});
    },

    addZone() {
      let zones = this.$store.getters.getZones;
      this.$store.commit('addZone', {name: 'zone' + (zones.length + 1), y: 0, height: 200});
    },

    async exportTemplate() {
      this.exportData = await electron.ipcRenderer.invoke('gett', {action: 'getMustache'});
      
      await electron.ipcRenderer.send('fileOperations', {action: 'write', fileName: 'mustacheData', format: 'json', data: JSON.stringify(this.exportData)})
      console.log('exportData', this.exportData);
    }
  },
  computed: {},
  watch: {},
  mounted() {
    electron.ipcRenderer.on('service', (event, arg)=>{
      switch (arg.action) {
        case 'export-template':
          console.log('data',arg.data);
      }
    })
  },
}
</script>

<style lang="scss">
.headerBar {
  border-left: 1px rgba(0, 0, 0, 0.5) solid;
  position: relative;
  -webkit-app-region: drag;
  z-index: 9999;
  display: flex;
  flex-flow: row;

  justify-content: space-between;
  align-items: flex-end;
  padding: 0px 18px 5px 9px;
  min-height: 58px;
  max-height: 58px;
  width: 100%;

  &__title {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-style: normal;
    font-weight: 500;
    font-size: 2vw;
    line-height: 1.5;
  }

  &__control {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    //width: 58px;
    .iconBtn {
      width: 18px;
      height: 18px;

      &:first-child {
        margin-left: 0;
      }
    }
  }

  &__group {
    display: flex;
    flex-flow: row;
    justify-content: flex-start;
    align-items: flex-start;
    margin-right: 18px;

    &:last-of-type {
      margin-right: 0;
    }
  }

  &__actions {
    display: flex;
    flex-flow: row;
    align-items: center;

    flex: 0 0 50%;

    &:first-of-type {
      justify-content: flex-start;
    }

    &:last-of-type {
      justify-content: flex-end;
    }
  }

  &__btn {
    -webkit-app-region: none;
    z-index: 1000;
    margin-left: 16px;

    &:first-of-type {
      margin-left: 0;
    }

    &.short {
      margin-left: 9px;
    }
  }

}

.iconBtn {
  -webkit-app-region: none;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
}


</style>