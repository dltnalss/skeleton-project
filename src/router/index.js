import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import AddList from '@/pages/AddList.vue';
import Summary from '@/pages/Summary.vue';
import Transaction from '@/pages/Transaction.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/addList',
      name: 'addList',
      component: AddList,
    },
    {
      path: '/summary',
      name: 'summary',
      component: Summary,
    },
    {
      path: '/transaction',
      name: 'transaction',
      component: Transaction,
    },
  ],
});

export default router;
