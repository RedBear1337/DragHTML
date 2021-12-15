export default {
    state() {
        return {
            dataTransfer: { }
        }
    },
    mutations: {
        setDataTransfer(state, data) {
            state.dataTransfer = data;
        },
        clearDataTransfer(state) {
            state.dataTransfer = {}
        }
    },
    getters: {
        getDataTransfer(state) {
            return state.dataTransfer;
        }
    },
    actions: {

    }
}