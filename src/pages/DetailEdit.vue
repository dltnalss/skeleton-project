<template>
  <div class="edit-list-container">
    <h2 class="border-primary border-4 fw-bold">내역 수정하기</h2>

    <div v-if="!isLoaded">
      <p>데이터를 불러오는 중입니다...</p>
    </div>

    <div v-else>
      <div class="updateList-group">
        <label>
          <input type="radio" v-model="updateList.type" value="income" /> 수입
        </label>
        <label>
          <input type="radio" v-model="updateList.type" value="expense" /> 지출
        </label>
      </div>

      <div class="updateList-group">
        <input type="date" v-model="updateList.date" />
      </div>

      <div class="updateList-group">
        <input
          type="number"
          v-model="updateList.amount"
          placeholder="금액 입력"
        />
      </div>

      <div class="updateList-group">
        <select v-model="updateList.category">
          <option value="">-- 선택 --</option>
          <option v-for="cat in categoryList" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <div class="updateList-group">
        <input type="text" v-model="updateList.memo" placeholder="메모 입력" />
      </div>

      <div class="button-group">
        <button class="btn btn-secondary" @click="goBack">취소</button>
        <button class="btn btn-primary" @click="updateTodoHandler">수정</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router'; // 파라미터 받기 위해 useRoute 추가
import { useBudgetStore } from '@/stores/budgetstore.js';
import axios from 'axios'; // 서버 통신용

const router = useRouter();
const route = useRoute();
const budgetStore = useBudgetStore();
const { EditTransaction } = useBudgetStore();

// 1. 라우터 주소창에서 넘어온 ID 값을 가져옵니다. (예: /edit/3 이면 '3'을 가져옴)
const targetId = route.params.id;
const BASEURI = '/api/budget';

const updateList = reactive({
  id: '',
  date: '',
  type: '',
  amount: 0,
  category: '',
  memo: '',
});

// 데이터를 렌더링할 준비가 되었는지 체크하는 변수
const isLoaded = ref(false);

// AddList와 동일하게 타입에 따라 카테고리 목록 변경
const categoryList = computed(() => {
  return updateList.type === 'income'
    ? budgetStore.incomeCategories
    : budgetStore.expenseCategories;
});

const goBack = () => {
  router.push({ name: route.query.from });
};

// 2. 수정할 기존 데이터 서버에서 불러오기
const fetchDetail = async () => {
  try {
    const response = await axios.get(`${BASEURI}/${targetId}`);

    if (response.status === 200) {
      // 서버에서 가져온 기존 데이터를 updateList에 쏙 집어넣습니다.
      Object.assign(updateList, response.data);
      isLoaded.value = true; // 로딩 완료 처리
    }
  } catch (error) {
    alert('데이터를 불러오는데 실패했습니다.');
    goBack(); // 실패하면 이전 화면으로 돌려보냄
  }
};

//3 수정 이벤트

const updateTodoHandler = () => {
  EditTransaction(updateList, () => {
    alert('수정이 완료되었습니다.');
    // 이전 path 경로가 필요함
    router.push({ name: route.query.from });
  });
};

// 화면이 열릴 때 가장 먼저 실행되는 부분
onMounted(() => {
  budgetStore.initData(); // 1. 카테고리 목록 먼저 가져오고
  fetchDetail(); // 2. 수정할 내용 불러오기
});
</script>

<style scoped>
.edit-list-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}
.updateList-group {
  margin-bottom: 15px;
}
/* 입력칸 스타일도 추가해주면 더 깔끔합니다 */
.updateList-group input,
.updateList-group select {
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
