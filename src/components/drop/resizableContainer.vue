<template>
  <vue-draggable-resizable class-name="resizableContainer"
                           class-name-draggable="--dragMe"
                           :min-width="minWidth"
                           :min-height="minHeight"
                           :w="width"
                           :h="height"
                           :x="this.pos.x"
                           :y="this.pos.y"
                           @dragging="onDrag" @resizing="onResize"
                           @resizestop="resizeStart"
                           :parent="true"
                           :grid="[5,5]">
    <slot name="innerNode"/>
  </vue-draggable-resizable>
</template>

<script>

export default {
  name: "resizableContainer",
  components: {},
  props: ['pos'],
  data() {
    return {
      minWidth: 0,
      minHeight: 0,
      width: 100,
      height: 100,
      x: 0,
      y: 0,

      child: '',
      title: '',
      id: '',

      dropZone: ''

    }
  },
  methods: {
    resizeStart(x, y) {
      if (this.width < this.minWidth) {
        // console.log('1');
        this.x = x;
        this.y = y;
        this.width = this.minWidth;
        return
      }
      if (this.height < this.minHeight) {
        // console.log('2');
        this.x = x;
        this.y = y;
        this.height = this.minHeight;
        return
      }
    },
    onResize: function (x, y, width, height) {
      this.x = x
      this.y = y
      if (this.width < this.minWidth) {
        // console.log('1');
        this.width = this.minWidth;
        return
      } else {
        this.width = width
      }
      if (this.height < this.minHeight) {
        // console.log('2');
        this.height = this.minHeight;
        return
      } else {
        this.height = height
      }
      this.minWidth = Math.round(this.child.getBoundingClientRect().width);
      this.minHeight = Math.round(this.child.getBoundingClientRect().height);
    },
    onDrag: function (x, y) {
      this.x = x
      this.y = y
    }
  },
  computed: {
    element() {
      // let zones = this.$store.getters.getElements;
      // console.log('a', zones);
      let a = 1;
      // let a = zones[this.dropZone]
      return a;
    },
  },
  watch: {
    element(value) {
      // console.log('e', value);
    }
  },
  mounted() {
    this.child = this.$el.lastChild;
    this.title = this.child.title;
    this.id = this.child.id.replace(this.title, '');

    this.dropZone = this.child.parentNode.parentNode.id;
    //
    // this.$store.commit('setShowState', {name: 'l', state: true});
    // console.log(this.$store.getters.getL);

    this.minWidth = Math.round(this.child.getBoundingClientRect().width);
    this.minHeight = Math.round(this.child.getBoundingClientRect().height);
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