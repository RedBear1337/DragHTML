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
      <button type="button" class="headerBar__btn" @click="hideWin">
        <span class="headerBar__text">Take a pic</span>
      </button>
      <button type="button" class="headerBar__btn" >
        <span class="headerBar__text">Take a pic</span>
      </button>
    </div>
  </section>
</template>

<script>
import electron from "electron";

export default {
  name: "headerBar",
  components: {},
  data: function () {
    return {
    }
  },
  methods: {
    hideWin() {
      electron.ipcRenderer.send('service-events', {action: 'hide-win'});
    },
    closeWin() {
      this.$store.commit('setMenuShow', false)
      electron.ipcRenderer.send('service-events', {action: 'close-win'});
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

  }

  &__btn {
    font-family: Reem Kufi;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 1.3;
    letter-spacing: 0.1em;

    border-radius: 0;
    &:first-of-type {
      border: solid #000000;
      border-width: 0 0 1px 0;
    }
    &:last-of-type {
      border: 1px solid #000000;
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