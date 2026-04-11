import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import AddList from '@/pages/AddList.vue';
import Summary from '@/pages/Summary.vue';
import TransactionList from '@/pages/TransactionList.vue';
import Transaction from '@/pages/Transaction.vue';
import DetailEdit from '@/pages/DetailEdit.vue';

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
      path: '/add',
      name: 'AddList',
      component: () => import('@/pages/AddList.vue'),
    },
    {
      path: '/transaction',
      name: 'transaction',
      component: Transaction,
      children: [
        { path: 'all', name: 'transaction/all', component: TransactionList },
        {
          path: 'income',
          name: 'transaction/income',
          component: TransactionList,
        },
        {
          path: 'expense',
          name: 'transaction/expense',
          component: TransactionList,
        },
      ],
    },
    {
      path: '/detailedit/:id',
      name: 'detailedit/id',
      component: DetailEdit,
    },
  ],
});

export default router;
