<template>
  <div :ref="'dropZone'+id" :style="`width: ${size.w}; height: ${size.h};`" class="dropZone"
       @drop="$event.preventDefault()"
       @dragenter="drop($event)">

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
    triggerMouseEvent(eventType) {
      // const clickEvent = document.createEvent ('MouseEvents');
      // clickEvent.initEvent (eventType, true, true);
      // document.body.dispatchEvent(clickEvent);

      const cb = document.body;

      const event = new DragEvent('eventType', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      const cancelled = !cb.dispatchEvent(event);

      if (cancelled) {
        // A handler called preventDefault.
        console.log('canceled');
      } else {
        // None of the handlers called preventDefault.
        console.log('not canceled');
      }
      console.log('triggered');
    },
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
     */
    initElement(htmlCode) {
      try {
        const resizeInstance = Vue.extend(resizeContainer);
        const completeElem = new resizeInstance({
          propsData: {
            size: {w: 'auto', h: 'auto'}
          },

        });
        let compiledHTML = Vue.compile(htmlCode);
        completeElem.$slots.innerNode = [completeElem.$createElement(compiledHTML)];
        completeElem._self.$options
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
      console.log('styleName',styleName);
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
        this.initElement(html)
      } catch (e) {
        console.error('Ошибка во время инициализации элемента: ', e);
        return;
      }
      this.loadRulesForClass(style);
      // this.triggerMouseEvent('dragend');
      // this.triggerMouseEvent('drop');
      // console.log(
      //     this.$refs['dropZone' + this.id].lastChild.firstChild
      // );
      //
      // // document.documentElement.addEventListener("mouseup", this.handleUp, true);
      // document.documentElement.addEventListener(
      //     "mouseup",
      //     this.handleDown,
      //     true
      // );


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
  //&:-moz-drag-over {
  //  background: greenyellow;
  //}
}
</style>