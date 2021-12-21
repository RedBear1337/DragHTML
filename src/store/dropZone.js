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
                // zone - в какой зоне расположен элемент
                // id - порядковый номер создания
                // title - название (title) элемента, он записан в файле elements
                // x, y - координаты размещения в зоне
                // mw - minWidth минимальная ширина
                // w - width (ширина)
                // mh - minHeight минимальная высота
                // h - height (высота)
                {
                    zone: 'zone1',
                    id: '0',
                    x: '10',
                    y: '0',
                    mw: '50',
                    w: '100',
                    mh: '50',
                    h: '100'
                }
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
            zones: {},
            tempMoveJournal: [],
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
         * @param {Object} elem
         * @param {String} elem.zone - название формата zone1
         * @param {String} elem.title - название элемента из таблицы элементов (elements)
         * @param {String} elem.id - порядковый номер размещения элемента (не учитывая позицию в DOM дереве)
         * @param {String} elem.x - координата внутри зоны
         * @param {String} elem.y - координата внутри зоны
         * @param {String} elem.mw - минимальная ширина элемента
         * @param {String} elem.w - ширина элемента
         * @param {String} elem.mh - минимальная высота элемента
         * @param {String} elem.h - высота элемента
         */
        addElem(state, elem) {
            if (state.zones[elem.zone].elements[elem.title]) {
                state.zones[elem.zone].elements[elem.title].push(
                    {
                        zone: elem.zone,
                        id: elem.id,
                        x: elem.x,
                        y: elem.y,
                        mw: elem.mw,
                        w: elem.w,
                        mh: elem.mh,
                        h: elem.h
                    }
                );
            } else {
                console.error(new Error('Добавить элемент в список элементов не удалось. Указанный список не найден'));
            }

        },
        /**
         * Заменяет данные элемента в списке.
         * @param state
         * @param elem
         * @param elem.which - какой
         * @param elem.to - на что
         */
        replaceElem(state, elem) {
            elem.which = elem.to;
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
            let elem = state.zones[data.zone].elements[data.title].find(item => item.id == data.id);
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
            let elem = state.zones[data.zone].elements[data.title].find(item => item.id == item.id);
            elem.w = data.w;
            elem.h = data.h;
        },

        // temporary move
        /**
         *
         * @param state
         * @param {Object} coords
         * @param {String | Number} coords.x
         * @param {String | Number} coords.y
         * @param {String | Number} coords.w
         * @param {String | Number} coords.h
         */
        saveOnMove(state, obj) {
            state.tempMoveJournal.unshift(obj)
        },
        moveBackByOne(state) {
            state.currentMove = state.tempMoveJournal.shift();
            console.log('state.tempMoveJournal', state.tempMoveJournal);
        },
        clearMoveJournal(state) {
            state.tempMoveJournal = [];
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
        },
        getMoveJournal(state) {
            return state.tempMoveJournal;
        },
        getLastMove(state) {
            return state.tempMoveJournal[0];
        }
    },
    actions: {}
}