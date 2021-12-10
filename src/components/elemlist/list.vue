<template>
<div class="elist">
  <div class="elist__header">
    <h1 class="elist__title">ELEMENTS</h1>
    <customBtn class="elist__btn" :data="{message: 'Add new', func: addNew}"/>
    <v-select :label="'Placeholder'" :options="['Canada', 'United States']"></v-select>
  </div>
  <div class="elist__content">
    <item/>
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
    addNew() {
      console.log('new');
    }
  },
  computed: {},
  watch: {},
  mounted() {

  }
}
</script>

<style lang="scss">
.elist {
  display: flex;
  flex-flow: column;
  width: 358px;
  margin: 0 auto;
  &__header {
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
    padding: 16px 6px;
  }
}
</style>