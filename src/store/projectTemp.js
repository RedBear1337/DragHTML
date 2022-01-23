export default {
    state() {
        return {
            width: 0,
            widthFormat: 'px'
        }
    },
    mutations: {
        setWidth(state, width){
            state.width = width;
        },
        setWidthFormat(state, format){
            state.widthFormat = format;
        }
    },
    getters: {
        getWidth(state) {
            return state.width;
        },
        getWidthFormat(state) {
            return state.widthFormat;
        }
    },
    actions: {

    }
}