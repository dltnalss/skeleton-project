<template>
  <!--
    ■ Home.vue = 가계부 홈 화면

    구조 (위에서 아래로):
    1. 타이틀 (인사말)
    2. 연도/월 선택 + 총수입/총지출/총계
    3. 이번 달 인사이트 (최대지출, 과소비, 절약)
    4. 최근 거래내역 5건 (클릭하면 상세 페이지로 이동)
  -->
  <div class="home-page">
    <!--  1. 타이틀  -->

    <h5>나의 가계부</h5>
    <p>{{ profile.name }}님, 오늘도 많이 관리하고 부자되세요!</p>

    <!--  2. 연도/월 선택  -->
    <div class="home-filter-row">
      <select v-model="selectedYear">
        <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}년</option>
      </select>

      <select v-model="selectedMonth">
        <option v-for="m in 12" :key="m" :value="m">{{ m }}월</option>
      </select>
    </div>

    <!--  총수입 / 총지출 / 총계  -->
    <div class="summary-cards">
      <div class="summary-card summary-card-income">
        <span class="summary-label">총 수입</span>
        <span class="summary-value summary-value-income">
          {{ formatMoney(totalIncome) }}
        </span>
      </div>
      <div class="summary-card summary-card-expense">
        <span class="summary-label">총 지출</span>
        <span class="summary-value summary-value-expense">
          {{ formatMoney(totalExpense) }}
        </span>
      </div>
      <div class="summary-card summary-card-total">
        <span class="summary-label">총계</span>
        <span
          class="summary-value"
          :class="netAmount >= 0 ? 'summary-value-positive' : 'summary-value-negative'"
        >
          {{ netAmount >= 0 ? '+' : '' }}{{ formatMoney(netAmount) }}
        </span>
      </div>
    </div>

    <hr />

    <!--  3. 이번 달 인사이트  -->
    <section class="insight-card">
      <div class="insight-card-header">
        <h6>이번 달 인사이트</h6>
        <span class="insight-card-caption">소비 흐름을 한눈에 확인해 보세요.</span>
      </div>

      <!-- 3-1. 최대 지출 카테고리 -->
      <div class="insight-item">
        <strong class="insight-title">최대 지출 카테고리</strong>
        <div v-if="topExpenseCategory" class="insight-value-row">
          <span>{{ topExpenseCategory.name }}</span>
          <span class="insight-value insight-value-expense">
            {{ formatMoney(topExpenseCategory.amount) }}
          </span>
        </div>
        <div v-else class="insight-empty">지출 내역이 없습니다</div>
      </div>

      <!-- 3-2. 지난달 대비 과소비 카테고리 -->
      <div class="insight-item">
        <strong class="insight-title">지난달 대비 과소비</strong>
        <div v-if="overspendCategory" class="insight-value-row">
          <span>{{ overspendCategory.name }}</span>
          <span class="insight-value insight-value-expense">
            +{{ formatMoney(overspendCategory.diff) }}
          </span>
        </div>
        <div v-else class="insight-empty">과소비 카테고리가 없습니다</div>
      </div>

      <!-- 3-3. 잘 아끼고 있는 카테고리 -->
      <div class="insight-item insight-item-last">
        <strong class="insight-title">잘 아끼고 있어요!</strong>
        <div v-if="savedCategory" class="insight-value-row">
          <span>{{ savedCategory.name }}</span>
          <span class="insight-value insight-value-save">
            -{{ formatMoney(Math.abs(savedCategory.diff)) }}
          </span>
        </div>
        <div v-else class="insight-empty">비교할 지난달 데이터가 없습니다</div>
      </div>
    </section>

    <hr />

    <!--  4. 최근 거래내역 5건  -->
    <section class="recent-card">
      <div class="recent-card-header">
        <h6>최근 거래내역</h6>
        <span class="recent-card-caption">가장 최근에 기록한 5건을 보여드려요.</span>
      </div>

      <div
        v-for="item in recentTransactions"
        :key="item.id"
        class="recent-item"
        :class="
          item.type === 'income' ? 'recent-item-income' : 'recent-item-expense'
        "
        @click="goToDetail(item.id)"
      >
        <!-- 플러스 버튼 -->
        <router-link id="plusButton" to="/addList">
          <span class="plus-icon">+</span>
        </router-link>

        <!-- 좌측: 날짜, 카테고리, 메모 -->
        <div class="recent-copy">
          <strong>{{ getCategoryName(item) }}</strong>
          <span>{{ formatDate(item.date) }} | {{ item.memo }}</span>
        </div>

        <!-- 우측: 금액 -->
        <div
          class="recent-amount"
          :class="
            item.type === 'income' ? 'recent-amount-income' : 'recent-amount-expense'
          "
        >
          <span v-if="item.type === 'income'"
            >↑ +{{ formatMoney(item.amount) }} (수입)</span
          >
          <span v-else>↓ -{{ formatMoney(item.amount) }} (지출)</span>
        </div>
      </div>

      <!-- 거래내역이 하나도 없을 때 -->
      <div v-if="recentTransactions.length === 0" class="recent-empty">
        거래내역이 없습니다.
      </div>
    </section>
  </div>
