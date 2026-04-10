<template>
  <!--
    ■ TransactionDetail.vue = 거래 1건의 상세 정보 페이지
    
    Home에서 거래를 클릭하면 여기로 옴
    URL: /transaction/3 → id가 3인 거래의 상세 정보
  -->
  <div style="padding: 16px; padding-bottom: 80px;">

    <!-- v-if="item" → 데이터가 로딩된 후에만 보여줌 -->
    <div v-if="item">
      <h5>거래 상세</h5>

      <!-- 수입/지출 표시 -->
      <p>
        <strong>구분:</strong>
        {{ item.type === 'income' ? '수입' : '지출' }}
      </p>

      <!-- 금액 -->
      <p>
        <strong>금액:</strong>
        <span :style="{ color: item.type === 'income' ? 'blue' : 'red' }">
          {{ item.type === 'income' ? '+' : '-' }}{{ formatMoney(item.amount) }}
        </span>
      </p>

      <!-- 날짜 -->
      <p><strong>날짜:</strong> {{ item.date }}</p>

      <!-- 카테고리 -->
      <p><strong>카테고리:</strong> {{ categoryName }}</p>

      <!-- 메모 -->
      <p><strong>메모:</strong> {{ item.memo }}</p>

      <!-- 뒤로가기 버튼 -->
      <!--
        $router.back() = 브라우저의 "뒤로가기"와 같은 기능
      -->
      <button @click="$router.back()">뒤로가기</button>
    </div>

    <!-- 데이터가 없을 때 (잘못된 ID로 접근한 경우) -->
    <div v-else>
      <p>거래 내역을 찾을 수 없습니다.</p>
      <router-link to="/">홈으로 돌아가기</router-link>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
// useRoute = 현재 URL의 정보를 가져옴 (예: /transaction/3에서 id=3을 꺼냄)
import axios from 'axios';

export default {
  name: 'TransactionDetail',
  setup() {
    const route = useRoute();
    const API_BASE = 'http://localhost:3000';

    const item = ref(null);               // 거래 1건의 데이터
    const incomeCategories = ref([]);
    const expenseCategories = ref([]);

    // 카테고리 ID → 이름 변환
    const categoryName = computed(() => {
      if (!item.value) return '';
      const list = item.value.type === 'income'
        ? incomeCategories.value
        : expenseCategories.value;
      const found = list.find((c) => c.id === item.value.category);
      return found ? found.name : '기타';
    });

    const formatMoney = (v) => new Intl.NumberFormat('ko-KR').format(v) + '원';

    onMounted(async () => {
      try {
        // route.params.id = URL에서 :id 부분의 값
        // 예: /transaction/3 이면 route.params.id = "3"
        const [budgetRes, incRes, expRes] = await Promise.all([
          axios.get(`${API_BASE}/budget/${route.params.id}`), // 특정 1건만 조회
          axios.get(`${API_BASE}/incomeCategory`),
          axios.get(`${API_BASE}/expenseCategory`),
        ]);
        item.value = budgetRes.data;
        incomeCategories.value = incRes.data;
        expenseCategories.value = expRes.data;
      } catch (e) {
        console.error('상세 조회 실패:', e);
      }
    });

    return { item, categoryName, formatMoney };
  },
};
</script>
