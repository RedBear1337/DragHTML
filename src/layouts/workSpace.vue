<template>
  <div class="workSpace">
    <!-- Header Bar -->
    <headerBar/>
    <div class="workSpace__content">
      <dropZone :size="{w:'100%',h:'200px'}" :id="1"/>
    </div>
  </div>
</template>

<script>
import headerBar from "@/layouts/headerBar";
import dropZone from "@/components/drop/dropZone";

export default {
  name: "workSpace",
  components: {headerBar, dropZone},
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
.workSpace {
  position: relative;
  display: flex;
  flex-flow: column;
  height: calc(100vh - 58px);
  width: 100%;
  overflow-x: hidden;

  &__content {
    height: 100%;
    width: 100%;
  }
}
</style>