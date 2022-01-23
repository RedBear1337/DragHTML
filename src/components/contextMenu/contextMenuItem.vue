<template>
  <div class="contextItem" @click="emitAction">
    <span class="contextItem__name">{{ this.text }}</span>
  </div>
</template>

<script>

export default {
  name: "contextMenuItem",
  components: {},
  props: ['text'],
  data() {
    return {
    }
  },
  methods: {
    emitAction() {
      this.$emit('action', this.text);
    }
  },
  computed: {},
  watch: {},
  mounted() {
  }
}
</script>

<style lang="scss">
.contextItem {
  width: 100%;
  max-width: 100%;

  text-align: left;
  padding: 5px;
  background: rgba(255, 255, 255, 0.50);
  color: black;

  &:hover {
    background: #a49ea5;
    cursor: pointer;
  }
}
</style>