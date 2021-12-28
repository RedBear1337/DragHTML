<template>
  <div class="workSpace">
    <!-- Header Bar -->
    <headerBar/>
    <div ref="content" class="workSpace__content">
      <dropZone v-for="(zone, idx) of zones"
                :key="zone.name"
                :size="{h:zone.height}"
                :id="idx+1"
                :elems="elems"
                @updateEvent="updateJournal"/>
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
    return {
      elems: [],
    }
  },
  methods: {
    updateJournal(zoneId) {
      console.log('zoneId', zoneId);
      if (zoneId === 'all') {

      } else {
        this.$store.commit('addChange', this.$refs.content);
      }
    },
  },
  computed: {
    zones() {
      return this.$store.getters.getZones;
    },
  },
  watch: {},
  mounted() {
    this.$store.commit('addZone', {name: 'zone1', y: 0, height: 200});
  }
}
</script>

<style lang="scss">
.workSpace {
  position: relative;
  display: flex;
  flex-flow: column;
  align-items: center;
  //height: calc(100vh - 58px);
  width: 100%;
  overflow-x: hidden;

  &__content {
    height: 100%;
    width: 100%;
  }
}
</style>