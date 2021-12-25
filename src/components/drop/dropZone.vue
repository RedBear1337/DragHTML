<template>
  <div :ref="'dropZone'+id" :style="`height: ${size.h};`" :id="'zone'+id" class="dropZone"
       @drop.capture.self.prevent="initDrop($event)"
       @dragover.prevent
  >

  </div>
</template>

<script>
import Vue from 'vue'
import store from "@/store";

import resizableContainer from "@/components/drop/resizableContainer";

export default {
  name: "dropZone",
  components: {resizableContainer},
  props: ['id', 'size'],
  data() {
    return {
      // Параметры создания элемента
      x: 0,
      y: 0,
      mw: 10,
      w: 10,
      mh: 10,
      h: 10,

      // Drag
      dragged: {}
    }
  },
  methods: {
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
      let x = this.x = event.offsetX;
      let y = this.y = event.offsetY;
      let w = this.w = width;
      let h = this.h = height;

      let response;

      if (isNaN(w) || isNaN(h)) {
        let numW = parseInt(w);
        let numH = parseInt(h);

        w = w === 'auto' ? 100 : numW;
        h = h === 'auto' ? 100 : numH;
      }

      // Убрать дробь, округлить согласно кратности
      response = {
        x: Math.ceil(
            Math.round(x - w / 2) / round
        ) * round,
        y: Math.ceil(
            Math.round(y - h / 2) / round
        ) * round
      }
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
          throw new Error('Ошибка во время получения данных dataTransfer');
          return
        }
      }
      return data;
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
      } else if (where.search('>') >= 0) {
        startCharAt = where.search('>');
      } else {
        return undefined
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
      let idCharAt = this.searchInHtmlByStr(htmlCode, ' id=');
      if (!idCharAt) {
        throw new Error('Ошибка при поиске строки. Не найден закрывающий тег. searchInHtmlByStr');
        return
      }
      if (htmlCode[idCharAt] === '>') {
        return htmlCode = htmlCode.slice(0, idCharAt) + ' id="' + titleName + id + '" ' + htmlCode.slice(idCharAt);
      } else {
        return htmlCode = htmlCode.slice(0, idCharAt) + titleName + id + ' ' + htmlCode.slice(idCharAt);
      }
    },
    /**
     * Возвращает преобразованную строку, добавляя указанный атрибут title
     * @param {String} htmlCode - <div title="">...</div>
     * @param {String} titleName - название title
     * @returns {String | Error}
     */
    insertAttr(htmlCode, titleName) {
      let openTagCharAt = this.searchInHtmlByStr(htmlCode, ' title=');
      if (!openTagCharAt) {
        throw new Error('Ошибка при поиске строки. Не найден закрывающий тег. searchInHtmlByStr');
        return
      }
      if (htmlCode[openTagCharAt] === '>') {
        return htmlCode = htmlCode.slice(0, openTagCharAt) + ' title="' + titleName + '" ' + htmlCode.slice(openTagCharAt);
      } else {
        return htmlCode = htmlCode.slice(0, openTagCharAt) + titleName + ' ' + htmlCode.slice(openTagCharAt);
      }
    },

    // Init Methods
    /**
     * Инициализация и рендер элемента в dropZone
     * @param {String} htmlCode - <div class="">...</div>
     * @param event
     * @param title
     */
    initElement(htmlCode, event, title) {
      let w = 100;
      let h = 100;

      let completeElem;
      let replaceMe = document.createElement('div')
      replaceMe.className = 'replaceMe';
      this.$el.appendChild(replaceMe);
      let pos = this.getPastePosition(event, 5, w, h);
      pos = this.checkBounds(pos.x, pos.y, w, h);
      try {
        const resizeInstance = Vue.extend(resizableContainer);
        completeElem = new resizeInstance(
            {
              propsData: {
                // zone: 'zone'+this.id,
                // title: title,
                pos: pos,
                size: {w: w, h: h}
              },
              store
            }
        );

        let compiledHTML = Vue.compile(htmlCode);

        completeElem.$slots.innerNode = [completeElem.$createElement(compiledHTML)];
        completeElem.$mount('.replaceMe');
      } catch (e) {
        return e;
      }
    },

    // Drag Methods
    dragCheck(e) {
      if (!e.target.classList.contains('resize__handler')) {
        this.dragStart(e);
      }
    },
    dragStart(e) {
      this.dragged = e.target;
      let w = parseInt(this.dragged.style.width) / 2;
      let h = parseInt(this.dragged.style.height) / 2;

      // const cloned = this.dragged.cloneNode(true);
      e.dataTransfer.dropEffect = 'move';
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('prepare', false);

      e.dataTransfer.setDragImage(e.target, w, h);
      // e.dataTransfer.setData('cloned', cloned);
      //
      // this.$store.commit('setDataTransfer', {
      //   prepare: false,
      //   clonedNode: cloned
      // });

      this.$store.commit('setShowState', {name: 'showElemBorders', state: true});
    },
    dragEnd(e) {
      this.$store.commit('setShowState', {name: 'showElemBorders', state: false});
    },
    initDraggable(id) {
      // Вешать на клик draggable или на mouseDown
      // mousedown за исключением handler ов
      if (!id) {
        const lastChild = this.$el.lastChild;
        lastChild.addEventListener('dragstart', this.dragCheck, true)
        lastChild.addEventListener('dragend', this.dragEnd)
      } else {
        const elem = document.getElementById(id);
        elem.addEventListener('dragstart', this.dragCheck, true)
        elem.addEventListener('dragend', this.dragEnd)
      }
    },

    // Style load Methods
    /**
     * Создать класс и добавить его в head
     * @param {String} className - название класса
     * @param {String} rules - список правил строкой. Например: 'color: green;'
     */
    createClass(className, rules) {
      const style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = `${className} {\n` +
          `${rules} }`;
      document.getElementsByTagName('head')[0].appendChild(style);
    },
    /**
     * Загрузить в head стили для элемента
     * @param {String} styleName - название стиля
     */
    loadRulesForClass(styleName) {
      if (!this.appliedStyles.some(style => style === styleName)) {
        this.$store.commit('addApplied', styleName);

        let classes = this.styles[styleName].styleCode;

        for (let item of classes) {
          this.createClass(item.class, item.rules);
        }
      } else {
        throw new Error(`style: ${styleName} не найден`)
      }
    },
    /**
     * Устанавливает значения атрибутов для созданного элемента
     * @param titleName
     * @param id
     */
    setAttr(titleName, id) {
      if (titleName || id) {
        this.$el.lastChild.draggable = true;
        this.$el.lastChild.title = titleName;
        this.$el.lastChild.id = titleName + id;
      } else {
        throw new Error('Один из передаваемых аргументов - undefined');
      }
    },
    /**
     * Возвращает размеры и координаты всех дочерних элементов dropZone в виде массива
     * @param exceptId
     * @returns {*[]}
     */
    getZoneChildProperties(exceptId) {
      const children = this.$el.childNodes;
      let properties = [];
      for (let child of children) {
        properties.push(
            {
              id: child.id,
              w: child.style.width,
              h: child.style.height,
              y: child.style.top,
              x: child.style.left
            }
        )
      }
      return properties.filter(prop => prop.id !== exceptId);
    },
    /**
     * Проверяет, не соприкасается ли элемент с другим
     * @param a
     * @param b
     * @returns {boolean}
     */
    isCollide(a, b) {
      return !(
          ((a.y + a.h) < (b.y)) ||
          (a.y > (b.y + b.h)) ||
          ((a.x + a.w) < b.x) ||
          (a.x > (b.x + b.w))
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
        result.y = zoneHeight-h;
      }
      if (top < 0) {
        result.y = 0;
      }
      if (left < 0) {
        result.x = 0;
      }
      if (right > zoneWidth) {
         result.x = zoneWidth-w;
      }
      return result;
    },
    /**
     * Проверяет, свободно ли пространство для установки объекта
     * @param event
     * @param elem
     * @returns {boolean}
     */
    checkPlaceFreedom(event, elem) {
      const w = elem.style.width;
      const h = elem.style.height;
      const calcPos = this.getPastePosition(event, 5, w, h);

      const checkElements = this.getZoneChildProperties(elem.id);

      let result = false;
      for (let check of checkElements) {
        result = this.isCollide([w, h, calcPos.y, calcPos.x], check)
        if (result) {
          return result
        }
      }
      return result
    },

    /**
     * Преобразует передаваемые через transferData данные в форму для вставки.
     * @param event
     * @param transferData
     */
    insertTransformed(event, transferData) {
      let id;

      let title = transferData.title;
      let html = transferData.html;
      let style = transferData.style;

      // Prepare

      // try {
      //   html = this.insertAttr(html, title);
      // } catch (e) {
      //   console.error('insertAttr', e);
      //   return;
      // }

      // Get id
      try {
        if (!this.zoneElements[title]) {
          this.$store.commit('initTitle', {zone: 'zone' + this.id, title: title});
        }
        if (this.zoneElements[title].length > 0) {
          id = this.zoneElements[title][this.zoneElements[title].length - 1].id + 1;
        } else {
          id = 0;
        }

        // html = this.insertId(html, title, id);
      } catch (e) {
        console.error('insertId', e);
        return;
      }

      // Init
      try {
        this.initElement(html, event, title)
      } catch (e) {
        console.error('Ошибка во время инициализации элемента: ', e);
        return;
      }

      // Setting Attributes
      try {
        this.setAttr(title, id);
      } catch (e) {
        console.error('Ошибка при установке аттрибутов: ', e);
      }

      // load Classes
      try {
        this.loadRulesForClass(style);
      } catch (e) {
        console.error('Ошибка при загрузке стилей: ', e);
      }

      this.initDraggable();
    },
    /**
     * Копирует и вставляет элемент
     * @param event
     * @param {Node} elem - скопированный элемент
     */
    insertCopied(event, elem) {
      const w = elem.style.width;
      const h = elem.style.height;
      const calcPos = this.getPastePosition(event, 5, w, h);
      let div = document.createElement('div');

      // Что применится - стили mounted компонента (которые style) или div?
      // div.style.position: relative;
      div.style.left = calcPos.x + 'px';
      div.style.top = calcPos.y + 'px';
      // elem.style.top = calcPos.y + 'px';
      try {
        this.$el.appendChild(div);
      } catch (e) {
        throw new Error('Не удалось вставить элемент');
        return
      }
      this.dragged.__vue__.$mount(this.$el.lastChild);
    },
    removeOrigin(id) {
      let origin = document.getElementById(id);
      origin.remove();
    },
    /**
     * Устанавливает новые координаты для элемента на основе местоположения курсора
     * @param event
     * @param {Node} elem
     */
    changePlace(event, elem) {
      const w = elem.style.width;
      const h = elem.style.height;
      const calcPos = this.getPastePosition(event, 5, w, h);
      const bounds = this.checkBounds(calcPos.x, calcPos.y, w, h);

      elem.style.left = bounds.x + 'px';
      elem.style.top = bounds.y + 'px';
    },
    /**
     * Инициализировать drop элемента
     * @param event
     */
    initDrop(event) {
      let transferData;
      try {
        transferData = this.getTransferData();
        this.$store.commit('clearDataTransfer');
      } catch (e) {
        console.error(e);
        return
      }

      if (transferData.prepare) {
        this.insertTransformed(event, transferData);
      } else {
        let elem = this.dragged;
        if (!this.checkPlaceFreedom(event, elem)) {
          // this.insertCopied(event, elem);
          // this.removeOrigin(elem.id);
          // this.initDraggable(elem.id);
          this.changePlace(event, elem);
        }
      }
    }

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
    zoneElements() {
      return this.$store.getters.getZones['zone' + this.id].elements;
    }
  },
  watch: {
    isBorderShow(state) {
      let children = this.$el.childNodes;
      if (state && children[0]) {
        for (let childAt = 0; childAt < children.length; childAt++) {
          children[childAt].classList.add('showBorder');
        }
      } else {
        for (let childAt = 0; childAt < children.length; childAt++) {
          children[childAt].classList.remove('showBorder');
        }
      }
    },
  },
  mounted() {
  }
}
</script>

<style lang="scss">
.dropZone {
  position: relative;
  border: 1px red dashed;
  cursor: alias;
  width: 100%;
  margin: 0 auto;
}

.showBorder {
  box-shadow: inset 0px 0px 0px 5px rgb(255, 0, 0);
}
</style>