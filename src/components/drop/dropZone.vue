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
  components: { resizableContainer },
  props: ["id", "size"],
  data() {
    return {
      // Drag
      dragged: {},

      pastePos: { x: 0, y: 0 },

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
    getTransferData() {
      let data = this.currentDataTransfer;
      let keys = Object.keys(data);
      for (let key of keys) {
        if (key === undefined) {
          throw new Error("key === undefined");
          return;
        }
      }
      return data;
    },
    /**
     * Возвращает максимальный, соответствующий title, elemId+1
     * @returns {Number}
     */
    getElementId() {
      let sameTitle = [];
      try {
        let children = this.getAllElements();
        for (let child of children) {
          if (child.title === this.title) {
            sameTitle.push(parseInt(child.id.replace(this.title, "")));
          }
        }
      } catch (e) {
        throw new Error("Ошибка при получении id элемента: ") + e;
        return;
      }

      return Math.max(...sameTitle) < 1 ? 1 : Math.max(...sameTitle) + 1;
    },
    /**
     * Возвращает размеры и координаты всех дочерних элементов dropZone в виде массива
     * @returns {*[]}
     */
    getZoneElements(zone) {
      const children = zone.childNodes;
      let properties = [];
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
      return properties;
    },
    /**
     * Возвращает размеры и координаты всех дочерних элементов всех dropZone в виде массива
     * @returns {*[]}
     */
    getAllElements() {
      const zones = this.$el.parentNode.childNodes;
      let properties = [];
      for (let zone of zones) {
        properties.push(...this.getZoneElements(zone));
      }
      return properties;
    },

    // Insert methods
    /**
     * Возвращает позицию первого символа после искомого слова в строке или перед '>';
     * @param {String} where - где искать
     * @param {String} which - что искать
     * @returns {Number | undefined}
     */
    searchInHtmlByStr(where, which) {
      let startCharAt = 0;
      if (where.search(which) >= 0) {
        startCharAt = where.search(which) + which.length + 1;
      } else if (where.search(">") >= 0) {
        startCharAt = where.search(">");
      } else {
        return undefined;
      }
      return startCharAt;
    },
    /**
     * Возвращает преобразованную строку, добавляя указанный атрибут title
     * @param {String} htmlCode - <div title="">...</div>
     * @param {String} titleName - название title
     * @param {number} id - номер id
     * @returns {String | Error}
     */
    insertId(htmlCode, titleName, id) {
      let idCharAt = this.searchInHtmlByStr(htmlCode, " id=");
      if (!idCharAt) {
        throw new Error(
          "Ошибка при поиске строки. Не найден закрывающий тег. searchInHtmlByStr"
        );
        return;
      }
      if (htmlCode[idCharAt] === ">") {
        return (htmlCode =
          htmlCode.slice(0, idCharAt) +
          ' id="' +
          titleName +
          id +
          '" ' +
          htmlCode.slice(idCharAt));
      } else {
        return (htmlCode =
          htmlCode.slice(0, idCharAt) +
          titleName +
          id +
          " " +
          htmlCode.slice(idCharAt));
      }
    },
    /**
     * Возвращает преобразованную строку, добавляя указанный атрибут title
     * @param {String} htmlCode - <div title="">...</div>
     * @param {String} titleName - название title
     * @returns {String | Error}
     */
    insertAttr(htmlCode, titleName) {
      let openTagCharAt = this.searchInHtmlByStr(htmlCode, " title=");
      if (!openTagCharAt) {
        throw new Error(
          "Ошибка при поиске строки. Не найден закрывающий тег. searchInHtmlByStr"
        );
        return;
      }
      if (htmlCode[openTagCharAt] === ">") {
        return (htmlCode =
          htmlCode.slice(0, openTagCharAt) +
          ' title="' +
          titleName +
          '" ' +
          htmlCode.slice(openTagCharAt));
      } else {
        return (htmlCode =
          htmlCode.slice(0, openTagCharAt) +
          titleName +
          " " +
          htmlCode.slice(openTagCharAt));
      }
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
        throw e;
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
        throw new Error("Не удалось вычислить размер элемента: ") + e;
      }
    },

    defineElemSizeOnDrop(sizeObj, defaultValue) {
      try {
        this.w = this.computeElemSize(sizeObj.w, defaultValue);
        this.minW = this.computeElemSize(sizeObj.minW, this.w);
        this.maxW = this.computeElemSize(sizeObj.maxW, "");
      } catch (e) {
        throw new Error("Ошибка при получении ширины элемента: ") + e;
      }
      try {
        this.h = this.computeElemSize(sizeObj.h, defaultValue);
        this.minH = this.computeElemSize(sizeObj.minH, this.h);
        this.maxH = this.computeElemSize(sizeObj.maxH, "");
      } catch (e) {
        throw new Error("Ошибка при получении высоты элемента: ") + e;
      }
    },

    // Create elem Methods
    /**
     * Преобразует передаваемые через transferData данные в форму для вставки.
     * @param event
     * @param transferData
     */
    insertTransformed(event, transferData) {
      this.title = transferData.title;
      this.html = transferData.html;
      this.style = transferData.style;
      this.defaultSize = transferData.defaultSize;

      // Define elem sizes
      try {
        this.defineElemSizeOnDrop(this.defaultSize, 20);
      } catch (e) {
        console.error(e);
        return;
      }

      //========= Prepare

      // Get id
      try {
        this.elemId = this.getElementId();
      } catch (e) {
        console.error(e);
        return;
      }

      // Init
      try {
        if (
          !this.checkPlaceFreedom(event, false, this.$el, {
            width: this.w,
            height: this.h,
            id: this.title + this.elemId,
          })
        ) {
          this.initElement(event);
        }
      } catch (e) {
        console.error("Ошибка во время инициализации элемента: ", e);
        return;
      }

      // Setting Attributes
      try {
        this.setAttr();
      } catch (e) {
        console.error("Ошибка при установке аттрибутов: ", e);
      }

      // load Classes
      try {
        this.loadRulesForClass();
      } catch (e) {
        console.error("Ошибка при загрузке стилей: ", e);
      }

      this.initDraggable();
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
          }
        },
      }); //**** не отправляются координаты и размеры, только тип элемента.
    },
    /**
     * Инициализация и рендер элемента в dropZone
     * @param event
     */
    initElement(event) {
      let completeElem;
      let replaceMe = document.createElement("div");
      replaceMe.className = "replaceMe";
      this.$el.appendChild(replaceMe);
      try {
        const resizeInstance = Vue.extend(resizableContainer);
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

        let compiledHTML = Vue.compile(this.html);

        completeElem.$slots.innerNode = [
          completeElem.$createElement(compiledHTML),
        ];
        completeElem.$mount(".replaceMe");
      } catch (e) {
        throw e;
      }
    },

    // Init Methods
    /**
     * Вешает drag ивенты на созданный элемент
     * @param id
     */
    initDraggable(id) {
      if (!id) {
        const lastChild = this.$el.lastChild;
        lastChild.addEventListener("dragstart", this.dragCheck, true);
        lastChild.addEventListener("dragend", this.dragEnd);
      } else {
        const elem = document.getElementById(id);
        elem.addEventListener("dragstart", this.dragCheck, true);
        elem.addEventListener("dragend", this.dragEnd);
      }
    },
    /**
     * Инициализировать drop элемента
     * @param event
     */
    initDrop(event) {
      let transferData;
      try {
        transferData = this.getTransferData();
        this.$store.commit("clearDataTransfer");
        if (!transferData.prepare) {
          if (!transferData.dragged) {
            console.warn(
              "Перетаскиваемый объект не является подходящим для вставки. initDrop"
            );
            return;
          }
        }
      } catch (e) {
        console.error("Ошибка во время получения данных transferData: ", e);
        return;
      }
      if (transferData.prepare) {
        this.insertTransformed(event, transferData);
        this.updateEvent();
      } else {
        let elem = transferData.dragged;

        if (!this.checkPlaceFreedom(event, elem, event.target, false)) {
          if (!this.checkZone(event, elem)) {
            this.changeZone(event, elem);
          }

          this.changePlace(event, elem);
          this.updateEvent();
        }
      }
    },

    // Drag Methods
    dragCheck(e) {
      if (!e.target.classList.contains("resize__handler")) {
        this.dragStart(e);
      }
    },
    dragStart(e) {
      this.dragged = e.target;
      let w = parseInt(this.dragged.style.width) / 2;
      let h = parseInt(this.dragged.style.height) / 2;

      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("prepare", false);

      e.dataTransfer.setDragImage(e.target, w, h);

      this.$store.commit("setDataTransfer", { dragged: this.dragged });
      this.$store.commit("setShowState", {
        name: "showElemBorders",
        state: true,
      });
    },
    dragEnd(e) {
      this.$store.commit("setShowState", {
        name: "showElemBorders",
        state: false,
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
        throw new Error("Ошибка при создании класса: ") + e;
        return;
      }
    },
    /**
     * Загрузить в head стили для элемента
     */
    loadRulesForClass() {
      if (!this.appliedStyles.some((style) => style === this.style)) {
        this.$store.commit("addApplied", this.style);

        let classes = this.styles[this.style].styleCode;

        try {
          for (let item of classes) {
            this.createClass(item.class, item.rules);
          }
        } catch (e) {
          console.error(e);
          return;
        }
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
        throw new Error("Один из передаваемых аргументов - undefined. ");
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
      return !(
        a.y + a.h < b.y ||
        a.y > b.y + b.h ||
        a.x + a.w < b.x ||
        a.x > b.x + b.w
      );
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
      let result = { x: x, y: y };
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
    },
    /**
     * Проверяет, свободно ли пространство для установки объекта и записывает координаты в this.pastePos
     * @param event
     * @param {Node | Boolean} elem
     * @param {{width: number, id: string, height: number}} options - опциональный параметр.
     * @param {Number} options.width - ширина
     * @param {Number} options.height - высота
     * @param {String} options.id - id элемента
     * @returns {boolean}
     */
    checkPlaceFreedom(event, elem, zone, options) {
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
        throw new Error("Ошибка при получении ширины и высоты: ") + e;
        return;
      }

      let bounds;
      try {
        let paste = this.getPastePosition(event, 5, w, h);
        bounds = this.checkBounds(paste.x, paste.y, w, h);
      } catch (e) {
        throw (
          new Error("Ошибка при получении координат для вставки элемента: ") + e
        );
        return;
      }

      let checkElements;
      try {
        let elemId = elem.id || options.id;
        checkElements = this.getZoneElements(zone).filter(
          (child) => child.id !== elemId
        );
      } catch (e) {
        throw new Error("Ошибка при получении списка элементов зоны: ") + e;
        return;
      }

      let result = false;
      try {
        for (let check of checkElements) {
          let checkObj = {
            w: parseInt(check.w),
            h: parseInt(check.h),
            y: parseInt(check.y),
            x: parseInt(check.x),
          };
          result = this.isCollide(
            { w: w, h: h, y: bounds.y, x: bounds.x },
            checkObj
          );
          if (result) {
            return result;
          }
        }
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
  mounted() {},
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