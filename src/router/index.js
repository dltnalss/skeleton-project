import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import AddList from '@/pages/AddList.vue';
import Summary from '@/pages/Summary.vue';
import TransactionAll from '@/pages/All.vue';
import Transaction from '@/pages/Transaction.vue';
import TransactionIncome from '@/pages/Income.vue';
import TransactionExpense from '@/pages/Expense.vue';

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
      children: [
        { path: 'all', name: 'transaction/all', component: TransactionAll },
        {
          path: 'income',
          name: 'transaction/income',
          component: TransactionIncome,
        },
        {
          path: 'expense',
          name: 'transaction/expense',
          component: TransactionExpense,
        },
      ],
    },
  ],
});

export default router;
