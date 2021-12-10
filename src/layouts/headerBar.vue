<template>
  <section class="headerBar">
    <button class="headerBar__control" @click="closeWin">
      <img src="" alt="X" class="iconBtn">
    </button>

    <!-- Title -->
    <span class="headerBar__title">
    HTML DRAG
  </span>
    <div class="headerBar__actions">
      <customBtn class="headerBar__btn" :data="{message: 'Take a pic'}" />
      <customBtn class="headerBar__btn" :data="{message: 'Open list'}" />
    </div>
  </section>
</template>

<script>
import electron from "electron";

import customBtn from "@/components/customBtn";

export default {
  name: "headerBar",
  components: {customBtn},
  data: function () {
    return {
    }
  },
  methods: {
    hideWin() {
      electron.ipcRenderer.send('service', {action: 'hide-win'});
    },
    closeWin() {
      electron.ipcRenderer.send('service', {action: 'close-win'});
    },
  },
  computed: {

  },
  watch: {
  },
  mounted() {

  },
}
</script>

<style lang="scss">
.headerBar {
  // test
  color: white !important;
  border: 1px solid red;
  // test

  position: relative;
  -webkit-app-region: drag;
  z-index: 9999;
  display: flex;
  flex-flow: row;

  justify-content: space-between;
  align-items: center;
  padding: 0px 18px;
  height: 58px;
  width: 100%;

  &__title {
    //position: absolute;
    //left: 50%;
    //transform: translate(-50%);
    font-style: normal;
    font-weight: 500;
    font-size: 2vw;
    line-height: 1.5;
  }

  &__control {
    display: flex;
    justify-content: space-between;
    align-items: center;
    //width: 58px;
    .iconBtn {
      margin-left: 27px;

      &:first-child {
        margin-left: 0;
      }
    }
  }

  &__actions {
    -webkit-app-region: none;
    display: flex;
    flex-flow: row;
    align-items: center;
  }

  &__btn {
    -webkit-app-region: none;
    z-index: 1000;
    margin-left: 16px;
    &:first-of-type {
      margin-left: 0;
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