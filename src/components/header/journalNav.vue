<template>
  <div class="journalNav">
    <customBtn :disabled="journal.length < 1" class="journalNav__btn" :short="true" :data="{img: 'undo', alt: 'undo', func: prevStep}"/>
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

    },
    nextStep() {

    }
  },
  computed: {
    journal() {
      return this.$store.getters.getJournal;
    },
    step() {
      return this.$store.getters.getJournalStep;
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
    &:disabled {
      background: rgba(135, 127, 127, 0.56);
      cursor: default;
    }
  }
}
</style>