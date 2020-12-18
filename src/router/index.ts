import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

import SqliteTest from '../pages/SqliteTest.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/test'
  },
  {
    path: '/test',
    name: 'Test',
    component: SqliteTest
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
