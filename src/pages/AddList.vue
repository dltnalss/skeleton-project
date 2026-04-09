<template>
  <div class="add-list-container">
    <h2>내역 추가하기</h2>

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
      <button @click="goBack">취소</button>
      <button @click="saveTransaction">저장</button>
    </div>
  </div>
</template>

<script setup>
// import { inject, reactive, computed } from 'vue';
// import { useRouter } from 'vue-router';

// const router = useRouter();
// const { addTransaction } = inject('actions');

// // 1. 입력할 데이터를 한 곳에 모아두는 form 객체
// const form = reactive({
//   type: 'expense', // 기본값을 '지출'로 설정해두면 편합니다
//   date: '',
//   amount: null,
//   category: '',
//   memo: '',
// });

// // 2. 수입/지출에 따른 카테고리 기초 데이터 (실제로는 서버나 Pinia에서 가져올 수 있어요)
// const incomeCategories = [
//   { id: '11', name: '급여' },
//   { id: '12', name: '용돈' },
//   { id: '13', name: '기타수입' },
// ];

// const expenseCategories = [
//   { id: '21', name: '식비' },
//   { id: '22', name: '교통비' },
//   { id: '23', name: '쇼핑' },
// ];

// // 3. 핵심 포인트: 거래종류(form.type)가 바뀔 때마다 카테고리 목록을 자동으로 바꿔주는 computed
// const categoryList = computed(() => {
//   // form.type이 'income'이면 수입 카테고리를, 아니면 지출 카테고리를 반환합니다.
//   if (form.type === 'income') {
//     return incomeCategories;
//   } else {
//     return expenseCategories;
//   }
// });

// // 4. 취소 버튼 함수
// const goBack = () => {
//   router.push('/transaction')
//   alert('이전 화면으로 돌아갑니다.');
//   // 나중에 여기에 라우터 이동 코드 (예: router.go(-1))를 넣으면 됩니다.
// };

// // 5. 저장 버튼 함수
// const saveTransaction = () => {
//   // 간단한 빈칸 검사 (Validation)
//   if (!form.date || !form.amount || !form.category) {
//     alert('날짜, 금액, 카테고리는 꼭 입력해주세요!');
//     return;
//   }

//   // try{
//   //   const response = await axios.post('date, type, amount, category, memo')
//   // }

//   // 데이터가 잘 담겼는지 개발자 도구 콘솔에서 확인해보세요
//   console.log('저장될 데이터:', form);

//    addTransaction({ ...form }, () => {
//   alert('가계부에 잘 저장되었습니다!');
// router.push('/transaction');
//   });
//   // 💡 알고 계신 Pinia나 Axios를 바로 이 부분에 추가하게 됩니다.
//   // 예시 1) axios.post('/api/add', form.value)
//   // 예시 2) accountStore.addList(form.value)
// };
import { reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBudgetStore } from '@/stores/budgetStore'; // 스토어 경로 확인!

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
  router.push('/transaction');
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
    router.push('/transaction');
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
.button-group {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}
</style>
