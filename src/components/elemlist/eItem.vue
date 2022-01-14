<template>
  <div :id="'eitem'+index" class="eitem"
       draggable="true"
       @dragstart="dragStart($event)"
       @dragend="dragEnd($event)">
    <div class="eitem__nameblock">
      <span class="eitem__title">{{ title }}</span>
    </div>
  </div>
</template>

<script>

export default {
  name: "item",
  components: {},
  props: ['item', 'index'],
  data() {
    return {
      title: this.item.title,
      html: this.item.html,
      style: this.item.style,
      defaultSize: this.item.defaultSize,

      dragged: '',
    }
  },
  methods: {
    /**
     * Рассчитывает центральную позицию элемента на который указывает event.target
     * @param event
     * @returns {{w: number, h: number}}
     */
    getTargetSize(event) {
      let w = window.getComputedStyle(event.target, null).width;
      let h = window.getComputedStyle(event.target, null).height;

      if (isNaN(w) || isNaN(h)) {
        let numW = parseInt(w);
        let numH = parseInt(h);

        w = w === 'auto' ? 100 : numW;
        h = h === 'auto' ? 100 : numH;
      }

      return {w: Math.round(w / 2), h: Math.round(h / 2)};
    },
    dragStart(event) {
      this.dragged = event.target;
      this.dragged.style.backgroundColor = "red";

      let imgSize = this.getTargetSize(event);

      event.dataTransfer.dropEffect = 'copy';
      event.dataTransfer.effectAllowed = 'copy';
      event.dataTransfer.setDragImage(event.target, imgSize.w, imgSize.h);

      // prepare - нужна ли подготовка передаваемых значений при вставке
      event.dataTransfer.setData('prepare', true);
      event.dataTransfer.setData('title', this.title.trim());
      event.dataTransfer.setData('html', this.html.trim());
      event.dataTransfer.setData('style', this.style.trim());
      event.dataTransfer.setData('defaultSize', this.defaultSize);

      this.$store.commit('setDataTransfer', {
        prepare: true,
        title: this.title.trim(),
        html: this.html.trim(),
        style: this.style.trim(),
        defaultSize: this.defaultSize
      });
      this.$store.commit('setShowState', {name: 'showElemBorders', state: true});
    },
    dragEnd(event) {
      this.dragged = event.target;
      this.dragged.style.backgroundColor = "";
      this.$store.commit('setShowState', {name: 'showElemBorders', state: false});
    },
  },
  computed: {},
  watch: {},
  mounted() {
    
  }
}
</script>

<style lang="scss">
.eitem {
  z-index: 1;
  display: flex;
  flex-flow: row;
  align-items: center;
  height: 34px;
  margin-bottom: 10px;
  cursor: grab;

  &__nameblock {
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex: 0 1 40%;
    height: 100%;
    padding-left: 6px;
  }

  &__title {
    width: 100%;
    color: #000000;
    text-align: left;
    font-size: 14px;
  }
}
</style>