export default {
    state() {
        return {
            /**
             * Объект со списком пар ключ-значение, отражающий наполнение различных выпадающих списков.
             * @var
             */
            isSelected: { },
        }
    },
    mutations: {
        /**
         * Устанавливает выбранное значение уникального выпадающего списка.
         * @param state
         * @param {Object} data - Объект содержащий в себе данные выпадающего списка.
         * @param {String} data.name - название списка. Например: Фрукты
         * @param {String} data.selected - выбранное значение. Например: Банан
         */
        setSelected(state, data) {
            state.isSelected[data.name] = data.selected
        },
    },
    getters: {
        getSelectedArray(state) {
            return state.isSelected;
        }
    },
    actions: {

    }
}