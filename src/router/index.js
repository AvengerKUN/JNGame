import {createRouter, createWebHashHistory} from 'vue-router'
import Index from '../views/Index'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Index
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
