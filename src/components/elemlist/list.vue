<template>
  <div class="elist">
    <div class="elist__header">
      <h1 class="elist__title">ELEMENTS</h1>
      <customBtn class="elist__btn" :data="{message: 'Add new', func: this.addNew}"/>
      <v-select :label="'Placeholder'" :options="['Canada', 'United States']"></v-select>
    </div>
    <div class="elist__content">
      <item :item="item" :index="index" :key="item.id" v-for="(item, index) in content"/>
    </div>
  </div>
</template>

<script>
import electron from "electron";
import customBtn from "@/components/customBtn";
import item from './item';

export default {
  name: "list",
  components: {customBtn, item},
  data() {
    return {}
  },
  methods: {
    /**
     * Открывает окно добавления нового элемента
     */
    addNew() {
      // let answer = electron.ipcRenderer.invoke('write', {action: 'writeElementsList'})
      // if (answer) {
      //   this.$store.commit('addElement', );
      // }
    },

  },
  computed: {
    elementsList() {
      return this.$store.getters.getElements;
    },
    stylesList() {
      return this.$store.getters.getStyles;
    },
    content() {
      let list = this.elementsList;
      let keys = Object.keys(list);
      let arr = [];
      for (let key of keys) {
        arr.push({
          title: key,
          html: list[key].htmlCode,
          style: list[key].style
        })
      }
      return arr;
    }
  },
  watch: {},
  mounted() {

  }
}
</script>

<style lang="scss">
.elist {
  z-index: 2;
  position: absolute;
  display: flex;
  flex-flow: column;
  width: 358px;

  &__header {
    -webkit-user-select: none;
    display: flex;
    flex-flow: row;
    align-items: center;
  }

  &__title {

  }

  &__btn {

  }

  &__content {
    display: flex;
    flex-flow: column;
    height: 432px;
    max-height: 432px;
    overflow-y: auto;
    padding: 16px 6px;
  }
}
</style>