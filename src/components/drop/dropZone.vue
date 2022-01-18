<template>
  <div
      :style="`height: ${size.h}px;`"
      :id="'zone' + id"
      class="dropZone"
      @drop.capture.self.prevent="initDrop($event)"
      @dragover.prevent
  >
    <!--    <div class="test" style="width: 40px; height: 40px; position: relative; left: 20px; top:50px; background: greenyellow"></div>-->
  </div>
</template>

<script>
import Vue from "vue";
import store from "@/store";

import electron from "electron";
import resizableContainer from "@/components/drop/resizableContainer";

export default {
  name: "dropZone",
  components: {resizableContainer},
  props: ["id", "size"],
  data() {
    return {
      // Drag
      dragged: {},

      pastePos: {x: 0, y: 0},

      // Drop
      dataTransfer: {},

      // Create Elem
      elemId: "",
      title: "",
      html: "",
      style: "",
      w: 10,
      h: 10,
      minW: 10,
      maxW: 10,
      minH: 10,
      maxH: 10,
    };
  },

  methods: {
    // Update
    updateEvent() {
      this.$emit("updateEvent", this.$el.id);
    },

    // Get methods
    /**
     * Возвращает преобразованные координаты. Убирает дробь, округляет до нужной кратности, преобразует строку в число
     * @param event
     * @param round - кратность округления.
     * @param {String | Number} width - ширина размещаемого объекта (не в %)
     * @param {String | Number} height - высота размещаемого объекта (не в %)
     * @returns {{x: number, y: number}}
     */
    getPastePosition(event, round, width, height) {
      let x = (this.x = event.offsetX);
      let y = (this.y = event.offsetY);
      let w = (this.w = width);
      let h = (this.h = height);

      let response;

      if (isNaN(w) || isNaN(h)) {
        let numW = parseInt(w);
        let numH = parseInt(h);

        w = w === "auto" ? 100 : numW;
        h = h === "auto" ? 100 : numH;
      }

      // Убрать дробь, округлить согласно кратности
      response = {
        x: Math.ceil(Math.round(x - w / 2) / round) * round,
        y: Math.ceil(Math.round(y - h / 2) / round) * round,
      };
      return response;
    },
    /**
     * Получить dataTransfer
     * @returns {Object}
     */
    getDataTransfer() {
      let data = this.currentDataTransfer;
      let keys = Object.keys(data);
      for (let key of keys) {
        if (key === undefined) {
          throw new Error("key === undefined");
        }
      }

      this.$store.commit("clearDataTransfer");
      return data;
    },

    getSameTitles(titleList) {
      let sameTitles = [];
      try {
        for (let child of titleList) {
          if (child.title === this.title) {
            sameTitles.push(parseInt(child.id.replace(this.title, "")));
          }
        }
      } catch (e) {
        throw 'Не удалось получить список одинаковых title' + e;
      }

      return sameTitles;
    },

    /**
     * Возвращает размеры и координаты всех дочерних элементов dropZone в виде массива
     * @returns {*[]}
     */
    getZoneElements(zone) {
      let properties = [];
      try {
        const children = zone.childNodes;
        for (let child of children) {
          properties.push({
            title: child.title,
            id: child.id,
            w: child.style.width,
            h: child.style.height,
            y: child.style.top,
            x: child.style.left,
          });
        }
      } catch (e) {
        throw 'Не удалось получить элементы зоны. ' + e;
      }
      return properties;
    },
    /**
     * Возвращает размеры и координаты всех дочерних элементов всех dropZone в виде массива
     * @returns {*[]}
     */
    getAllElements() {
      let properties = [];
      try {
        const zones = this.$el.parentNode.childNodes;
        for (let zone of zones) {
          properties.push(...this.getZoneElements(zone));
        }
      } catch (e) {
        throw new Error('Не удалось получить все элементы зон. ') + e
      }
      return properties;
    },

    /**
     * Возвращает максимальный, соответствующий title, elemId+1
     * @returns {Number}
     */
    getElementId() {
      let sameTitles = [];
      try {
        let allElements = this.getAllElements();
        sameTitles = this.getSameTitles(allElements)
      } catch (e) {
        throw "Не удалось получить id элемента. " + e;
      }

      try {
        this.elemId = Math.max(...sameTitles) < 1 ? 1 : Math.max(...sameTitles) + 1;
      } catch (e) {
        throw 'Не удалось определить верный id элемента. ' + e;
      }

    },

    // Insert methods
    /**
     * Возвращает позицию первого символа после искомого слова в строке или перед '>';
     * @param {String} where - где искать
     * @param {String} str - что искать
     * @returns {Number | undefined}
     */
    searchInHtmlByStr(where, str) {
      let startCharAt = 0;
      if (where.search(str) >= 0) {
        startCharAt = where.search(str) + str.length + 1;
      } else if (where.search(">") >= 0) {
        startCharAt = where.search(">");
      } else {
        return undefined;
      }
      return startCharAt;
    },
    /**
     * Возвращает результат проверки элемента на наличие не пустого значения.
     *
     * Поддерживает: "", [ ], { }
     * @param {any} value - проверяемое значение
     * @return {boolean}
     */
    isEmpty(value) {
      let result;
      try {
        result = value == "" || value == [] || value == {};
      } catch (e) {
        throw 'Не удалось определить isEmpty. ' + e;
      }
      return result;
    },

    computeElemSize(supposedSize, defaultSize) {
      try {
        if (!this.isEmpty(supposedSize)) {
          return parseInt(supposedSize);
        } else {
          return defaultSize;
        }
      } catch (e) {
        throw new Error("Не удалось вычислить размер элемента. ") + e;
      }
    },

    defineElemSizeOnDrop(sizeObj, defaultValue) {
      try {
        this.w = this.computeElemSize(sizeObj.w, defaultValue);
        this.minW = this.computeElemSize(sizeObj.minW, this.w);
        this.maxW = this.computeElemSize(sizeObj.maxW, "");
      } catch (e) {
        throw ("Не удалось получить ширину элемента. ") + e;
      }
      try {
        this.h = this.computeElemSize(sizeObj.h, defaultValue);
        this.minH = this.computeElemSize(sizeObj.minH, this.h);
        this.maxH = this.computeElemSize(sizeObj.maxH, "");
      } catch (e) {
        throw ("Не удалось получить высоту элемента. ") + e;
      }
    },

    // Create elem Methods

    extractDataTransfer() {
      try {
        this.title = this.dataTransfer.title;
        this.html = this.dataTransfer.html;
        this.style = this.dataTransfer.style;
        this.defaultSize = this.dataTransfer.defaultSize;
      } catch (e) {
        throw 'Не удалось извлечь данные. ' + e;
      }
    },

    initElemPaste(evt) {
      try {
        if (
            !this.checkPlaceFreedom(evt, false, this.$el, {
              width: this.w,
              height: this.h,
              id: this.title + this.elemId,
            })
        ) {
          this.pasteElem(evt);
        } else {
          return;
        }
      } catch (e) {
        throw new Error('Ошибка при инициации вставки элемента: ') + e;
      }
    },

    prepareToCompose() {
      try {
        this.extractDataTransfer();
      } catch (e) {
        throw new Error('Ошибка при извлечении данных dataTransfer: ') + (e);
      }

      // Define elem sizes
      try {
        this.defineElemSizeOnDrop(this.defaultSize, 20);
      } catch (e) {
        throw new Error('Ошибка при определении размеров элемента: ') + (e);
      }

      // Get id
      try {
        this.getElementId();
      } catch (e) {
        throw new Error('Ошибка при получении id элемента: ') + (e);
      }
    },
    
    endCompose() {
      // Setting Attributes
      try {
        this.setAttr();
      } catch (e) {
        throw new Error("Ошибка при установке аттрибутов: ") + e;
      }

      // load Classes
      try {
        this.loadRulesForElem();
      } catch (e) {
        throw new Error("Ошибка при загрузке стилей: ") + e;
      }

      try {
        this.markAsDraggable();
      } catch (e) {
        throw new Error('Ошибка при размещении событий: ')+(e);
      }
    },

    /**
     * Преобразует передаваемые через dataTransfer данные в форму для вставки.
     * @param event
     */
    insertComposed(event) {
      //========= Prepare Compose
      try {
        this.prepareToCompose();
      } catch (e) {
        console.error('Ошибка при подготовке элемента:', e);
      }

      // Init Paste
      try {
        this.initElemPaste(event);
      } catch (e) {
        console.error("Ошибка во время инициализации элемента: ", e);
        return;
      }

      //========= End Compose
      try {
        this.endCompose();
      } catch (e) {
        console.error('Ошибка при завершении вставки сформированного элемента:', e);
      }

      electron.ipcRenderer.send("service", {
        action: "addMustache",
        zone: this.$el.id.replace("zone", ""),
        elem: {
          id: this.title + this.elemId,
          name: this.title,
          pos: this.pastePos,
          size: {
            w: this.w,
            h: this.h,
          },
        },
      });
    },

    createReplacingElem() {
      try {
        let replaceMe = document.createElement("div");
        replaceMe.className = "replaceMe";
        this.$el.appendChild(replaceMe);
      } catch (e) {
        throw 'createReplacingElem. Не удалось разместить элемент для замены. ' + e;
      }
    },
    createResizeInstance() {
      let compiledHTML;
      let completeElem;
      let resizeInstance;
      try {
        resizeInstance = Vue.extend(resizableContainer);
      } catch (e) {
        throw 'Не удалось создать экземпляр instance resizableContainer. ' + e;
      }

      try {
        completeElem = new resizeInstance({
          propsData: {
            pos: this.pastePos,
            size: {
              w: this.w,
              minW: this.minW,
              maxW: this.maxW,
              h: this.h,
              minH: this.minH,
              maxH: this.maxH,
            },
          },
          store,
        });
      } catch (e) {
        throw 'Не удалось задать параметры для instance resizableContainer. ' + e;
      }

      try {
        compiledHTML = Vue.compile(this.html);
      } catch (e) {
        throw 'Не удалось скомпилировать html. ' + e;
      }

      try {
        completeElem.$slots.innerNode = [
          completeElem.$createElement(compiledHTML),
        ];
      } catch (e) {
        throw 'Не удалось разместить слот в instance resizableContainer. ' + e;
      }

      try {
        completeElem.$mount(".replaceMe");
      } catch (e) {
        throw 'Не удалось установить скомпилированный instance на заменяемом элементе. ' + e;
      }

    },
    /**
     * Вставка и рендер элемента в dropZone
     * @param event
     */
    pasteElem(event) {
      try {
        this.createReplacingElem();
      } catch (e) {
        throw e
      }

      try {
        this.createResizeInstance();
      } catch (e) {
        throw e;
      }
    },

    // Init Methods
    /**
     * Вешает drag ивенты на созданный элемент
     * @param id
     */
    markAsDraggable(id) {
      try {
        if (!id) {
          const lastChild = this.$el.lastChild;
          lastChild.addEventListener("dragstart", this.dragCheck, true);
          lastChild.addEventListener("dragend", this.dragEnd);
        } else {
          const elem = document.getElementById(id);
          elem.addEventListener("dragstart", this.dragCheck, true);
          elem.addEventListener("dragend", this.dragEnd);
        }
      } catch (e) {
        throw 'Не удалось разместить drag event на созданный элемент. ' + e;
      }

    },

    isElemValid(dataTransfer) {
      if (!dataTransfer.prepare) {
        if (!dataTransfer.dragged) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    },

    defineElemZone(evt, elem) {
      if (!this.checkZone(evt, elem)) {
        this.changeZone(evt, elem);
      }
    },

    moveElem(evt, elem) {
      try {
        if (!this.checkPlaceFreedom(evt, elem, evt.target, false)) {
          this.defineElemZone(evt, elem);
          this.changePlace(evt, elem);
        }
      } catch (e) {
        throw e;
      }

    },

    defineDropWay(evt) {
      if (this.dataTransfer.prepare) {
        try {
          this.insertComposed(evt);
        } catch (e) {
          throw 'Ошибка при размещении нового элемента: ' + e;
        }
      } else {
        try {
          let elem = this.dataTransfer.dragged;
          this.moveElem(evt, elem);
        } catch (e) {
          throw 'Ошибка при перемещении элемента: ' + e;
        }
      }
    },

    prepareDrop() {
      try {
        this.dataTransfer = this.getDataTransfer();
      } catch (e) {
        throw ("Не удалось получить данные dataTransfer: ") + e;
      }
      if (!this.isElemValid(this.dataTransfer)) {
        throw ("Перетаскиваемый объект не является подходящим для вставки.");
      }
    },

    /**
     * Инициализировать drop элемента
     * @param evt
     */
    initDrop(evt) {
      try {
        this.prepareDrop();
      } catch (e) {
        console.error('Ошибка при подготовке данных prepareDrop:', e);
        return;
      }

      try {
        this.defineDropWay(evt);
      } catch (e) {
        console.error(e);
        return;
      }
    },

    setMetaDataTransfer(evt) {
      let w = parseInt(this.dragged.style.width) / 2;
      let h = parseInt(this.dragged.style.height) / 2;

      evt.dataTransfer.dropEffect = "move";
      evt.dataTransfer.effectAllowed = "move";
      evt.dataTransfer.setData("prepare", false);

      evt.dataTransfer.setDragImage(evt.target, w, h);
    },

    // Drag Methods
    dragCheck(evt) {
      if (!evt.target.classList.contains("resize__handler")) {
        this.dragStart(evt);
      }
    },
    dragStart(evt) {
      this.dragged = evt.target;
      this.setMetaDataTransfer(evt)
      this.sendDataTransfer({dragged: this.dragged});
      this.changeBordersVisible(true);
    },
    dragEnd(evt) {
      this.changeBordersVisible(false);
    },
    /**
     * Отправляет содержимое dataTransfer в хранилище vuex;
     * @param {object} data - данные для отправки
     */
    sendDataTransfer(data) {
      this.$store.commit("setDataTransfer", data);
    },
    /**
     * Изменяет видимость границ элементов
     * @param {boolean} visible
     */
    changeBordersVisible(visible) {
      // if (visible) {
      //   this.dragged.style.backgroundColor = "red";
      // } else {
      //   this.dragged.style.backgroundColor = "";
      // }
      this.$store.commit("setShowState", {
        name: "showElemBorders",
        state: visible,
      });
    },

    // Style load Methods
    /**
     * Создать класс и добавить его в head
     * @param {String} className - название класса
     * @param {String} rules - список правил строкой. Например: 'color: green;'
     */
    createClass(className, rules) {
      try {
        const style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = `${className} {\n` + `${rules} }`;
        document.getElementsByTagName("head")[0].appendChild(style);
      } catch (e) {
        throw new Error("Не удалось создать класс. ") + e;
      }
    },
    isStyleApplied() {
      try {
        return !this.appliedStyles.some((style) => style === this.style)
      } catch (e) {
        throw 'Не удалось определить применен ли стиль. ' + e;
      }
    },
    /**
     * Загрузить в head стили для элемента
     */
    loadRulesForElem() {
      try {
        if (this.isStyleApplied()) {
          let classes = this.styles[this.style].styleCode;
          for (let item of classes) {
            this.createClass(item.class, item.rules);
          }
          this.$store.commit("addApplied", this.style);
        }
      } catch (e) {
        throw e;
      }
    },
    /**
     * Устанавливает значения атрибутов для созданного элемента
     */
    setAttr() {
      if (this.title || this.elemId) {
        this.$el.lastChild.draggable = true;
        this.$el.lastChild.title = this.title;
        this.$el.lastChild.id = this.title + this.elemId;
      } else {
        throw new Error("this.title || this.elemId === undefined. ");
      }
    },

    // Position check
    /**
     * Проверяет, не соприкасается ли элемент с другим
     * @param a
     * @param b
     * @returns {boolean}
     */
    isCollide(a, b) {
      try {
        return !(
            a.y + a.h < b.y ||
            a.y > b.y + b.h ||
            a.x + a.w < b.x ||
            a.x > b.x + b.w
        );
      } catch (e) {
        throw 'Не удалось определить isCollide. ' + e;
      }
    },
    /**
     * Возвращает координаты, не нарушающие границы рабочей зоны
     * @param {String | Number} x
     * @param {String | Number} y
     * @param {String | Number} w
     * @param {String | Number} h
     * @returns {{x, y}}
     */
    checkBounds(x, y, w, h) {
      try {
        let result = {x: x, y: y};
        w = parseInt(w);
        h = parseInt(h);
        const bottom = y + h;
        const top = y;
        const left = x;
        const right = x + w;
        const zoneHeight = parseInt(this.$el.style.height);
        const zoneWidth = parseInt(getComputedStyle(this.$el, false).width);
        if (bottom > zoneHeight) {
          result.y = zoneHeight - h;
        }
        if (top < 0) {
          result.y = 0;
        }
        if (left < 0) {
          result.x = 0;
        }
        if (right > zoneWidth) {
          result.x = zoneWidth - w;
        }
        return result;
      } catch (e) {
        throw 'checkBounds. Не удалось определить координаты. ' + e;
      }
    },

    getElemSize(elem, options) {
      let w;
      let h;
      try {
        if (elem && !options) {
          w = parseInt(elem.style.width);
          h = parseInt(elem.style.height);
        } else {
          w = options.width;
          h = options.height;
        }
      } catch (e) {
        throw 'Не удалось получит размеры элемента. ' + e;
      }

      return {w, h};
    },

    getBounds(evt, size) {
      try {
        let paste = this.getPastePosition(evt, 5, size.w, size.h);
        return this.checkBounds(paste.x, paste.y, size.w, size.h);
      } catch (e) {
        throw e;
      }
    },

    getCheckingElems(elem, options, zone) {
      try {
        let elemId = elem.id || options.id;
        return this.getZoneElements(zone).filter(
            (child) => child.id !== elemId
        );
      } catch (e) {
        throw e;
      }
    },

    isPlaceFreedom(checkingElems, bounds, size) {
      let result;
      for (let check of checkingElems) {
        let checkObj = {
          w: parseInt(check.w),
          h: parseInt(check.h),
          y: parseInt(check.y),
          x: parseInt(check.x),
        };
        try {
          result = this.isCollide(
              {w: size.w, h: size.h, y: bounds.y, x: bounds.x},
              checkObj
          );
        } catch (e) {
          throw e;
        }

        if (result) {
          return result;
        }
      }
    },

    /**
     * Проверяет, свободно ли пространство для установки объекта и записывает координаты в this.pastePos
     * @param event
     * @param {Node | Boolean} elem
     * @param zone
     * @param {{width: number, id: string, height: number}} options - опциональный параметр.
     * @param {Number} options.width - ширина
     * @param {Number} options.height - высота
     * @param {String} options.id - id элемента
     * @returns {boolean}
     */
    checkPlaceFreedom(evt, elem, zone, options) {
      let w;
      let h;
      try { //****
        ({w, h} = this.getElemSize(elem, options));
      } catch (e) {
        throw e;
      }

      let bounds = {};
      try {
        bounds = this.getBounds(evt, {w: w, h: h});
      } catch (e) {
        throw (
            new Error("Ошибка при получении координат для вставки элемента: ") + e
        );
      }

      let checkingElems = [];
      try {
        checkingElems = this.getCheckingElems(elem, options, zone)
      } catch (e) {
        throw new Error("Ошибка при получении списка элементов зоны: ") + e;
      }

      let result = false;
      try {
        result = this.isPlaceFreedom(checkingElems, bounds, {w: w, h: h});
      } catch (e) {
        throw new Error("Ошибка при расчете коллизии: ") + e;
      }

      if (!result) {
        this.pastePos = bounds;
      }
      return result;
    },
    /**
     * Возвращает результат сравнения id родительского элемента event и elem. Те, поменялась ли зона
     * @param {Event} e
     * @param {Node} elem
     * @returns {boolean}
     */
    checkZone(e, elem) {
      const parentZoneId = elem.parentNode.id;
      const targetZoneId = e.target.id;
      return parentZoneId === targetZoneId;
    },

    // Position change
    /**
     * Перемещает элемент в dropZone, который является e.target
     * @param e
     * @param elem
     */
    changeZone(e, elem) {
      const targetZone = e.target;
      targetZone.append(elem);
    },
    /**
     * Устанавливает новые координаты для элемента на основе местоположения курсора
     * @param event
     * @param {Node} elem
     */
    changePlace(event, elem) {
      elem.style.left = this.pastePos.x + "px";
      elem.style.top = this.pastePos.y + "px";
    },
  },
  computed: {
    styles() {
      return this.$store.getters.getStyles;
    },
    appliedStyles() {
      return this.$store.getters.getAppliedStyles;
    },
    currentDataTransfer() {
      return this.$store.getters.getDataTransfer;
    },
    isBorderShow() {
      return this.$store.getters.getIsElemBordersShow;
    },
  },
  watch: {
    isBorderShow(state) {
      let children = this.$el.childNodes;
      if (state && children[0]) {
        for (let childAt = 0; childAt < children.length; childAt++) {
          children[childAt].classList.add("showBorder");
        }
      } else {
        for (let childAt = 0; childAt < children.length; childAt++) {
          children[childAt].classList.remove("showBorder");
        }
      }
    },
  },
  mounted() {
  },
};
</script>

<style lang="scss">
.dropZone {
  position: relative;
  border: 1px red dashed;
  cursor: alias;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
}

.showBorder {
  box-shadow: inset 0px 0px 0px 5px rgb(255, 0, 0);
}
</style>