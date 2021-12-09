import Vue from 'vue'
import VueRouter from 'vue-router'
import mainPage from "@/pages/mainPage";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'mainPage',
    component: mainPage
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../pages/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
