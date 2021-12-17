const zones = {
    // Номер дроп зоны
    zone1: {
        // Размещение зоны относительно верхнего края страницы
        y: '100',
        // Высота внутреннего поля зоны
        height: '200',
        // Массив элементов
        elements: {
            // title элемента
            text: [
                // id - порядковый номер создания
                // title - название (title) элемента, он записан в файле elements
                // x, y - координаты размещения в зоне
                // w - width (ширина)
                // h - height (высота)
                {id: '0', x: '10', y: '0', w: '100', h: '100'}
            ]
        }
    }
}

export default {
    state() {
        return {
            /**
             * Список дроп зон.
             * Объектом с ключами будет надёжнее, тк не придется пересчитывать порядковые номера при смене позиции в дереве.
             * Выше в файле приведен конечный вид объекта
             */
            zones: {}
        }
    },
    mutations: {
        /**
         * Добавить новую зону
         * @param state
         * @param {Object} zone
         * @param {String} zone.name - название формата zone1
         * @param {Number} zone.y - расстояние до верхнего края страницы
         * @param {Number} zone.height - высота внутренней части
         */
        addZone(state, zone) {
            state.zones[zone.name] = {
                y: zone.y,
                height: zone.height,
                elements: {}
            }
        },
        /**
         * Создаёт ключ data.title и назначает ему значение []
         * @param state
         * @param {Object} data
         * @param {String} data.zone - название формата zone1
         * @param {String} data.title - название элемента из таблицы элементов (elements)
         */
        initTitle(state, data) {
            state.zones[data.zone].elements[data.title] = [];
        },
        /**
         * Добавить новый элемент в указанную зону
         * @param state
         * @param {Object} data
         * @param {String} data.zone - название формата zone1
         * @param {String} data.title - название элемента из таблицы элементов (elements)
         * @param {String} data.id - порядковый номер размещения элемента (не учитывая позицию в DOM дереве)
         * @param {String} data.x - координата внутри зоны
         * @param {String} data.y - координата внутри зоны
         * @param {String} data.w - ширина элемента
         * @param {String} data.h - высота элемента
         */
        addElem(state, data) {
            if (state.zones[data.zone].elements[data.title]) {
                state.zones[data.zone].elements[data.title].push(
                    {id: data.id, x: data.x, y: data.y, w: data.w, h: data.h}
                );
            } else {
                console.error(new Error('Добавить элемент в список элементов не удалось. Указанный список не найден'));
            }

        },
        /**
         * Удалить зону и все элементы внутри
         * @param state
         * @param {String} zoneName - название формата zone1
         */
        destroyZone(state, zoneName) {
            delete state.zones[zoneName];
        },
        /**
         * Удалить группу элементов и все элементы внутри
         * @param state
         * @param data
         * @param data.zoneName - название формата zone1
         * @param data.titleName - название элемента из таблицы элементов (elements)
         */
        destroyTitle(state, data) {
            delete state.zones[data.zoneName].elements[data.titleName];
        },
        /**
         * Удалить элемент из массива title
         * @param state
         * @param {Object} data
         * @param {String} data.zone - название формата zone1
         * @param {String} data.title - название элемента из таблицы элементов (elements)
         * @param {String} data.id - порядковый номер размещения элемента (не учитывая позицию в DOM дереве)
         */
        removeElem(state, data) {
            state.zones[data.zone].elements[data.title] = state.zones[data.zone].elements[data.title].filter(elem => elem.id !== data.id)
        },

        /**
         * Устанавливает координаты для элемента
         * @param state
         * @param {Object} data
         * @param {String} data.zone - название формата zone1
         * @param {String} data.title - название элемента из таблицы элементов (elements)
         * @param {String} data.id - порядковый номер размещения элемента (не учитывая позицию в DOM дереве)
         * @param {String} data.x - координата внутри зоны
         * @param {String} data.y - координата внутри зоны
         */
        setCoords(state, data) {
            let elem = state.zones[data.zone].elements[data.title].find(elem => elem.id === data.id);
            elem.x = data.x;
            elem.y = data.y;
        },
        /**
         * Устанавливает размеры для элемента
         * @param state
         * @param {Object} data
         * @param {String} data.zone - название формата zone1
         * @param {String} data.title - название элемента из таблицы элементов (elements)
         * @param {String} data.id - порядковый номер размещения элемента (не учитывая позицию в DOM дереве)
         * @param {String} data.w - ширина элемента
         * @param {String} data.h - высота элемента
         */
        setSize(state, data) {
            let elem = state.zones[data.zone].elements[data.title].find(elem => elem.id === data.id);
            elem.w = data.w;
            elem.h = data.h;
        }
    },
    getters: {
        /**
         * Получить список размещенных зон
         * @param state
         * @returns { {} }
         */
        getZones(state) {
            return state.zones;
        }
    },
    actions: {}
}