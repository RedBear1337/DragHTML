<template>
  <div class="journalNav">
    <customBtn :disabled="false" class="journalNav__btn" :short="true" :data="{img: 'undo', alt: 'undo', func: prevStep}"/>
    <customBtn class="journalNav__btn" :short="true" :data="{img: 'redo', alt: 'redo', func: nextStep}"/>
  </div>
</template>

<script>
import customBtn from "@/components/customBtn";

export default {
  name: "journalNav",
  components: {customBtn},
  data() {
    return {}
  },
  methods: {
    prevStep() {
      this.$store.commit('moveStep', -1);
    },
    nextStep() {
      this.$store.commit('moveStep', 1);
    }
  },
  computed: {
    step() {
      return this.$store.getters.getStep;
    }
  },
  watch: {},
  mounted() {

  }
}
</script>

<style lang="scss">
.journalNav {
  &__btn {
    -webkit-app-region: none;
    z-index: 1000;
    margin-left: 9px;

    &:first-of-type {
      margin-left: 0;
    }
    &:disabled {
      background: rgba(135, 127, 127, 0.56);
      cursor: default;
    }
  }
}
</style>