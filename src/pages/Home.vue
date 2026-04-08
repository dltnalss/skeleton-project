<template>
  <!--
    ■ Home.vue = 가계부 홈 화면

    구조 (위에서 아래로):
    1. 타이틀 (인사말)
    2. 연도/월 선택 + 총수입/총지출/총계
    3. 이번 달 인사이트 (최대지출, 과소비, 절약)
    4. 최근 거래내역 5건 (클릭하면 상세 페이지로 이동)
  -->
  <div style="padding: 16px; padding-bottom: 80px;">

    <!--  1. 타이틀  -->
    <h5>나의 가계부</h5>
    <p>{{ profile.name }}님, 오늘도 알뜰한 하루 되세요!</p>

    <!--  2. 연도/월 선택  -->
    <div>
      <select v-model="selectedYear">
        <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}년</option>
      </select>

      <select v-model="selectedMonth">
        <option v-for="m in 12" :key="m" :value="m">{{ m }}월</option>
      </select>
    </div>

    <!--  총수입 / 총지출 / 총계  -->
    <div>
      <div>
        <span>총 수입: </span>
        <span style="color: blue;">{{ formatMoney(totalIncome) }}</span>
      </div>
      <div>
        <span>총 지출: </span>
        <span style="color: red;">{{ formatMoney(totalExpense) }}</span>
      </div>
      <div>
        <span>총계: </span>
        <span :style="{ color: netAmount >= 0 ? 'green' : 'red' }">
          {{ netAmount >= 0 ? '+' : '' }}{{ formatMoney(netAmount) }}
        </span>
      </div>
    </div>

    <hr>

    <!--  3. 이번 달 인사이트  -->

    <!-- 3-1. 최대 지출 카테고리 -->
    <div>
      <strong>최대 지출 카테고리</strong>
      <div v-if="topExpenseCategory">
        {{ topExpenseCategory.name }} -
        <span style="color: red;">{{ formatMoney(topExpenseCategory.amount) }}</span>
      </div>
      <div v-else>지출 내역이 없습니다</div>
    </div>

    <!-- 3-2. 지난달 대비 과소비 카테고리 -->
    <div>
      <strong>지난달 대비 과소비</strong>
      <div v-if="overspendCategory">
        {{ overspendCategory.name }} -
        <span style="color: red;">+{{ formatMoney(overspendCategory.diff) }}</span>
      </div>
      <div v-else>과소비 카테고리가 없습니다</div>
    </div>

    <!-- 3-3. 잘 아끼고 있는 카테고리 -->
    <div>
      <strong>잘 아끼고 있어요!</strong>
      <div v-if="savedCategory">
        {{ savedCategory.name }} -
        <span style="color: green;">-{{ formatMoney(Math.abs(savedCategory.diff)) }}</span>
      </div>
      <div v-else>비교할 지난달 데이터가 없습니다</div>
    </div>

    <hr>

    <!-- 4. 최근 거래내역 5건 -->
    <h6>최근 거래내역</h6>

    <div
      v-for="item in recentTransactions"
      :key="item.id"
      @click="goToDetail(item.id)"
      :style="{
        padding: '10px',
        marginBottom: '8px',
        backgroundColor: item.type === 'income' ? '#e8f0fe' : '#fce8e6',
        cursor: 'pointer',
        borderRadius: '8px'
      }"></div>

      <!-- 좌측: 날짜, 카테고리, 메모 -->
      <div>
        <strong>{{ getCategoryName(item) }}</strong>
        <span> | {{ formatDate(item.date) }} | {{ item.memo }}</span>
      </div>

      <!-- 우측: 금액 -->
      <div :style="{ color: item.type === 'income' ? 'blue' : 'red' }">
        <span v-if="item.type === 'income'">↑ +{{ formatMoney(item.amount) }} (수입)</span>
        <span v-else>↓ -{{ formatMoney(item.amount) }} (지출)</span>
      </div>
    </div>

    <!-- 거래내역이 하나도 없을 때 -->
    <div v-if="recentTransactions.length === 0">
      거래내역이 없습니다.
    </div>

  </div>
</template>


<script>
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
// ref = 변하는 데이터를 담는 상자
// computed = 다른 데이터가 바뀌면 자동으로 다시 계산되는 값
// onMounted = 페이지가 처음 화면에 표시될 때 실행할 코드

import axios from 'axios';
// axios = 서버(json-server)에 데이터를 요청하는 도구

