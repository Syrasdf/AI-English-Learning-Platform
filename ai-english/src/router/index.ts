import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { globalStore } from '@/store'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
})

export default router