</template>

<script setup>
/**
 * ■ <script> 영역 = 데이터와 로직을 담당
 *
 * 여기서 하는 일:
 * 1. db.json에서 데이터를 가져옴 (axios로 API 호출)
 * 2. 가져온 데이터를 가공 (총수입 계산, 필터링 등)
 * 3. template에서 쓸 수 있게 return으로 내보냄
 */

// 필요한 도구들을 가져옴 (import)
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const API_BASE = 'http://localhost:3000';

const budgetList = ref([]); // 전체 거래내역 배열
const incomeCategories = ref([]); // 수입 카테고리 목록
const expenseCategories = ref([]); // 지출 카테고리 목록
const profile = ref({ name: '' }); // 사용자 프로필

// ========== 연도/월 선택 ==========
const now = new Date(); // 현재 날짜
const selectedYear = ref(now.getFullYear()); // 올해 (예: 2026)
const selectedMonth = ref(now.getMonth() + 1); // 이번 달 (getMonth()는 0부터 시작이라 +1)

// yearOptions = select에 표시할 연도 목록
const yearOptions = computed(() => {
  const years = [];
  for (let y = 1990; y <= now.getFullYear() + 1; y++) {
    years.push(y);
  }
  return years.reverse(); // 최신 연도가 위에 오도록 뒤집기
});

// ========== 필터링: 선택한 연도/월의 거래만 골라내기 ==========
// computed → selectedYear나 selectedMonth가 바뀌면 자동으로 다시 계산됨
const filteredBudget = computed(() => {
  return budgetList.value.filter((item) => {
    // item.date = "2026-04-01" 같은 문자열
    const d = new Date(item.date);
    // 연도와 월이 선택한 것과 같은 항목만 남김
    return (
      d.getFullYear() === selectedYear.value &&
      d.getMonth() + 1 === selectedMonth.value
    );
  });
});

// 지난달 거래 (과소비/절약 비교용)
const prevMonthBudget = computed(() => {
  let pYear = selectedYear.value;
  let pMonth = selectedMonth.value - 1;
  if (pMonth === 0) {
    pYear--;
    pMonth = 12;
  } // 1월이면 작년 12월
  return budgetList.value.filter((item) => {
    const d = new Date(item.date);
    return d.getFullYear() === pYear && d.getMonth() + 1 === pMonth;
  });
});

// ========== 계산: 총수입, 총지출, 총계 ==========
const totalIncome = computed(() =>
  // type이 'income'인 것만 골라서 amount를 전부 더함
  filteredBudget.value
    .filter((i) => i.type === 'income')
    .reduce((sum, i) => sum + i.amount, 0),
);

const totalExpense = computed(() =>
  filteredBudget.value
    .filter((i) => i.type === 'expense')
    .reduce((sum, i) => sum + i.amount, 0),
);

const netAmount = computed(() => totalIncome.value - totalExpense.value);

// ========== 카테고리 이름 찾기 ==========
// item.category에는 "21" 같은 ID만 들어있으므로
// expenseCategory 목록에서 id가 "21"인 걸 찾아서 name("식비")을 반환
const getCategoryName = (item) => {
  const list =
    item.type === 'income' ? incomeCategories.value : expenseCategories.value;
  const found = list.find((c) => c.id === item.category);
  return found ? found.name : '기타';
};

