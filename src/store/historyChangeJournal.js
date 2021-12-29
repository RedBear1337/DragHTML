export default {
    state() {
        return {
            step: 0,
        }
    },
    mutations: {
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
            state.step += steps;
        }
    },
    getters: {
        getStep(state) {
            return state.step;
        },
    },
    actions: {}
}