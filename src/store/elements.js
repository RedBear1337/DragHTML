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
        // Массив css правил правил для классов. Обязательно присвоение только к классам, но не элементам.
        styleCode: [{class: 'someClass', rules: 'color: red'}]
    }
}
// Список примененных к документу стилей. (Чтобы избежать дублирования)
let appliedStyles = [{name: 'table'}]
 */

export default {
    state() {
        return {
            elements: {
                test: {
                    htmlCode: '<div class="dragText"><span>Some text</span></div>',
                    style: 'simple',
                    sizeInPixel: {w: 80, h: 24}
                },
                testTable: {
                    htmlCode: '<table class="dragTable"><thead><tr><th class="teh"></th><th class="teh"></th><th class="teh">Тестовый текст</th><th class="teh"></th><th class="teh"></th></tr></thead><tbody><tr><td class="ted"></td><td class="ted"></td><td class="ted"></td><td class="ted"></td><td class="ted">Не тестовый текст</td></tr></tbody></table>',
                    style: 'table',
                    sizeInPixel: {w: 276, h: 71}
                }
            },
            styles: {
                simple: {
                    styleCode: [{class: '.dragText', rules: 'color: red;'}]
                },
                table: {
                    styleCode: [
                        {class: '.dragTable', rules: 'border-collapse: collapse; border-spacing: 0;'},
                        {class: '.ted', rules: 'text-align: left; vertical-align: top; border-color: black; border-style: solid; border-width: 1px; font-family: Arial, sans-serif; font-size: 14px; overflow: hidden; padding:10px 5px; word-break: normal;'},
                        {class: '.teh', rules: 'text-align: left; vertical-align: top; border-color: black; border-style: solid; border-width: 1px; font-family: Arial, sans-serif; font-size: 14px; overflow: hidden; padding:10px 5px; word-break: normal;'},
                    ]
                }
            },
            appliedStyles: []
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
        /**
         * Добавить примененный стиль
         * @param state
         * @param {String} styleName - название стиля
         */
        addApplied(state, styleName) {
            state.appliedStyles.push(styleName);
        },
        /**
         * Удалить примененный стиль
         * @param state
         * @param {String} styleName - название стиля
         */
        removeApplied(state, styleName) {
            state.appliedStyles = state.appliedStyles.filter(style=>style !== styleName);
        }

    },
    getters: {
        getElements(state) {
            return state.elements;
        },
        getStyles(state) {
            return state.styles;
        },
        getAppliedStyles(state) {
            return state.appliedStyles;
        }
    },
    actions: {}
}