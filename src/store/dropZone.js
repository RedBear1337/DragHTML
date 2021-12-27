const zones = [
    {
        // Номер дроп зоны
        id: 'zone1',
        // Размещение зоны относительно верхнего края страницы
        y: '100',
        // Высота внутреннего поля зоны
        height: '200',
    }
]

export default {
    state() {
        return {
            /**
             * Список дроп зон.
             * Выше в файле приведен конечный вид объекта
             */
            zones: [],
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
            state.zones.push({
                id: zone.name,
                y: zone.y,
                height: zone.height,
            })
        },
        /**
         * Удалить зону
         * @param state
         * @param {String} zoneId - название формата zone1
         */
        destroyZone(state, zoneId) {
            state.zones = state.zones.filter(zone=>zone.id !== zoneId);
        },
    },
    getters: {
        /**
         * Получить список размещенных зон
         * @param state
         * @returns { [] }
         */
        getZones(state) {
            return state.zones;
        },
    },
    actions: {}
}