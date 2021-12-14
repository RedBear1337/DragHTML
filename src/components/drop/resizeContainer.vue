<template>
  <VueResizable ref="vr" class="resizeContainer"
                :min-width="minWidth" :min-height="minHeight"
                :width="width" :height="height"
                fit-parent drag-selector=".--dragMe">
    <slot name="innerNode"/>
  </VueResizable>
</template>

<script>
import VueResizable from 'vue-resizable'

export default {
  name: "resizeContainer",
  components: {VueResizable},
  props: ['node', 'size'],
  data() {
    return {
      update: 0,
    }
  },
  methods: {},
  computed: {
    height() {
      if (this.update>=0) {
        if (this.size.h === 'auto') {
          return 62;
        } else {
          return this.size.h
        }
      }
    },
    width() {
      if (this.update>=0) {
        if (this.size.w === 'auto') {
          return 62;
        } else {
          return this.size.w
        }
      }
    },
    minHeight() {
      if (this.size.h === 'auto') {
        return 32;
      } else {
        return this.size.h / 2
      }
    },
    minWidth() {
      return this.width/2
    }
  },
  watch: {},
  mounted() {
    this.update++;
  },
}
</script>

<style lang="scss">
.resizeContainer {
  -webkit-user-select: none;
  z-index: 1;
  position: absolute !important;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.33);
  cursor: grabbing;
}
</style>