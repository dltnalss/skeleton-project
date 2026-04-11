<template>
  <div class="add-list-container">
    <h2 class="border-primary border-4 fw-bold">내역 추가하기</h2>

    <div class="form-group">
      <label>
        <input type="radio" v-model="form.type" value="income" /> 수입
      </label>
      <label>
        <input type="radio" v-model="form.type" value="expense" /> 지출
      </label>
    </div>

    <div class="form-group">
      <input type="date" v-model="form.date" />
    </div>

    <div class="form-group">
      <input type="number" v-model="form.amount" placeholder="금액 입력" />
    </div>

    <div class="form-group">
      <select v-model="form.category">
        <option value="">-- 선택 --</option>
        <option v-for="cat in categoryList" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <input type="text" v-model="form.memo" placeholder="메모 입력" />
    </div>

    <div class="button-group">
      <button class="btn btn-secondary" @click="goBack">취소</button>
      <button class="btn btn-secondary" @click="saveTransaction">저장</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBudgetStore } from '@/stores/budgetstore.js'; // 스토어 경로 확인!

const router = useRouter();
const budgetStore = useBudgetStore(); // Pinia 스토어 가져오기

// 1. 초기 데이터 로드 (서버에서 카테고리 가져오기)
onMounted(() => {
  budgetStore.initData();
});

const form = reactive({
  type: 'expense',
  date: new Date().toISOString().split('T')[0], // 오늘 날짜 기본값
  amount: null,
  category: '',
  memo: '',
});

// 2. 핵심 수정: 스토어에 저장된 카테고리 데이터를 실시간으로 가져옴
const categoryList = computed(() => {
  return form.type === 'income'
    ? budgetStore.incomeCategories
    : budgetStore.expenseCategories;
});

const goBack = () => {
  router.push('/transaction/all');
};

// 3. 저장 함수 수정 (async 추가)
const saveTransaction = async () => {
  if (!form.date || !form.amount || !form.category) {
    alert('날짜, 금액, 카테고리는 꼭 입력해주세요!');
    return;
  }

  // 스토어의 액션 호출
  const success = await budgetStore.addTransaction({ ...form });

  if (success) {
    alert('가계부에 잘 저장되었습니다!');
    router.push('/transaction/all');
  } else {
    alert('저장 실패! 다시 시도해주세요.');
  }
};
</script>

<style scoped>
/* 간단하게 보기 좋도록 CSS를 살짝 추가했습니다 */
.add-list-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}
.form-group {
  margin-bottom: 15px;
}
.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
.button-group {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}
.btn {
  flex-grow: 1;
  padding: 10px;
  cursor: pointer;
}
</style>
