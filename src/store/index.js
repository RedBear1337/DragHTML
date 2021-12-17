import Vue from 'vue'
import Vuex from 'vuex'

import elements from "@/store/elements";
import showStates from "@/store/showStates";
import dragData from "@/store/dragData";
import dropBtn from "@/store/dropBtn";
import dropZone from "@/store/dropZone"

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    elements,
    showStates,
    dragData,
    dropBtn,
    dropZone
  }
})
