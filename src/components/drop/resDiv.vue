<template>
  <div class="resize" style="width: 100px; height: 100px">
    <div ref="handlers" class="resize__handlers">
      <div class="resize__handler tl"/>
      <div class="resize__handler tm"/>
      <div class="resize__handler tr"/>
      <div class="resize__handler mr"/>
      <div class="resize__handler br"/>
      <div class="resize__handler bm"/>
      <div class="resize__handler bl"/>
      <div class="resize__handler ml"/>
    </div>
  </div>
</template>

<script>

export default {
  name: "resDiv",
  components: {},
  data() {
    return {
      parentSize: {},
      minW: 30,
      minH: 30,
      posX: 0,
      posY: 0,

      curHandler: 'tl',

      isHandle: false,
    }
  },
  methods: {
    /**
     * Resize start
     * @param e
     */
    handleDown(e) {
      e.preventDefault()
      this.curHandler = e.target.classList[1];

      this.posX = e.clientX;
      this.posY = e.clientY;
      document.addEventListener('mousemove', this.handleOn)
      document.addEventListener('mouseup', this.handleCancel)
    },
    /**
     * Resize func
     * @param e
     */
    handleOn(e) {
      e.preventDefault()
      const elem = this.$el;
      const rect = elem.getBoundingClientRect();
      const style = elem.style;
      const width = getComputedStyle(elem).width;
      const height = getComputedStyle(elem).height;
      console.log(rect.bottom - e.y);
      switch (this.curHandler) {
        case 'tl'://+
          if (Math.round(rect.width + (this.posX - e.clientX)) > this.minW && (elem.offsetLeft - (this.posX - e.clientX)) > 0) {
            style.width = Math.round(rect.width + (this.posX - e.clientX)) + 'px';
            style.left = Math.round(elem.offsetLeft - (this.posX - e.clientX)) + 'px';
          }
          if (Math.round(rect.height + (this.posY - e.clientY)) > this.minH && (elem.offsetTop - (this.posY - e.clientY)) > 0) {
            style.height = Math.round(rect.height + (this.posY - e.clientY)) + 'px';
            style.top = Math.round(elem.offsetTop - (this.posY - e.clientY)) + 'px';
          }
          break
        case 'tm'://+
          if (Math.round(rect.height + (this.posY - e.clientY)) > this.minH && elem.offsetTop - (this.posY - e.clientY) >= 0) {
            style.height = Math.round(rect.height + (this.posY - e.clientY)) + 'px';
            style.top = Math.round(elem.offsetTop - (this.posY - e.clientY)) + 'px';
          }
          break
        case 'tr'://-
          if (Math.round(rect.width + (this.posX - e.clientX)) > this.minW && elem.offsetLeft - (this.posX - e.clientX) >= 0) {
            style.width = Math.round(rect.width - (this.posX - e.clientX)) + 'px';
          }
          if (Math.round(rect.height + (this.posY - e.clientY)) > this.minH && elem.offsetTop - (this.posY - e.clientY) >= 0) {
            style.height = Math.round(rect.height + (this.posY - e.clientY)) + 'px';
            style.top = Math.round(elem.offsetTop - (this.posY - e.clientY)) + 'px';
          }
          break
        case 'mr'://-
          if (Math.round(rect.width + (this.posX - e.clientX)) > this.minW && elem.offsetLeft - (this.posX - e.clientX)) {
            style.width = Math.round(rect.width - (this.posX - e.clientX)) + 'px';
          }
          break
        case 'br'://-
          if (Math.round(rect.width + (this.posX - e.clientX)) > this.minW) {
            style.width = Math.round(rect.width - (this.posX - e.clientX)) + 'px';
          }
          if (Math.round(rect.height + (this.posY - e.clientY)) > this.minH) {
            style.height = Math.round(rect.height - (this.posY - e.clientY)) + 'px';
          }
          break
        case 'bm'://-
          if (Math.round(rect.height + (this.posY - e.clientY)) > this.minH) {
            style.height = Math.round(rect.height - (this.posY - e.clientY)) + 'px';
          }
          break
        case 'bl'://-
          if (Math.round(rect.height + (this.posY - e.clientY)) > this.minH && elem.offsetTop >= 0) {
            style.height = Math.round(rect.height - (this.posY - e.clientY)) + 'px';
          }
          if (Math.round(rect.width + (this.posX - e.clientX)) > this.minW && elem.offsetLeft - (this.posX - e.clientX) >= 0) {
            style.width = Math.round(rect.width + (this.posX - e.clientX)) + 'px';
            style.left = Math.round(elem.offsetLeft - (this.posX - e.clientX)) + 'px';
          }
          break
        case 'ml'://+
          if (Math.round(rect.width + (this.posX - e.clientX)) > this.minW && elem.offsetLeft - (this.posX - e.clientX) >= 0) {
            style.width = Math.round(rect.width + (this.posX - e.clientX)) + 'px';
            style.left = Math.round(elem.offsetLeft - (this.posX - e.clientX)) + 'px';
          }
          break
      }

      this.posX = e.clientX;
      this.posY = e.clientY;
    },
    /**
     * Resize cancel
     * @param e
     */
    handleCancel(e) {
      document.removeEventListener('mousemove', this.handleOn)
      document.removeEventListener('mouseup', this.handleCancel)
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.parentSize = {w: this.$el.parentNode.offsetWidth, h: this.$el.parentNode.offsetHeight};

    const handlers = this.$refs.handlers.childNodes;
    for (let handler of handlers) {
      handler.addEventListener('mousedown', this.handleDown)
    }
  }
}
</script>

<style lang="scss">
.resize {
  position: absolute;
  top: 20px;
  left: 20px;
  background: black;

  &__handlers {
    position: relative;
    width: 100%;
    height: 100%;
  }

  &__handler {
    position: absolute;
    width: 10px;
    height: 10px;
    background: red;

    &.tl {
      top: 0;
      left: 0;
      cursor: nw-resize;
    }

    &.tm {
      top: 0;
      right: 50%;
      transform: translateX(50%);
      cursor: n-resize;
    }

    &.tr {
      top: 0;
      right: 0;
      cursor: ne-resize;
    }

    &.mr {
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      cursor: e-resize;
    }

    &.br {
      bottom: 0;
      right: 0;
      cursor: se-resize;
    }

    &.bm {
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      cursor: s-resize;
    }

    &.bl {
      bottom: 0;
      left: 0;
      cursor: sw-resize;
    }

    &.ml {
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      cursor: w-resize;
    }

  }
}
</style>