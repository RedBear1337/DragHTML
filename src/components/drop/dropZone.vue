<template>
  <div :ref="'dropZone'+id" :style="`height: ${size.h};`" :id="'zone'+id" class="dropZone"
       @drop.capture.self="drop($event)"
       @dragover.prevent
       @mousemove="mouseAt($event.target)">
<!--    <resizableContainer/>-->
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
      nodes: [],
      prev: '',

      // Параметры создания элемента
      x: 0,
      y: 0,
      mw: 10,
      w: 10,
      mh: 10,
      h: 10,
    }
  },
  methods: {
    mouseAt(target) {
      // if (target !== this.prev) {
      //   console.log(target);
      //   this.prev = target;
      // }
    },
    /**
     *
     * @param {String} title - название элемента из таблицы элементов (elements)
     * @param {String} id - порядковый номер размещения элемента (не учитывая позицию в DOM дереве)
     * @param {String} x - координата внутри зоны
     * @param {String} y - координата внутри зоны
     * @param {String} mw - минимальная ширина элемента
     * @param {String} w - ширина элемента
     * @param {String} mh - минимальная высота элемента
     * @param {String} h - высота элемента
     */
    saveElem(title, id, x, y, mw, w, mh, h) {
      this.$store.commit('addElem', {
        zone: 'zone' + this.id,
        title: title,
        id: id,
        x: x,
        y: y,
        mw: mw,
        w: w,
        mh: mh,
        h: h,
      });
    },
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
        let numW = '';
        let numH = '';
        for (let char = 0; char < w.length; char++) {
          if (!isNaN(w[char])) {
            numW += w[char];
          }
        }
        for (let char = 0; char < h.length; char++) {
          if (!isNaN(h[char])) {
            numH += h[char];
          }
        }

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
      if (data.title || data.html || data.style) {
        return data;
      } else {
        throw new Error('Ошибка во время получения данных dataTransfer');
      }
    },
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
    /**
     * Возвращает преобразованную строку, добавляя указанный класс
     * @param {String} htmlCode - <div class="">...</div>
     * @param {String} className - название класса
     * @returns {String | Error}
     */
    insertClass(htmlCode, className) {
      let classCharAt = this.searchInHtmlByStr(htmlCode, ' class=');
      if (!classCharAt) {
        throw new Error('Ошибка при поиске строки. Не найден закрывающий тег. searchInHtmlByStr');
        return
      }
      if (htmlCode[classCharAt] === '>') {
        return htmlCode = htmlCode.slice(0, classCharAt) + ' class="' + className + '" ' + htmlCode.slice(classCharAt);
      } else {
        return htmlCode = htmlCode.slice(0, classCharAt) + className + ' ' + htmlCode.slice(classCharAt);
      }

    },
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
      try {
        const resizeInstance = Vue.extend(resizableContainer);
        completeElem = new resizeInstance(
            {
              propsData: {
                zone: 'zone'+this.id,
                title: title,
                pos: this.getPastePosition(event, 5, w, h),
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
      }
    },

    /**
     * Создаёт элемент в dropZone, основываясь на передаваемых данных.
     * @param event
     */
    drop(event) {
      event.preventDefault();
      console.log('TARGET: ', event.target);
      let id;

      let title;
      let html;
      let style;
      try {
        let data = this.getTransferData();
        title = data.title;
        html = data.html;
        style = data.style;
      } catch (e) {
        console.error(e);
        return;
      }

      this.$store.commit('clearDataTransfer');

      try {
        html = this.insertClass(html, '--dragMe');
      } catch (e) {
        console.error('insertClass', e);
        return;
      }
      try {
        html = this.insertAttr(html, title);
      } catch (e) {
        console.error('insertAttr', e);
        return;
      }
      try {
        if (!this.zoneElements[title]) {
          this.$store.commit('initTitle', {zone: 'zone' + this.id, title: title});
        }
        if (this.zoneElements[title].length > 0) {
          id = this.zoneElements[title][this.zoneElements[title].length - 1].id + 1;
        } else {
          id = 0;
        }

        html = this.insertId(html, title, id);
      } catch (e) {
        console.error('insertId', e);
        return;
      }

      try {
        // console.log(`
        // offX: ${event.offsetX}
        // offY: ${event.offsetY}
        // pageY: ${event.pageY}
        // pageX: ${event.pageX}
        // layerX: ${event.layerX}
        // layerY: ${event.layerY}
        // clientX: ${event.clientX}
        // clientY: ${event.clientY}
        // screenX: ${event.screenX}
        // screenY: ${event.screenY}
        // x: ${event.x}
        // y: ${event.y}
        // `);
        let coords = this.getPastePosition(event, 5, 100, 100);
        this.saveElem(title, id, coords.x, coords.y, this.mw, this.w, this.mh, this.h);
        this.initElement(html, event, title)
      } catch (e) {
        console.error('Ошибка во время инициализации элемента: ', e);
        return;
      }

      this.loadRulesForClass(style);

      // let child = this.$el.lastChild.lastChild;
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