import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import AddList from '@/pages/AddList.vue';
import Summary from '@/pages/Summary.vue';
import TransactionList from '@/pages/TransactionList.vue';
import Transaction from '@/pages/Transaction.vue';
// import TransactionIncome from '@/pages/Income.vue';
// import TransactionExpense from '@/pages/Expense.vue';

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
        { path: 'all', name: 'all', component: TransactionList },
        {
          path: 'income',
          name: 'income',
          component: TransactionList,
        },
        {
          path: 'expense',
          name: 'expense',
          component: TransactionList,
        },
      ],
    },
  ],
});

export default router;
