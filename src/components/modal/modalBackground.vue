<template>
  <div id="modal" :class="{
    mBack: true,
    mBack_blur: this.type == 'blur',
    mBack_dark: this.type == 'dark',
  }">
    <slot name="win"></slot>
  </div>
</template>

<script>

export default {
  name: "modalBackground",
  components: {},
  props: ['closeOnBackdrop', 'type'],
  data() {
    return {}
  },
  methods: {
    initModal() {
      if (this.closeOnBackdrop) {
        document.addEventListener('click', this.checkClickTarget, false);
      }
    },
    checkClickTarget(evt) {
      if (evt.target.id == this.$el.id) {
        document.removeEventListener('click', this.checkClickTarget, false);
        this.closeModal()
      }
    },
    closeModal() {
      this.$el.style.display = 'none';
    }
  },
  computed: {
  },
  watch: {},
  mounted() {
    this.initModal();
  }
}
</script>

<style lang="scss">
.mBack {
  z-index: 10000;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  
  width: 100%;
  height: 100%;

  background: rgba(0, 0, 0, 0.25);

  &_blur {
    background: rgba(0, 0, 0, 0);
    backdrop-filter: blur(3px);
  }
  &_dark {
    background: rgba(0, 0, 0, 0.25);
  }
}

</style>