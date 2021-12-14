<template>
  <div :id="'eitem'+index" class="eitem"
       draggable="true"
       @dragstart="dragStart($event)"
  @dragend="dragEnd($event)">
    <div class="eitem__nameblock">
      <span class="eitem__title">{{title}}</span>
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

      dragged: '',
    }
  },
  methods: {
    dragStart(event) {
      this.dragged = event.target;
      console.log('event.target', event.target);
      this.dragged.style.backgroundColor = "red";
      event.dataTransfer.dropEffect = 'copy';
      event.dataTransfer.effectAllowed = 'copy';

      event.dataTransfer.setData('title', this.title.trim());
      event.dataTransfer.setData('html', this.html.trim());
      event.dataTransfer.setData('style', this.style.trim());
    },
    dragEnd(event) {
      this.dragged = event.target;
      this.dragged.style.backgroundColor = "";
    },
    // elemCreate(htmlCode) {
    //   let div = document.createElement('div');
    //   div.innerHTML = htmlCode.trim();
    //
    //   // Change this to div.childNodes to support multiple top-level nodes
    //   return div.firstChild;
    // },
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