<template>
  <button :class="{
    cCheck: true,
    cCheck__active: isActive
  }" @click="sendChosen">
    <slot class="cCheck__title"/>
  </button>
</template>

<script>

export default {
  name: "customCheckbox",
  components: {},
  props: ['checkData'],
  data() {
    return {
    }
  },
  methods: {
    sendChosen() {
      this.$emit('chosen', this.checkData.text);
    }
  },
  computed: {
    isActive() {
      return this.checkData.state || false;
    }
  },
  watch: {
  },
  mounted() {
  }
}
</script>

<style lang="scss">
.cCheck {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.25);
  border-radius: 0px;
  background: #E0CAA9;

  cursor: pointer;

  font-family: Arial;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;

  &__active {
    background: #FFB649;
    border-radius: 4px;
  }
}
</style>