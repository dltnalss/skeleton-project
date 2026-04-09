<template>
<<<<<<< HEAD
  <div>
    <h5>거래 등록</h5>
=======
>>>>>>> 724220a2b6776b77d349e3c5b45aa23afecf2f1f
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
<<<<<<< HEAD
// 필요한 import:
//   - ref, computed, onMounted  (from 'vue')
//   - axios                     (from 'axios')
//   - useRouter                 (from 'vue-router')
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

// toISOString() → "2026-04-09T05:30:00.000Z"
// .slice(0, 10) → "2026-04-09" (앞에서 10글자만 자름)
const router = useRouter()
const today = new Date().toISOString().slice(0, 10);

const form = ref({
  type: 'expense',
  date: new Date().toISOString().slice(0, 10),
  amount: 0,
=======
import { ref, computed } from 'vue';

// 1. 입력할 데이터를 한 곳에 모아두는 form 객체
const form = ref({
  type: 'expense', // 기본값을 '지출'로 설정해두면 편합니다
  date: '',
  amount: null,
>>>>>>> 724220a2b6776b77d349e3c5b45aa23afecf2f1f
  category: '',
  memo: '',
});

<<<<<<< HEAD
  // - incomeCategories = ref([])   ← API에서 가져올 수입 카테고리 목록
  // - expenseCategories = ref([])  ← API에서 가져올 지출 카테고리 목록
const incomeCategories = ref([])    
const expenseCategories = ref([])

// 필요한 computed:
//   - categoryList
//     → form.type이 'income'이면 incomeCategories.value 반환
//     → form.type이 'expense'이면 expenseCategories.value 반환
//     → select의 v-for가 이걸 순회함
const categoryList = computed(() => {
  // form.value.type이 'income'이면 수입 카테고리, 아니면 지출 카테고리
  if (form.value.type === 'income') {
    return incomeCategories.value;
  } else {
    return expenseCategories.value;
  }
});

// 필요한 함수:
//   - fetchCategories()
//     → onMounted에서 실행
//     → axios.get으로 incomeCategory, expenseCategory를 가져와서 변수에 저장
//     → Home.vue의 fetchData()와 거의 동일한 패턴
import { ref, computed, onMounted, watch } from 'vue';
watch(
  () => form.value.type,
  () => {
    form.value.category = '';
=======
// 2. 수입/지출에 따른 카테고리 기초 데이터 (실제로는 서버나 Pinia에서 가져올 수 있어요)
const incomeCategories = [
  { id: '11', name: '급여' },
  { id: '12', name: '용돈' },
  { id: '13', name: '기타수입' },
];

const expenseCategories = [
  { id: '21', name: '식비' },
  { id: '22', name: '교통비' },
  { id: '23', name: '쇼핑' },
];

// 3. 핵심 포인트: 거래종류(form.type)가 바뀔 때마다 카테고리 목록을 자동으로 바꿔주는 computed
const categoryList = computed(() => {
  // form.type이 'income'이면 수입 카테고리를, 아니면 지출 카테고리를 반환합니다.
  if (form.value.type === 'income') {
    return incomeCategories;
  } else {
    return expenseCategories;
>>>>>>> 724220a2b6776b77d349e3c5b45aa23afecf2f1f
  }
);

  // - saveTransaction()
  //   → 저장 버튼 누르면 실행
  //   → 빈 값 검증 (금액이 0이면 alert 등)
  //   → axios.post('http://localhost:3000/budget', { ... })
  //     → body에 넣을 데이터: form.value의 내용
  //     → 주의: amount는 Number()로 변환해야 함 (input은 문자열로 들어오니까)
  //   → 성공하면 router.push('/')로 홈으로 이동
const saveTransaction = async () => {
  // 1단계: 빈 값 체크
  if (!form.value.amount || !form.value.category) {
    alert('금액과 카테고리를 입력해주세요');
    return;  // 여기서 멈춤. 아래 코드 실행 안 됨
  }
  // 2단계: 서버에 저장
  try {
    await axios.post('http://localhost:3000/budget', {
      date: form.value.date,
      type: form.value.type,
      amount: Number(form.value.amount),  // ★ 문자열 → 숫자 변환
      category: form.value.category,
      memo: form.value.memo,
    });
    // 3단계: 성공하면 홈으로 이동
    router.push('/');
  } catch (e) {
    console.error('저장 실패:', e);
    alert('저장에 실패했습니다');
  }
};

  // - goBack()
  //   → router.back() 또는 router.push('/')

// 필요한 watch (선택):
//   - form.type이 바뀌면 form.category를 ''로 초기화
//     → 수입에서 지출로 바꿨는데 카테고리가 수입 카테고리 값으로 남아있으면 안 되니까

<<<<<<< HEAD
// return:
//   - form, categoryList, saveTransaction, goBack
</script>
=======
  // 💡 알고 계신 Pinia나 Axios를 바로 이 부분에 추가하게 됩니다.
  // 예시 1) axios.post('/api/add', form.value)
  // 예시 2) accountStore.addList(form.value)
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
>>>>>>> 724220a2b6776b77d349e3c5b45aa23afecf2f1f