// ========== 최대 지출 카테고리 ==========
const topExpenseCategory = computed(() => {
  const expenses = filteredBudget.value.filter((i) => i.type === 'expense');
  if (expenses.length === 0) return null;

  // 카테고리별로 금액을 합산
  // catMap = { "21": 55500, "22": 4500, ... }
  const catMap = {};
  expenses.forEach((e) => {
    catMap[e.category] = (catMap[e.category] || 0) + e.amount;
  });

  // 가장 큰 금액의 카테고리 ID를 찾음
  const topId = Object.keys(catMap).sort((a, b) => catMap[b] - catMap[a])[0];
  const cat = expenseCategories.value.find((c) => c.id === topId);
  return { name: cat ? cat.name : '기타', amount: catMap[topId] };
});

// ========== 지난달 대비 비교 (과소비 / 절약) ==========
// 카테고리별 지출 합계를 구하는 도우미 함수
const getCategoryExpenseMap = (list) => {
  const map = {};
  list
    .filter((i) => i.type === 'expense')
    .forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
  return map;
  // 결과 예시: { "21": 55500, "22": 4500 }
};

// 과소비 카테고리: 이번달이 지난달보다 더 많이 쓴 카테고리
const overspendCategory = computed(() => {
  const curMap = getCategoryExpenseMap(filteredBudget.value);
  const prevMap = getCategoryExpenseMap(prevMonthBudget.value);
  let worst = null;
  for (const catId of Object.keys(curMap)) {
    const diff = curMap[catId] - (prevMap[catId] || 0);
    if (diff > 0 && (!worst || diff > worst.diff)) {
      const cat = expenseCategories.value.find((c) => c.id === catId);
      worst = { name: cat ? cat.name : '기타', diff };
    }
  }
  return worst;
});

// 절약 카테고리: 이번달이 지난달보다 덜 쓴 카테고리
const savedCategory = computed(() => {
  const curMap = getCategoryExpenseMap(filteredBudget.value);
  const prevMap = getCategoryExpenseMap(prevMonthBudget.value);
  let best = null;
  for (const catId of Object.keys(prevMap)) {
    const diff = (curMap[catId] || 0) - prevMap[catId];
    if (diff < 0 && (!best || diff < best.diff)) {
      const cat = expenseCategories.value.find((c) => c.id === catId);
      best = { name: cat ? cat.name : '기타', diff };
    }
  }
  return best;
});

// ========== 최근 거래내역 5건 ==========
const recentTransactions = computed(() => {
  return [...filteredBudget.value] // 배열 복사
    .sort((a, b) => new Date(b.date) - new Date(a.date)) // 날짜 내림차순 정렬
    .slice(0, 5); // 앞에서 5개만
});

// ========== 포맷 함수들 ==========
// 숫자 → "1,320,000원" 형식
const formatMoney = (v) => {
  return new Intl.NumberFormat('ko-KR').format(v) + '원';
};

// 날짜 → "4/7(화)" 형식
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  return `${d.getMonth() + 1}/${d.getDate()}(${dayNames[d.getDay()]})`;
};

// ========== 페이지 이동 ==========
// 거래 항목 클릭 시 상세 페이지로 이동
const goToDetail = (id) => {
  router.push({
    name: 'detailedit/id',
    params: { id },
    query: { from: 'home' },
  });
};

// ========== API 호출 (데이터 가져오기) ==========
const fetchData = async () => {
  try {
    // Promise.all = 4개의 요청을 동시에 보냄 (하나씩 기다리면 느리니까)
    const [budgetRes, incomeRes, expenseRes, profileRes] = await Promise.all([
      axios.get(`${API_BASE}/budget`), // 전체 거래내역
      axios.get(`${API_BASE}/incomeCategory`), // 수입 카테고리
      axios.get(`${API_BASE}/expenseCategory`), // 지출 카테고리
      axios.get(`${API_BASE}/profile`), // 프로필
    ]);

    // 응답 데이터를 변수에 저장 → 화면이 자동으로 업데이트됨
    budgetList.value = budgetRes.data;
    incomeCategories.value = incomeRes.data;
    expenseCategories.value = expenseRes.data;
    profile.value = profileRes.data;
  } catch (e) {
    console.error('API 호출 실패:', e);
  }
};

