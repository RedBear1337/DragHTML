<template>
<!--<div class="eitem" :key="item.id" v-for="item in content">-->
<!--  <div class="eitem__nameblock">-->
<!--    <span class="eitem__title">{{item.title}}</span>-->
<!--  </div>-->
<!--</div>-->
  <div class="eitem">
    <div class="eitem__nameblock">
      <span class="eitem__title">input</span>
    </div>
  </div>
</template>

<script>

export default {
  name: "item",
  components: {},
  props: ['content'],
  data() {
    return {}
  },
  methods: {},
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