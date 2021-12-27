export default {
    state() {
        return {
            journal: [],
            currentStep: 0,
        }
    },
    mutations: {
        /**
         * Добавить запись в журнал
         * @param state
         * @param data
         */
        addChange(state, data) {
            state.journal.unshift(data);
        },
        /**
         * Установить текущий шаг
         * @param state
         * @param num
         */
        setStep(state, num) {
            state.currentStep = num;
        },
        /**
         * Сдвигает текущее количество шагов на указанное значение
         * @param state
         * @param {Number} steps - 5 => +5 шагов || -5 => -5 шагов
         */
        moveStep(state, steps) {
            state.currentStep += steps;
        }
    },
    getters: {
        getJournalStep(state) {
            return state.currentStep;
        },
        getJournal(state) {
            return state.journal;
        },

    },
    actions: {

    }
}