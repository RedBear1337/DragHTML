export default {
    state() {
        return {
            showElemBorders: false,
        }
    },
    mutations: {
        toggleShowState(state, showName) {
            state[showName] = !state[showName];
        },
        setShowState(state, show) {
            state[show.name] = show.state;
        }
    },
    getters: {
        getIsElemBordersShow(state) {
            return state.showElemBorders;
        }
    },
    actions: {

    }
}