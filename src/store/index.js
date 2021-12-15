import Vue from 'vue'
import Vuex from 'vuex'

import elements from "@/store/elements";
import showMenus from "@/store/showMenus";
import dragData from "@/store/dragData";
import dropBtn from "@/store/dropBtn";

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    elements,
    showMenus,
    dragData,
    dropBtn
  }
})
