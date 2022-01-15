<template>
  <div class="workSpace">
    <!-- Header Bar -->
    <headerBar />
    <div ref="content" class="workSpace__content">
      <dropZone
        v-for="(zone, idx) of zones"
        :key="zone.name"
        :size="{ h: zone.height }"
        :id="idx + 1"
      />
    </div>
  </div>
</template>

<script>
import electron from "electron";
import headerBar from "@/layouts/headerBar";
import dropZone from "@/components/drop/dropZone";

export default {
  name: "workSpace",
  components: { headerBar, dropZone },
  data() {
    return {
      maxStack: 20,
      undoStack: [],
      redoStack: [],
    };
  },
  methods: {
    updateUndo(records) {
      if (records.length > 0) {
        let tempUndo = [];
        let add = [];
        let remove = [];

        // records.forEach(item=>console.log(item));
        records.forEach((record) => {
          if (record.type === "childList") {
            if (record.addedNodes.length > 0) {
              add.push({ target: record.target, node: record.addedNodes });
            }
            if (record.removedNodes.length > 0) {
              remove.push({ target: record.target, node: record.removedNodes });
            }
          }
        });
        [add, remove] = this.cutDups({ add: add, remove: remove });
        tempUndo.push({ add, remove });
      }
    },
    cutIgnore(records) {
      let cutted = [];
      records.forEach((record) => {
        if (
          record.attributeName !== "class" &&
          !record.target.classList.contains("showBorder")
        ) {
          cutted.push(record);
        }
      });
      return cutted;
    },
    // Не работает
    cutDups(nodes) {
      let tempAdd = nodes.add;
      let tempRemove = nodes.remove;
      nodes.add.forEach((added) => {
        if (
          nodes.remove.findIndex((removed) => removed.node === added.node) > -1
        ) {
          let index = nodes.add.findIndex((add) => add === added);
          tempAdd = tempAdd.slice(0, index) + tempAdd.slice(index);
        }
      });
      return [tempAdd, tempRemove];
    },

    mAddZone(zone) {
      let lastZone = zone[zone.length - 1];
      electron.ipcRenderer.send("service", {
        action: "addMustache",
        zone: lastZone,
        elem: {name: "dropZone"},
      });
    },
  },
  computed: {
    zones() {
      return this.$store.getters.getZones;
    },
    stepNumber() {
      return this.$store.getters.getStep;
    },
  },
  watch: {
    zones(zone) {
      this.mAddZone(zone);
    },
    stepNumber(value) {
      console.log("step", value);
    },
  },
  mounted() {
    let observer = new MutationObserver((records) => {
      this.updateUndo(this.cutIgnore(records));
    });
    let obsCfg = {
      childList: true,
      subtree: true,
      attributes: true,
      attributeOldValue: true,
      characterDataOldValue: true,
    };
    observer.observe(this.$refs.content, obsCfg);
    const changes = observer.takeRecords();
    // console.log('changes', changes);

    this.$store.commit("addZone", { name: "zone1", y: 0, height: 200 });

    let maxWidth = getComputedStyle(this.$refs.content, false).width;
    electron.ipcRenderer.send("service", {
      action: "initMustache",
      maxWidth: maxWidth,
    });
  },
};
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
  overflow-y: hidden;

  &__content {
    height: calc(100vh - 58px);
    width: 100%;
    overflow-y: auto;
  }
}
</style>