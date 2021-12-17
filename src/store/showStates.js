export default {
    state() {
        return {
            showElemBorders: false,
            l: false,
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
        },
        getL(state) {
            return state.l;
        }
    },
    actions: {

    }
}