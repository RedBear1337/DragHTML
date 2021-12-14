<template>
  <div :ref="'dropZone'+id" :style="`width: ${size.w}; height: ${size.h};`" class="dropZone"
       @drop="drop($event)"
       @dragover="$event.preventDefault()">
    <resizeContainer :node="node" :key="node.id" v-for="node of nodes"/>
  </div>
</template>

<script>
import Vue from 'vue'

import resizeContainer from "@/components/drop/resizeContainer";
import VueResizable from 'vue-resizable'

export default {
  name: "dropZone",
  components: {resizeContainer, VueResizable},
  props: ['id', 'size'],
  data() {
    return {
      nodes: []
    }
  },
  methods: {
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
        return new Error('Ошибка при вставке класса. insertClass');
      }
      return htmlCode = htmlCode.slice(0, classCharAt) + className + ' ' + htmlCode.slice(classCharAt);
    },
    /**
     * Инициализация и рендер элемента в dropZone
     * @param {String} htmlCode - <div class="">...</div>
     */
    initElement(htmlCode) {
      try {
        const resizeInstance = Vue.extend(resizeContainer);
        const completeElem = new resizeInstance({
          propsData: {
            size: {w: 'auto', h: 'auto'}
          }
        });
        let compiledHTML = Vue.compile(htmlCode);
        completeElem.$slots.innerNode = [completeElem.$createElement(compiledHTML)];
        completeElem.$mount();
        this.$refs['dropZone' + this.id].appendChild(completeElem.$el);
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
      let title;
      let html;
      let style;
      try {
        title = event.dataTransfer.getData('title');
        html = event.dataTransfer.getData('html');
        style = event.dataTransfer.getData('style');
      } catch (e) {
        console.error('Ошибка во время получения переменных для создания элемента: ', e);
        return;
      }

      try {
        html = this.insertClass(html, '--dragMe')
      } catch (e) {
        console.error(e);
        return;
      }

      try {
        this.initElement(html)
      } catch (e) {
        console.error('Ошибка во время инициализации элемента: ', e);
        return;
      }
      this.loadRulesForClass(style);
    }
  },
  computed: {
    styles() {
      return this.$store.getters.getStyles;
    },
    appliedStyles() {
      return this.$store.getters.getAppliedStyles;
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