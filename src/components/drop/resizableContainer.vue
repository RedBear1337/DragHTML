<template>
  <vue-draggable-resizable class-name="resizableContainer"
                           class-name-draggable="--dragMe"
                           :min-width="mw"
                           :min-height="mh"
                           :x="this.pos.x"
                           :y="this.pos.y"
                           :w="this.size.w"
                           :h="this.size.h"
                           :onDragStart="onDragStart"
                           @activated="showBorders(true)"
                           @deactivated="showBorders(false)"
                           @dragstop="onDragStop" @resizestop="onResizeStop"
                           :parent="true"
                           :grid="[5,5]">
    <slot name="innerNode"/>
  </vue-draggable-resizable>
</template>

<script>

export default {
  name: "resizableContainer",
  components: {},
  props: ['zone', 'title', 'pos', 'size'],
  data() {
    return {
      ready: false,

      child: '',
      id: '',
      x: 0,
      y: 0,
      w: 0,
      h: 0
    }
  },
  methods: {
    showBorders(boolean) {
      this.$store.commit('setShowState', {name: 'showElemBorders', state: boolean});
    },
    isCollide(a, b) {
      return !(
          ((a.y + a.h) < (b.y)) ||
          (a.y > (b.y + b.h)) ||
          ((a.x + a.w) < b.x) ||
          (a.x > (b.x + b.w))
      );
    },
    /**
     *
     * @param obj - размещаемый объект
     * @param obj.title - название размещаемого объекта
     * @param obj.id - номер размещаемого объекта
     * @param obj.x - координата from left
     * @param obj.y - координата from top
     * @param obj.w - шир
     * @param obj.h - выс
     */
    checkPlaceFreedom(obj) {
      let result = false;
      let allElements = this.elements;
      let keys = Object.keys(allElements);
      for (let titleCount = 0; titleCount < keys.length; titleCount++) {
        let checkElements = allElements[keys[titleCount]].filter(elem=>elem !== this.currentElem);
         for (let elemCount = 0; elemCount < checkElements.length; elemCount++) {
           let checkObj = checkElements[elemCount];
           checkObj.title = keys[titleCount];
           console.log(`obj: ${obj.title} | ${obj.id} => check: ${checkObj.title} | ${checkObj.id}`);
           console.log(`x1: ${obj.x}, y1: ${obj.y} => x2: ${checkObj.x}, y2: ${checkObj.y}`);
             let result = this.isCollide(obj, checkObj);
             if (result) {
               console.log('Столкновение!');
               return result
             }
           // console.log(`title: ${obj.title} id: ${obj.id}`);
         }
      }
      return result;
    },
    onResizeStop(x, y, w, h) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.$store.commit('setCoords', {
        zone: this.zone,
        title: this.title,
        id: this.id,
        x: x,
        y: y
      });
      this.$store.commit('setSize', {
        zone: this.zone,
        title: this.title,
        id: this.id,
        w: w,
        h: h
      });
    },
    onDragStart() {
      console.log(1);
      this.$store.commit('saveOnMove', this.currentElem);
    },
    onDragStop(x, y) {
      let collide = false;
      const curElem = {title: this.title, id: this.id, x: x, y: y, w: this.w, h: this.h};
      if (Object.keys(this.elements).length > 1 || this.elemTitle.length > 1) {
        collide = this.checkPlaceFreedom(curElem);
      }
      if (!collide) {
        console.log('Перетаскивание успешно');
        console.log(2);
        this.$store.commit('saveOnMove', this.currentElem);
        this.x = x;
        this.y = y;
        this.$store.commit('setCoords', {
          zone: this.zone,
          title: this.title,
          id: this.id,
          x: x,
          y: y
        });
      } else {
        // console.log('last', this.$store.getters.getLastMove);
        // let lastState = this.$store.getters.getLastMove;
        // console.log('before',this.$el.__vue__);
        // this.$store.commit('replaceElem', {this});
        this.$el.__vue__.left = this.currentElem.x;
        this.$el.__vue__.top = this.currentElem.y;

        // this.$el.__vue__.height = this.currentElem.h;
        // this.h = this.currentElem.h;
        // this.$el.__vue__.width = this.currentElem.w;
        // this.w = this.currentElem.w;
        // console.log('after',this.$el.__vue__);
        // this.$el.__vue__.style.height = this.currentElem.h + 'px';
        // this.$el.__vue__.style.width = this.currentElem.w + 'px';

        // this.$el.__vue__.x = 0;
        // this.$el.__vue__.y = this.currentElem.y;
        console.log('Отмена перетаскивания');
      }
    },
  },
  computed: {
    elements() {
      return this.$store.getters.getZones[this.zone].elements;
    },
    elemTitle() {
      return this.elements[this.title];
    },
    currentElem() {
      return this.elemTitle.find(item => item.id == this.id);
    },
    xx() {
      return this.currentElem.x
    },
    yy() {
      return this.currentElem.y
    },
    mw() {
      return this.currentElem.mw
    },
    ww() {
      return this.currentElem.w
    },
    mh() {
      return this.currentElem.mh
    },
    hh() {
      return this.currentElem.h
    },
  },
  watch: {},
  mounted() {
    this.child = this.$el.lastChild;
    // this.title = this.child.title;
    this.id = this.child.id.replace(this.title, '');

    // this.$el.__vue__.width - width
    // this.$el.__vue__.height - height
    // this.$el.__vue__.left - x
    // this.$el.__vue__.top - y

    // this.$el.__vue__.computedHeight
    // this.$el.__vue__.computedWidth
    // this.$el.__vue__.height
    // this.$el.__vue__.width
    // this.$el.__vue__.style.height
    // this.$el.__vue__.style.width
    // this.$el.__vue__.left
    // this.$el.__vue__.top

    // setInterval(()=>{
    //   console.log('el', this.$el.__vue__);
    // }, 2000)
  }
}
</script>

<style lang="scss">
.vdr {
  border: none;
}

// Resize Handlers
// Left
.handle-tl, .handle-ml, .handle-bl {
  left: 0;
}

// Right
.handle-tr, .handle-mr, .handle-br {
  right: 0;
}

// Top
.handle-tm, .handle-tl, .handle-tr {
  top: 0;
}

// Bottom
.handle-bm, .handle-bl, .handle-br {
  bottom: 0;
}

.resizableContainer {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>