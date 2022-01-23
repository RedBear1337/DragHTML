<template>
<button :disabled="isDisabled" type="button" class="applyBtn" @click="applyFunc">
<!--  <img src="../assets/svg/check.svg" alt="Ok" class="applyBtn__icon">-->
  <svg class="applyBtn__icon" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.335 18.4311L5.56655 13.6627L3.94275 15.275L10.335 21.6673L24.0572 7.94506L22.4449 6.3327L10.335 18.4311Z" :fill="iconColor"/>
  </svg>
</button>
</template>

<script>

export default {
  name: "applyBtn",
  components: {},
  props: ['applyFunc','isReady'],
  data() {
    return {
    }
  },
  methods: {
  },
  computed: {
    isDisabled() {
      return !this.isReady || false;
    },
    iconColor() {
      return this.isDisabled ? '#8A8A8A' : 'black'
    },
  },
  watch: {
  },
  mounted() {
  }
}
</script>

<style lang="scss">
.applyBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;

  background: #50F47E;
  box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.25);

  cursor: pointer;

  &:active {
    background: #62DB84;
  }
  &:hover {
    background: #7AFF9F;
  }
  &:disabled {
    background: #C2C2C2;
    box-shadow: none;

    cursor: default;
  }

  &__icon {

  }
}

</style>