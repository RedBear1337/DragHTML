<template>
  <div class="elist">
    <div class="elist__header">
      <h1 class="elist__title">ELEMENTS</h1>
      <div class="elist__actions">
        <customBtn class="elist__btn" :short="true" :data="{img: 'add', alt: '+', func: this.addNew}"/>
        <!-- Заменить content: cont на список стилей для элементов -->
        <!-- <dropBtn class="elist__btn" :ops="{store: 'eList', placeholder: 'Style', content: cont}" /> -->
      </div>
    </div>
    <div class="elist__content">
      <eItem :item="item" :index="index" :key="item.id" v-for="(item, index) in content"/>
    </div>
  </div>
</template>

<script>
import electron from "electron";
import dropBtn from "@/components/dropBtn";
import customBtn from "@/components/customBtn";
import eItem from './eItem';

export default {
  name: "eList",
  components: {dropBtn, customBtn, eItem},
  data() {
    return {

    }
  },
  methods: {
    /**
     * Открывает окно добавления нового элемента
     */
    addNew() {
      // let answer = electron.ipcRenderer.send('fileOperations', {action: 'write'})
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
          style: list[key].style,
          defaultSize: list[key].defaultSize
        })
      }
      return arr;
    }
  },
  watch: {},
  mounted() {
    // for (let i = 1; i<21;i++) {
    //   this.cont.push(i);
    // }
  }
}
</script>

<style lang="scss">

.elist {
  z-index: 0;
  display: flex;
  flex-flow: column;
  width: 100%;
  max-width: 228px;
  height: 100vh;

  &__header {
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: flex-start;
    max-height: 58px;
  }

  &__title {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 25px;
  }
  
  &__actions {
    display: flex;
    flex-flow: row;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
    padding: 0 8px 5px;
  }

  &__btn {

  }

  &__content {
    display: flex;
    flex-flow: column;
    //height: calc(100vh);
    height: 100%;
    overflow-y: auto;
    padding: 16px 6px;
  }
}
</style>