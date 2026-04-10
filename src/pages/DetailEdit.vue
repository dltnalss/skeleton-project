<template>
  <div class="add-list-container">
    <h2>내역 수정하기</h2>

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
import { reactive, computed, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router'; // 파라미터 받기 위해 useRoute 추가
import { useBudgetStore } from '@/stores/budgetstore.js';
import axios from 'axios'; // 서버 통신용
const { transactionList, EditTransaction } = useBudgetStore();
const router = useRouter();
const route = useRoute();
const budgetStore = useBudgetStore();

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
  router.push('/transaction/all');
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
// if (!editList) {
//   router.push({ name: 'transaction/all' });
// }

//3 수정 이벤트

const editList = transactionList.find(
  (List) => List.id == currentRoute.params.id,
);

if (editList) {
  Object.assign(updateList, editList);
  console.log('읽어온 데이터:', updateList);
}
//  else {
//   alert('해당 내역을 찾을 수 없습니다.');
//   router.push('/transaction/all');
// }
console.log(editList);
const updateTodoHandler = () => {
  console.log(updateList);

  console.log('hi    ' + route.query.from);
  EditTransaction(updateList, () => {
    // TODO: All로 감 다른 페이지에서도 보여야함 income이랑 expense
    // 이전 path 경로가 필요함
    router.push({ name: route.query.from });
  });
};

// // 3. 수정한 내용 서버로 보내서 덮어쓰기 (Update)
// const updateTransaction = async () => {
//   if (!updateList.date || !updateList.amount || !updateList.category) {
//     alert('날짜, 금액, 카테고리는 꼭 입력해주세요!');
//     return;
//   }

//   try {
//     // axios.put을 사용하면 해당 ID의 데이터를 통째로 변경해줍니다.
//     const response = await axios.put(`${BASEURI}/${targetId}`, updateList);

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
