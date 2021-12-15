<template>
  <button type='button' @click="setSelected('')">
  <v-select class="vSelect" :placeholder="ops.placeholder" :value="getSelected" @input="setSelected;" v-model="selected" :options="ops.content">

  </v-select>
  </button>
</template>

<script>

export default {
  name: "dropBtn",
  components: {},
  props: ['ops'],
  data() {
    return {
      selected: '',
    }
  },
  methods: {
    /**
     * Устанавливает текущее значение для выпадающего списка.
     * @param {Object | String} selected
     */
    setSelected(selected) {
      console.log('commit', selected);
      this.selected = selected;
      if (!!this.ops.store) {
        this.$store.commit('setSelected', {name: this.ops.store, selected: selected });
      }
    }
  },
  computed: {
    selectedArr() {
      return this.$store.getters.getSelectedArray;
    },
    getSelected() {
      if (!!this.ops.store && !!this.selectedArr[this.ops.store]) {
        return this.selectedArr[this.ops.store].selected;
      } else if (!!this.selected) return this.selected
      else return '1'
    }
  },
  watch: {
    // Добавить отслеживание тыка по предмету дроп листа, либо ввод в инпут. И обнулять значение selected
  },
  mounted() {

  }
}
</script>

<style lang="scss">
@import "~@/assets/scss/app.scss";

.vSelect {
  position: relative;
  .vs__dropdown-toggle {
    display: flex;
    flex-flow: row;
    padding: 0 12px;
    border: 1px solid black;
    max-width: 176px;
    max-height: 28px;
    .vs__selected-options {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      max-width: 176px;
      height: $btn-height;

      & > input {
        //position: absolute;
        z-index: 1;
        width: 176px;
        height: $btn-height;
      }
      // Span
      .vs__selected {
        z-index: 0;
        //transform: translateX(20px);
        position: relative;
        left: 16px;
      }
      // Строка поиска
      .vs__search {
        padding: 0 6px;
      }

    }
  }
  .vs--single .vs--searchable {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  // Тело списка
  .vs__dropdown-menu {
    z-index: 1000;
    position: absolute;
    display: flex;
    flex-flow: column;
    align-items: flex-start;
    justify-content: flex-start;
    text-align: left;
    padding: 10px;
    width: 100%;
    max-width: 176px;
    max-height: 260px;
    overflow-y: auto;
  }
  // Элемент списка
  .vs__dropdown-option {
    width: 100%;
    padding: 5px 5px 2px;
    border-bottom: 1px solid black;

    &:hover {
      background: rgba(0, 0, 0, 0.10);
    }
  }
  // Значки действий
  .vs__actions {
    z-index: 2;
    position: absolute;
    right: 14px;
    display: flex;
    flex-flow: row;
    align-items: center;
    flex-wrap: nowrap;
    height: 100%;
  }
  .vs__open-indicator {
    cursor: pointer;
  }
  .vs__clear {
    position: relative;
    bottom: 1px;
    margin-right: 5px;
  }
}
</style>