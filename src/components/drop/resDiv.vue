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
    changeCalc(e, rect, type) {
      const elem = this.$el;
      switch (type) {
        case 'wl':
          const widthL = Math.round(rect.width + (this.posX - e.x));
          return widthL;
        case 'wr':
          const widthR = Math.round(rect.width - (this.posX - e.x));
          return widthR;
        case 'ht':
          const heightT = Math.round(rect.height + (this.posY - e.y));
          return heightT;
        case 'hb':
          const heightB = Math.round(rect.height - (this.posY - e.y));
          return heightB;
        case 't':
          const top = Math.round(elem.offsetTop - (this.posY - e.y));
          return top;
        case 'b':
          let offsetBottom = elem.offsetParent.offsetHeight - elem.offsetHeight - elem.offsetTop;
          const bottom = Math.round(offsetBottom + (this.posY - e.y));
          return bottom;
        case 'l':
          const left = elem.offsetLeft - (this.posX - e.x);
          return left;
        case 'r':
          const offsetRight = elem.offsetParent.offsetWidth - elem.offsetWidth - elem.offsetLeft;
          const right = Math.round(offsetRight + (this.posX - e.x));
          return right;
      }
    },
    setCalcStylePos(e, type) {
      const elem = this.$el;
      const rect = elem.getBoundingClientRect();
      const style = elem.style;

      if (type[0] === 't' && this.changeCalc(e, rect, 't') > 0 && this.changeCalc(e, rect, 'ht') > this.minH) {
        style.height = this.changeCalc(e, rect, 'ht') + 'px';
        style.top = this.changeCalc(e, rect, 't') + 'px';
      }
      if (type[0] === 'b' && this.changeCalc(e, rect, 'b') >= 0 && this.changeCalc(e, rect, 'hb') > this.minH) {
        style.height = this.changeCalc(e, rect, 'hb') + 'px';
      }
      if (type[1]=== 'm') {
        return
      }
      if (type[1] === 'l' && this.changeCalc(e, rect, 'l') > 0 && this.changeCalc(e, rect, 'wl') > this.minW) {
        style.width = this.changeCalc(e, rect, 'wl') + 'px';
        style.left = this.changeCalc(e, rect, 'l') + 'px';
      }
      if (type[1] === 'r' && this.changeCalc(e, rect, 'r') >= 0 && this.changeCalc(e, rect, 'wr') > this.minW) {
        style.width = this.changeCalc(e, rect, 'wr') + 'px';
      }
    },
    /**
     * Resize start
     * @param e
     */
    handleDown(e) {
      e.preventDefault()
      this.curHandler = e.target.classList[1];

      // this.posX = e.clientX;
      // this.posY = e.clientY;
      this.posX = e.x;
      this.posY = e.y;
      document.addEventListener('mousemove', this.handleOn)
      document.addEventListener('mouseup', this.handleCancel)
    },
    /**
     * Resize func
     * @param e
     */
    handleOn(e) {
      e.preventDefault()

      this.setCalcStylePos(e, this.curHandler);

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