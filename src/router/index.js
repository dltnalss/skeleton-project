/**
 * ■ router/index.js = URL과 페이지를 연결하는 설정 파일
 *
 * 브라우저 주소창에 URL을 입력하면, 여기서 "어떤 페이지를 보여줄지" 결정함
 *
 * 예시:
 *   사용자가 "/" 입력          → Home.vue 보여줌
 *   사용자가 "/transaction" 입력 → Transaction.vue 보여줌
 *   사용자가 "/transaction/3" 입력 → TransactionDetail.vue 보여줌 (3번 거래의 상세)
 */

import { createRouter, createWebHistory } from 'vue-router';

// 각 페이지 파일을 불러옴 (import)
import Home from '@/pages/Home.vue';
import AddList from '@/pages/AddList.vue';
import Summary from '@/pages/Summary.vue';
import Transaction from '@/pages/Transaction.vue';
import TransactionDetail from '@/pages/TransactionDetail.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  // routes = URL 목록. 각 항목이 "이 URL이면 이 페이지를 보여줘"라는 뜻
  routes: [
    {
      path: '/', // URL이 "/" 일 때 (홈)
      name: 'home', // 이 라우트의 이름 (코드에서 참조용)
      component: Home, // Home.vue를 보여줌
    },
    {
      path: '/addList', // URL이 "/addList" 일 때
      name: 'addList',
      component: AddList, // AddList.vue를 보여줌
    },
    {
      path: '/summary', // URL이 "/summary" 일 때
      name: 'summary',
      component: Summary, // Summary.vue를 보여줌
    },
    {
      path: '/transaction', // URL이 "/transaction" 일 때
      name: 'transaction',
      component: Transaction, // Transaction.vue를 보여줌
    },
    {
      path: '/transaction/:id', // URL이 "/transaction/숫자" 일 때
      name: 'transactionDetail', // :id는 변수. /transaction/3이면 id=3
      component: TransactionDetail, // TransactionDetail.vue를 보여줌
    },
    // 기존 routes 배열 안에 아래 객체를 추가하세요
    {
      path: '/add',
      name: 'AddList',
      component: () => import('@/pages/AddList.vue'),
    },
  ],
});

export default router;
