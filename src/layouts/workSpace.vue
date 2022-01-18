<template>
  <div class="workSpace">
    <!-- Header Bar -->
    <headerBar/>
    <div ref="content" class="workSpace__content" @contextmenu.prevent="contextMenuFunc">
      <contextMenu :target="contextElem" v-show="isShowContextMenu"
      @calledAction="contextAfterAction"/>
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
import contextMenu from "../components/contextMenu/contextMenu";
import headerBar from "@/layouts/headerBar";
import dropZone from "@/components/drop/dropZone";

export default {
  name: "workSpace",
  components: {contextMenu, headerBar, dropZone},
  data() {
    return {
      isShowContextMenu: false,
      contextEvt: {},
      // child - самый глубокий элемент, parent - группа в которой он содержится
      contextElem: {child: '', parent: '', resizableContainer: '', zone: ''},
    }
  },
  methods: {
    initMustache() {
      let maxWidth;
      try {
        maxWidth = getComputedStyle(this.$refs.content, false).width;
      } catch (e) {
        throw new Error('Ошибка при инициализации mustache: ') + e;
      }

      try {
        electron.ipcRenderer.send("service", {
          action: "initMustache",
          maxWidth: maxWidth,
        });
      } catch (e) {
        throw new Error('Ошибка при отправке запроса на background: ') + e;
      }
    },

    createFirstZone() {
      this.$store.commit("addZone", {name: "zone1", y: 0, height: 200});
    },

    mustacheAddZone(zone) {
      let lastZone = zone[zone.length - 1];
      electron.ipcRenderer.send("service", {
        action: "addMustache",
        zone: lastZone,
        elem: {name: "dropZone"},
      });
    },

    /**
     * Возвращает результат проверки, подходит ли элемент для вызова контекстного меню
     * @return {boolean}
     */
    contextCheckCorrectTarget() {
      try {
        return (
            !this.contextEvt.target.classList.contains('dropZone') &&
            !this.contextEvt.path.some(p=>p.id === 'contextMenu')
        )
      } catch (e) {
        throw 'Не удалось проверить тип элемента. ' + e;
      }
    },
    //
    // /**
    //  * Возвращает результат проверки, является ли текущий элемент группой handlers
    //  * @returns {boolean}
    //  */
    // isHandlerGroup() {
    //   let elem = this.contextEvt.target;
    //   try {
    //     // DOMTokenList
    //     let classes = elem.classList;
    //       return (
    //           classes.contains('resize__handlers')
    //       );
    //   } catch (e) {
    //     throw 'Не удалось определить класс handler. ' + e;
    //   }
    // },
    //
    // /**
    //  * Поднимает уровень погружения элемента на 1
    //  */
    // contextEvtPropagateUpOnOne() {
    //   try {
    //       this.contextEvt = this.contextEvt.target.parentNode;
    //   } catch (e) {
    //     throw ('Не удалось поднять уровень погружения event.target. ') + e;
    //   }
    // },

    contextElemParentIsResizableContainer() {
      return this.contextElem.parent.parentNode.classList.contains('resize');
    },

    getElemParent() {
      let propagate = true;
      try {
        while (propagate) {
          if (!this.contextElemParentIsResizableContainer()) {
            this.contextElem.parent = this.contextElem.parent.parentNode;
          } else {
            propagate = false;
          }
        }
      } catch (e) {
        throw 'Не удалось получить родительский элемент. ' + e;
      }
    },

    getResizableContainer() {
      this.contextElem.resizableContainer = this.contextElem.parent.parentNode;
    },

    /**
     * //**** переделать название и описание
     * Возвращает содержимое элемент resizeContainer в качестве event.target или '', если текущая цель не удовлетворяет условиям фильтрации.
     * @return {event.target | ''}
     */
    getContextTarget() {
      try {
          this.contextElem.child = this.contextElem.parent = this.contextElem.zone = this.contextEvt.target;
          this.getElemParent();
          this.getResizableContainer();
          this.getZone();
      } catch (e) {
        throw ('Не удалось получить event.target: ') + e;
      }
    },

    contextElemIsZone() {
      return this.contextElem.zone.classList.contains('dropZone');
    },

    getZone() {
        let propagate = true;

        try {
          while (propagate) {
            if (!this.contextElemIsZone()) {
              this.contextElem.zone = this.contextElem.zone.parentNode;
            } else {
              propagate = false;
            }
          }
        } catch (e) {
          throw 'Не удалось получить родительский элемент. ' + e;
        }
    },

    getStyleFromResizableContainer() {
      const resComputed = getComputedStyle(this.contextElem.resizableContainer, false);
      // w и h которые указаны в стилях elements, те можно спарсить с parent
      const size = {w: parseInt(resComputed.width), h: parseInt(resComputed.height)};
      const pos = {x: parseInt(resComputed.left), y: parseInt(resComputed.top)};
      return {size, pos};
    },

    contextAfterAction(actionName = '') {
      this.changeShowContextState(false);
      const {size, pos} = this.getStyleFromResizableContainer();
      const zoneId = this.contextElem.zone.id.replace('zone', '');
      const elemId = this.contextElem.resizableContainer.id;
      let elemHTML = this.contextElem.parent.outerHTML;
      const reg = new RegExp(`\\"`, 'gm');
      elemHTML = elemHTML.replace(reg, `'`);
      // id, pos, size, zoneId цифрой

      if (actionName !== 'remove element') {
        electron.ipcRenderer.send('service', {action: 'changeMustache', zone: zoneId, elem: {html: elemHTML, id: elemId}, style: {size: size, pos: pos}});
      } else {
        electron.ipcRenderer.send('service', {action: 'removeMustache', zone: zoneId, elem: elemId});
      }

    },

    changeShowContextState(state) {
      this.isShowContextMenu = state;
    },

    /**
     * Вызывает контекстное меню
     * @param evt
     */
    contextMenuFunc(evt) {
      evt.preventDefault();

      const deselect = (evt)=>{
        if (evt.path.some(p=>p.id !== 'contextMenu')) {
          this.changeShowContextState(false);
          document.removeEventListener('click', deselect);
        }
      }
      
      this.contextEvt = evt;
      try {
        if (!this.contextCheckCorrectTarget()) {
          return
        }
      } catch (e) {
        console.error(e);
        return
      }
      try {
          this.getContextTarget();
          // Здесь будет вызов контекстного меню на позиции курсора.
      } catch (e) {
        console.error(new Error('Ошибка при открытии контекстного меню:'), e);
        return
      }
      
      try {
        this.changeShowContextState(true);
        document.addEventListener('click', deselect);
      } catch (e) {
        console.error(new Error('Ошибка при отображении контекстного меню.'), e);
        this.changeShowContextState(false);
        return
      }
    },
  },
  computed: {
    zones() {
      return this.$store.getters.getZones;
    },
  },
  watch: {
    zones(zone) {
      this.mustacheAddZone(zone);
    },
  },
  mounted() {
    try {
      this.initMustache();
      this.createFirstZone();
    } catch (e) {
      console.error(e);
      return
    }

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
    position: relative;
    height: calc(100vh - 58px);
    width: 100%;
    overflow-y: auto;
  }
}
</style>