// onMounted = 이 페이지가 화면에 처음 나타날 때 fetchData()를 실행
onMounted(fetchData);
</script>

<style scoped>
.home-page {
  padding: 16px;
  padding-bottom: 80px;
}

.home-filter-row {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 8px;
}

.summary-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 6px;
  padding: 14px 12px;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid #ece8ff;
  box-shadow: 0 8px 20px rgba(71, 56, 134, 0.06);
}

.summary-card-income {
  background: linear-gradient(180deg, #f4f8ff 0%, #ffffff 100%);
}

.summary-card-expense {
  background: linear-gradient(180deg, #fff5f5 0%, #ffffff 100%);
}

.summary-card-total {
  background: linear-gradient(180deg, #f7f5ff 0%, #ffffff 100%);
}

.summary-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #7b7890;
}

.summary-value {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.summary-value-income {
  color: #4b78b8;
}

.summary-value-expense {
  color: #d36f6f;
}

.summary-value-positive {
  color: #4d8f6d;
}

.summary-value-negative {
  color: #d36f6f;
}

.insight-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 8px;
  padding: 16px 14px;
  border-radius: 16px;
  background: linear-gradient(180deg, #fffcf7 0%, #ffffff 100%);
  border: 1px solid #ece4d8;
  box-shadow: 0 10px 24px rgba(95, 76, 54, 0.06);
}

.insight-card-header h6 {
  margin: 0;
}

.insight-card-caption {
  display: inline-block;
  margin-top: 4px;
  font-size: 0.82rem;
  color: #8a7a66;
}

.insight-item {
  padding-bottom: 12px;
  border-bottom: 1px solid #f1e7d9;
}

.insight-item-last {
  padding-bottom: 0;
  border-bottom: none;
}

.insight-title {
  display: block;
  margin-bottom: 6px;
  color: #534435;
}

.insight-value-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #3d3329;
}

.insight-value {
  flex-shrink: 0;
  font-weight: 700;
}

.insight-value-expense {
  color: #d36f6f;
}

.insight-value-save {
  color: #4d8f6d;
}

.insight-empty {
  color: #8a7a66;
  font-size: 0.9rem;
}

.recent-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 14px;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfaf7 100%);
  border: 1px solid #ece7dd;
  box-shadow: 0 10px 24px rgba(95, 76, 54, 0.05);
}

.recent-card-header h6 {
  margin: 0;
}

.recent-card-caption {
  display: inline-block;
  margin-top: 4px;
  font-size: 0.82rem;
  color: #8a7a66;
}

.recent-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
}

.recent-item-income {
  background: #edf4ff;
}

.recent-item-expense {
  background: #fff1ef;
}

.recent-copy {
  min-width: 0;
}

.recent-copy strong {
  display: block;
  color: #3d3329;
}

.recent-copy span {
  display: block;
  color: #8a7a66;
  font-size: 0.88rem;
  margin-top: 2px;
}

.recent-amount {
  flex-shrink: 0;
  font-weight: 700;
  text-align: right;
}

.recent-amount-income {
  color: #4b78b8;
}

.recent-amount-expense {
  color: #d36f6f;
}

.recent-empty {
  color: #8a7a66;
  font-size: 0.92rem;
}

/* 플러스 버튼 디자인 */
#plusButton {
  border-radius: 50%;
  background-color: #212529;
  color: rgba(255, 255, 255, 0.55);
  width: 50px;
  height: 50px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 30px;
  text-decoration: none;

  position: fixed;
  right: max(calc(50% - 230px + 16px), 16px);
  bottom: 100px;

  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.plus-icon {
  display: block;
  line-height: 1;
  transform: translateY(-2px);
}

@media (max-width: 480px) {
  .home-filter-row {
    flex-wrap: wrap;
  }

  .summary-cards {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }

  .summary-card {
    padding: 12px 8px;
    border-radius: 12px;
  }

  .summary-label {
    font-size: 0.74rem;
  }

  .summary-value {
    font-size: 0.82rem;
  }

  .insight-card {
    padding: 14px 12px;
  }

  .insight-value-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 2px;
  }

  .recent-card {
    padding: 14px 12px;
  }

  .recent-item {
    align-items: flex-start;
    flex-direction: column;
  }

  .recent-amount {
    text-align: left;
  }
}
</style>
