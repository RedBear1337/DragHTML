/*
let elementsList = {
    // Html name - уникальное название элемента для отображения в списке
    input: {
        // html код
        htmlCode: '',
        // Название стиля => если название отсутствует в styles, то создается, если существует, то данные оттуда подтягиваются
        style: '',
    }
}
let styles = {
    // Уникальное название стиля.
    Jonny_Silverhand: {
        // css код, присваивающий стили только к !!КЛАССАМ!!, но не элементам.
        styleCode: ''
    }
}
 */

export default {
    state() {
        return {
            elements: {},
            styles: {},
        }
    },
    mutations: {
        /**
         * Задаёт значение массиву elements
         * @param state
         * @param {Object} data
         */
        setElementsList(state, data) {
            state.elements = data;
        },
        /**
         * Задаёт значение массиву styles
         * @param state
         * @param {Object} data
         */
        setStylesList(state, data) {
            state.styles = data;
        },
        /**
         * Добавляет в массив элементов новый элемент
         * @param state
         * @param {Object} elementData
         */
        addElement(state, elementData) {
            state.elements[elementData.name] = elementData.content;
        },
        /**
         * Добавляет в массив стилей новый стиль
         * @param state
         * @param {Object} elementData
         */
        addStyle(state, elementData) {
            state.styles[elementData.name] = elementData.content;
        },

    },
    getters: {
        getElements(state) {
            return state.elements;
        },
        getStyles(state) {
            return state.styles;
        },
    },
    actions: {}
}