import { useRouter } from 'vue-router';
// useRouter = 코드에서 페이지를 이동시킬 때 사용

export default {
  name: 'Home',

  setup() {
    // ■ useRouter() → 페이지 이동 기능을 사용하겠다는 선언
    const router = useRouter();

    // ■ API 주소. json-server가 이 주소에서 돌아감
    const API_BASE = 'http://localhost:3000';


    // ========== 데이터 저장용 변수들 (ref) ==========
    // ref()로 감싸면 값이 바뀔 때 화면이 자동으로 업데이트됨

    const budgetList = ref([]);          // 전체 거래내역 배열
    const incomeCategories = ref([]);    // 수입 카테고리 목록
    const expenseCategories = ref([]);   // 지출 카테고리 목록
    const profile = ref({ name: '' });   // 사용자 프로필


    // ========== 연도/월 선택 ==========
    const now = new Date();                        // 현재 날짜
    const selectedYear = ref(now.getFullYear());   // 올해 (예: 2026)
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
        return d.getFullYear() === selectedYear.value
            && d.getMonth() + 1 === selectedMonth.value;
      });
    });adf

    // 지난달 거래 (과소비/절약 비교용)
    const prevMonthBudget = computed(() => {
      let pYear = selectedYear.value;
      let pMonth = selectedMonth.value - 1;
      if (pMonth === 0) { pYear--; pMonth = 12; } // 1월이면 작년 12월
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
        .reduce((sum, i) => sum + i.amount, 0)
    );

    const totalExpense = computed(() =>
      filteredBudget.value
        .filter((i) => i.type === 'expense')
        .reduce((sum, i) => sum + i.amount, 0)
    );

    const netAmount = computed(() => totalIncome.value - totalExpense.value);


    // ========== 카테고리 이름 찾기 ==========
    // item.category에는 "21" 같은 ID만 들어있으므로
    // expenseCategory 목록에서 id가 "21"인 걸 찾아서 name("식비")을 반환
    const getCategoryName = (item) => {
      const list = item.type === 'income'
        ? incomeCategories.value
        : expenseCategories.value;
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
      list.filter((i) => i.type === 'expense').forEach((e) => {
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
      return [...filteredBudget.value]                    // 배열 복사
        .sort((a, b) => new Date(b.date) - new Date(a.date))  // 날짜 내림차순 정렬
        .slice(0, 5);                                     // 앞에서 5개만
    });


    // ========== 포맷 함수들 ==========
    // 숫자 → "1,320,000원" 형식
    const formatMoney = (v) => {
      return new Intl.NumberFormat('ko-KR').format(v) + '원';
    };

    // 날짜 → "4/7(화)" 형식
    const formatDate = (dateStr) => {
      const d = new Date(dateStr);
      const dayNames = ['일','월','화','수','목','금','토'];
      return `${d.getMonth() + 1}/${d.getDate()}(${dayNames[d.getDay()]})`;
    };


    // ========== 페이지 이동 ==========
    // 거래 항목 클릭 시 상세 페이지로 이동
    const goToDetail = (id) => {
      // router.push = 프로그래밍적으로 페이지 이동
      // name: 'transactionDetail' → router/index.js에 정의한 라우트 이름
      // params: { id } → URL의 :id 자리에 실제 id 값을 넣음
      router.push({ name: 'transactionDetail', params: { id } });
    };


    // ========== API 호출 (데이터 가져오기) ==========
    const fetchData = async () => {
      try {
        // Promise.all = 4개의 요청을 동시에 보냄 (하나씩 기다리면 느리니까)
        const [budgetRes, incomeRes, expenseRes, profileRes] = await Promise.all([
          axios.get(`${API_BASE}/budget`),            // 전체 거래내역
          axios.get(`${API_BASE}/incomeCategory`),    // 수입 카테고리
          axios.get(`${API_BASE}/expenseCategory`),   // 지출 카테고리
          axios.get(`${API_BASE}/profile`),           // 프로필
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


    // ========== template에서 사용할 것들을 return ==========
    // 여기서 return하지 않으면 template에서 {{ 변수 }}로 사용할 수 없음
    return {
      profile,
      selectedYear,
      selectedMonth,
      yearOptions,
      totalIncome,
      totalExpense,
      netAmount,
      topExpenseCategory,
      overspendCategory,
      savedCategory,
      recentTransactions,
      getCategoryName,
      formatMoney,
      formatDate,
      goToDetail,
    };
  },
};
</script>
