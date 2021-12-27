<template>
  <button type="button" class="cBtn" :style="style" @click="data.func()">
    <span v-if="!short" class="cBtn__title">{{ data.message }}</span>
    <img v-else :src="require(`../assets/svg/${data.img}.svg`)" :alt="data.alt" class="cBtn__icon">
  </button>
</template>

<script>

export default {
  name: "customBtn",
  components: {},
  props: ['data', 'short', 'type'],
  data() {
    return {}
  },
  methods: {},
  computed: {
    style() {
      if (!this.short) {
        switch (this.type) {
          case 'round':
            return 'border: 1px solid; border-radius: 38px;';
          case 'square':
            return 'border: 1px solid';
          case 'underline':
            return 'border-style: solid; border-width: 0 0 1px 0';
          default:
            return 'border: 1px solid';
        }
      } else {
        return 'border: 1px solid; width: 28px; max-width: 28px; height: 28px;'
      }

    }
  },
  watch: {},
  mounted() {
  }
}
</script>

<style lang="scss">
@import "~@/assets/scss/app.scss";

.cBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: $btn-width;
  height: $btn-height;
  cursor: pointer;
}
</style>