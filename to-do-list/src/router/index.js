import Vue from 'vue'
import VueRouter from 'vue-router'
import vToDoList from '../views/vToDoList.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: vToDoList
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
