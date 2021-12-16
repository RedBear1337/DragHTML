<template>
  <div :ref="'dropZone'+id" :style="`width: ${size.w}; height: ${size.h};`" class="dropZone"
       @drop.capture="drop($event)"
       @dragover.prevent>
  </div>
</template>

<script>
import Vue from 'vue'

import resizableContainer from "@/components/drop/resizableContainer";

export default {
  name: "dropZone",
  components: {resizableContainer},
  props: ['id', 'size'],
  data() {
    return {
      nodes: [],
    }
  },
  methods: {
    /**
     * Не поддерживает % в size
     * @param event
     * @param {String | Number} width - ширина размещаемого объекта
     * @param {String | Number} height - высота размещаемого объекта
     * @returns {{x: number, y: number}}
     */
    getPastePosition(event, width, height) {
      let x = event.offsetX;
      let y = event.offsetY;
      let w = width;
      let h = height;

      if (isNaN(w) || isNaN(h)) {
        let numW = '';
        let numH = '';
        for (let char = 0; char < w.length; char++) {
          if (!isNaN(w[char])) {
            numW+=w[char];
          }
        }
        for (let char = 0; char < h.length; char++) {
          if (!isNaN(h[char])) {
            numH+=h[char];
          }
        }

        w = w === 'auto' ? 100 : numW;
        h = h === 'auto' ? 100 : numW;
      }

      return {x: Math.round(x - w/2), y: Math.round(y - h/2)};
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
     * Возвращает преобразованную строку, добавляя указанный класс
     * @param {String} htmlCode - <div class="">...</div>
     * @param {String} className - название класса
     * @returns {String | Error}
     */
    insertClass(htmlCode, className) {
      let classCharAt = 0;
      if (htmlCode.search('class="') >= 0) {
        classCharAt = htmlCode.search('class="') + 7;
      } else if (htmlCode.search('>') >= 0) {
        classCharAt = htmlCode.search('>');
        return htmlCode = htmlCode.slice(0, classCharAt) + ' ' + className + ' ' + htmlCode.slice(classCharAt);
      } else {
        throw new Error('Ошибка при вставке класса. insertClass');
      }
      return htmlCode = htmlCode.slice(0, classCharAt) + className + ' ' + htmlCode.slice(classCharAt);
    },
    /**
     * Инициализация и рендер элемента в dropZone
     * @param {String} htmlCode - <div class="">...</div>
     * @param event
     */
    initElement(htmlCode, event) {
      let w = 100;
      let h = 100;

      let completeElem;
      let replaceMe = document.createElement('div')
      replaceMe.className = 'replaceMe';
      this.$refs['dropZone' + this.id].appendChild(replaceMe);
      try {
        const resizeInstance = Vue.extend(resizableContainer);
        completeElem = new resizeInstance (
            {
              propsData: {
                pos: this.getPastePosition(event, w, h)
              },
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

      console.log('TARGET: ',event.target);

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
        html = this.insertClass(html, '--dragMe')
      } catch (e) {
        console.error(e);
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
        this.initElement(html, event)
      } catch (e) {
        console.error('Ошибка во время инициализации элемента: ', e);
        return;
      }
      this.loadRulesForClass(style);


      let child = this.$refs['dropZone'+this.id].lastChild.lastChild;
    }
  },
  computed: {
    styles() {
      return this.$store.getters.getStyles;
    },
    appliedStyles() {
      return this.$store.getters.getAppliedStyles;
    },
    currentDataTransfer(state) {
      return this.$store.getters.getDataTransfer;;
    }
  },
  watch: {},
  mounted() {

  }
}
</script>

<style lang="scss">
.dropZone {
  position: relative;
  border: 1px red dashed;
  cursor: alias;
}
</style>