<script setup>
import { ref } from 'vue';

// db.json 스타일의 가상 데이터
const expenses = ref([
  {
    id: 1,
    date: '2026-04-20',
    category: '식비',
    title: '점심 김치찌개',
    amount: 9000,
    type: 'expense',
  },
  {
    id: 2,
    date: '2026-04-20',
    category: '교통',
    title: '지하철 충전',
    amount: 20000,
    type: 'income',
  },
  {
    id: 3,
    date: '2026-04-19',
    category: '쇼핑',
    title: '봄맞이 맨투맨',
    amount: 45000,
    type: 'expense',
  },
]);
</script>

<template>
  <div class="home-container">
    <div class="date-navigator">
      <button class="nav-btn">&lt;</button>
      <h2 class="current-date">2026년 4월</h2>
      <button class="nav-btn">&gt;</button>
    </div>

    <div class="summary-cards">
      <div class="card income">
        <p class="label">↗ 수입</p>
        <p class="amount">340만원</p>
      </div>
      <div class="card expense">
        <p class="label">↘ 지출</p>
        <p class="amount">102.3만원</p>
      </div>
      <div class="card balance">
        <p class="label">💳 잔액</p>
        <p class="amount">237.7만원</p>
      </div>
    </div>

    <section class="transaction-list-section">
      <div class="list-header">
        <h3>최근 거래</h3>
      </div>

      <div class="transaction-list">
        <div v-for="item in expenses" :key="item.id" class="transaction-item">
          <div class="item-left">
            <div class="item-icon">{{ item.category[0] }}</div>
            <div class="item-info">
              <p class="item-title">{{ item.title }}</p>
              <p class="item-sub">
                {{ item.category }} · {{ item.date.slice(5) }}
              </p>
            </div>
          </div>

          <div :class="['item-amount', item.type]">
            {{ item.type === 'income' ? '+' : '-'
            }}{{ item.amount.toLocaleString() }}원
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 전체 컨테이너 세팅 */
.home-container {
  padding: 20px;
  background-color: #f8f9fa; /* 연한 배경색 */
  min-height: 100vh;
  max-width: 480px; /* 모바일 앱처럼 너비 제한 */
  margin: 0 auto; /* 화면 중앙 정렬 */
  font-family: sans-serif;
}

/* === 날짜 선택 스타일 === */
.date-navigator {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
}

.current-date {
  font-size: 20px;
  font-weight: bold;
}

.nav-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
}

/* === 요약 카드 스타일 === */
.summary-cards {
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

.card {
  flex: 1;
  background: white;
  padding: 15px 10px;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.income .amount {
  color: #10b981;
} /* 초록색 */
.expense .amount {
  color: #ef4444;
} /* 빨간색 */
.balance {
  background-color: #8b5cf6;
  color: white;
} /* 보라색 */

.label {
  font-size: 12px;
  margin-bottom: 5px;
}

.amount {
  font-size: 16px;
  font-weight: bold;
}

/* === 리스트 스타일 === */
.transaction-list-section {
  background-color: white;
  border-radius: 24px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.list-header h3 {
  font-size: 16px;
  margin-bottom: 15px;
  margin-top: 0;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f1f1f1;
}

/* 마지막 리스트는 밑줄 제거 */
.transaction-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.item-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-icon {
  width: 40px;
  height: 40px;
  background-color: #f8f9fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.item-title {
  font-size: 15px;
  font-weight: bold;
  margin: 0;
}

.item-sub {
  font-size: 12px;
  color: #999;
  margin: 4px 0 0 0;
}

.item-amount {
  font-weight: bold;
  font-size: 15px;
}

/* 리스트 금액 색상 */
.item-amount.income {
  color: #10b981;
}
.item-amount.expense {
  color: #ef4444;
}
</style>
