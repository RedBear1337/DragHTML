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
                    style: 'simple'
                },
                testTable: {
                    htmlCode: '<table class="tg">\n' +
                        '<thead>\n' +
                        '  <tr>\n' +
                        '    <th class="tg-test"></th>\n' +
                        '    <th class="tg-test"></th>\n' +
                        '    <th class="tg-test">Тестовый текст</th>\n' +
                        '    <th class="tg-test"></th>\n' +
                        '    <th class="tg-test"></th>\n' +
                        '  </tr>\n' +
                        '</thead>\n' +
                        '<tbody>\n' +
                        '  <tr>\n' +
                        '    <td class="tg-test"></td>\n' +
                        '    <td class="tg-test"></td>\n' +
                        '    <td class="tg-test"></td>\n' +
                        '    <td class="tg-test"></td>\n' +
                        '    <td class="tg-test">Не тестовый текст</td>\n' +
                        '  </tr>\n' +
                        '</tbody>\n' +
                        '</table>',
                    style: 'table',
                }
            },
            styles: {
                simple: {
                    styleCode: [{class: '.dragText', rules: 'color: red;'}]
                },
                table: {
                    styleCode: [
                        {class: '.tg', rules: 'border-collapse: collapse; border-spacing: 0;'},
                        {class: '.tg td', rules: 'border-color: black; border-style: solid; border-width: 1px; font-family: Arial, sans-serif; font-size: 14px; overflow: hidden; padding:10px 5px; word-break: normal;'},
                        {class: '.tg th', rules: 'border-color: black; border-style :solid; border-width: 1px; font-family: Arial, sans-serif; font-size: 14px; font-weight: normal; overflow: hidden; padding: 10px 5px; word-break: normal;'},
                        {class: '.tg .tg-test', rules: 'text-align: left; vertical-align: top'},
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