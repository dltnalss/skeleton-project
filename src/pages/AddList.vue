<template>
  <div>
    <h5>거래 등록</h5>

    1. 거래종류 (수입/지출)
       → <input type="radio"> 2개
       → v-model="form.type"
       → 값: 'income' 또는 'expense'

    2. 날짜
       → <input type="date">
       → v-model="form.date"

    3. 금액
       → <input type="number">
       → v-model="form.amount"

    4. 카테고리 (드롭다운)
       → <select>
       → v-model="form.category"
       → v-for로 옵션 반복
       → 핵심: form.type이 'income'이면 incomeCategory 목록을,
              'expense'이면 expenseCategory 목록을 보여줘야 함
       → computed로 categoryList를 만들어서, type에 따라 알맞은 배열 반환

    5. 메모
       → <input type="text">
       → v-model="form.memo"

    6. 버튼 2개
       → 취소: @click="goBack"  → $router.back()
       → 저장: @click="saveTransaction"  → axios.post()
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const today = new Date().toISOString().slice(0, 10);
// toISOString() → "2026-04-09T05:30:00.000Z"
// .slice(0, 10) → "2026-04-09" (앞에서 10글자만 자름)


const form = ref({
  type: 'expense',
  date: new Date().toISOString().slice(0, 10),
  amount: 0,
  category: '',
  memo: '',
});

const incomeCategories = ref([])
const expenseCategories = ref([])

const categoryList = computed(() => {
  // form.value.type이 'income'이면 수입 카테고리, 아니면 지출 카테고리
  if (form.value.type === 'income') {
    return incomeCategories.value;
  } else {
    return expenseCategories.value;
  }
});

필요한 computed:
  - categoryList
    → form.type이 'income'이면 incomeCategories.value 반환
    → form.type이 'expense'이면 expenseCategories.value 반환
    → select의 v-for가 이걸 순회함

필요한 함수:
  - fetchCategories()
    → onMounted에서 실행
    → axios.get으로 incomeCategory, expenseCategory를 가져와서 변수에 저장
    → Home.vue의 fetchData()와 거의 동일한 패턴

  - saveTransaction()
    → 저장 버튼 누르면 실행
    → 빈 값 검증 (금액이 0이면 alert 등)
    → axios.post('http://localhost:3000/budget', { ... })
      → body에 넣을 데이터: form.value의 내용
      → 주의: amount는 Number()로 변환해야 함 (input은 문자열로 들어오니까)
    → 성공하면 router.push('/')로 홈으로 이동

  - goBack()
    → router.back() 또는 router.push('/')

필요한 watch (선택):
  - form.type이 바뀌면 form.category를 ''로 초기화
    → 수입에서 지출로 바꿨는데 카테고리가 수입 카테고리 값으로 남아있으면 안 되니까

return:
  - form, categoryList, saveTransaction, goBack
</script>