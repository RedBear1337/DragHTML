export default {
    state() {
        return {
            elementsList: true,
        }
    },
    mutations: {
        toggleShowState(state, menuName) {
            state[menuName] = !state[menuName];
        }
    },
    getters: {
        getIsElementsListShow(state) {
            return state.elementsList;
        }
    },
    actions: {

    }
}