<template>
  <div class="add-list-container">
    <h2>내역 수정하기</h2>

    <div v-if="!isLoaded">
      <p>데이터를 불러오는 중입니다...</p>
    </div>

    <div v-else>
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
        <button class="btn btn-primary" @click="updateTransaction">수정</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router'; // 파라미터 받기 위해 useRoute 추가
import { useBudgetStore } from '@/stores/budgetstore.js';
import axios from 'axios'; // 서버 통신용

const router = useRouter();
const route = useRoute();
const budgetStore = useBudgetStore();

// 1. 라우터 주소창에서 넘어온 ID 값을 가져옵니다. (예: /edit/3 이면 '3'을 가져옴)
const targetId = route.params.id;
const BASEURI = '/api/budget';

// 데이터를 렌더링할 준비가 되었는지 체크하는 변수
const isLoaded = ref(false);

const form = reactive({
  type: '',
  date: '',
  amount: null,
  category: '',
  memo: '',
});

// AddList와 동일하게 타입에 따라 카테고리 목록 변경
const categoryList = computed(() => {
  return form.type === 'income'
    ? budgetStore.incomeCategories
    : budgetStore.expenseCategories;
});

const goBack = () => {
  router.push('/transaction/all');
};

// 2. 수정할 기존 데이터 서버에서 불러오기
const fetchDetail = async () => {
  try {
    const response = await axios.get(`${BASEURI}/${targetId}`);

    if (response.status === 200) {
      // 서버에서 가져온 기존 데이터를 form에 쏙 집어넣습니다.
      Object.assign(form, response.data);
      isLoaded.value = true; // 로딩 완료 처리
    }
  } catch (error) {
    alert('데이터를 불러오는데 실패했습니다.');
    goBack(); // 실패하면 이전 화면으로 돌려보냄
  }
};
fetchDetail();

// // 3. 수정한 내용 서버로 보내서 덮어쓰기 (Update)
// const updateTransaction = async () => {
//   if (!form.date || !form.amount || !form.category) {
//     alert('날짜, 금액, 카테고리는 꼭 입력해주세요!');
//     return;
//   }

//   try {
//     // axios.put을 사용하면 해당 ID의 데이터를 통째로 변경해줍니다.
//     const response = await axios.put(`${BASEURI}/${targetId}`, form);

//     if (response.status === 200) {
//       alert('성공적으로 수정되었습니다!');
//       router.push('/transaction/all');
//     }
//   } catch (error) {
//     alert('수정 실패! 다시 시도해주세요.');
//   }
// };

// 화면이 열릴 때 가장 먼저 실행되는 부분
onMounted(() => {
  budgetStore.initData(); // 1. 카테고리 목록 먼저 가져오고
  fetchDetail(); // 2. 수정할 내용 불러오기
});
</script>

<style scoped>
.add-list-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}
.form-group {
  margin-bottom: 15px;
}
/* 입력칸 스타일도 추가해주면 더 깔끔합니다 */
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
