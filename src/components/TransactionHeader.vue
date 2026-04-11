<template>
  <div class="wrapper">
    <div class="tab-group">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="['tab-btn', tab.classStyle, { active: activeTab === tab.key }]"
        @click="goToTab(tab.key)"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- ★ 추가 (15~38줄): 필터 바 -->
    <!--
      기존에 <router-view /> 가 있던 자리를 필터 바로 교체
      router-view는 삭제 (TransactionList와 역할 중복이므로)
    -->
    <div style="margin-bottom: 12px">
      <div>
        <label
          >시작일:
          <input type="date" v-model="filterStartDate" />
        </label>
        <label style="margin-left: 8px"
          >종료일:
          <input type="date" v-model="filterEndDate" />
        </label>
        <label style="margin-left: 8px"
          >카테고리:
          <select v-model="filterCategory">
            <option value="">전체</option>
            <option v-for="cat in allCategories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </label>
        <button @click="resetFilter" style="margin-left: 8px">초기화</button>
      </div>
    </div>

    <router-view></router-view>
  </div>
  <!-- ★ 추가 (69~75줄): 페이지네이션 -->
  <div v-if="totalPages > 1" style="text-align: center; margin-top: 12px">
    <button @click="currentPage--" :disabled="currentPage <= 1">이전</button>
    <span style="margin: 0 12px">{{ currentPage }} / {{ totalPages }}</span>
    <button @click="currentPage++" :disabled="currentPage >= totalPages">
      다음
    </button>
  </div>
</template>

<script setup>
// ★ 수정 (80줄): watch 추가
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const tabs = [
  { key: 'transaction/all', classStyle: 'all', label: '전체' },
  { key: 'transaction/income', classStyle: 'income', label: '수입' },
  { key: 'transaction/expense', classStyle: 'expense', label: '지출' },
];

const router = useRouter();
const activeTab = ref(tabs[0].key);

// ★ 추가 (93~95줄): 카테고리 데이터 저장용 변수
const entries = ref([]);
const incomeCategories = ref([]);
const expenseCategories = ref([]);

// ★ 추가 (97~99줄): 필터 변수
const filterStartDate = ref('');
const filterEndDate = ref('');
const filterCategory = ref('');

// ★ 추가 (101~102줄): 페이지네이션 변수
const currentPage = ref(1);
const perPage = 15;

// ★ 추가 (104~119줄): 데이터 가져오기 (budget + 카테고리)
// 기존 주석처리된 onMounted를 대체
const fetchData = async () => {
  try {
    const [budgetRes, incRes, expRes] = await Promise.all([
      axios.get('http://localhost:3000/budget'),
      axios.get('http://localhost:3000/incomeCategory'),
      axios.get('http://localhost:3000/expenseCategory'),
    ]);
    entries.value = budgetRes.data;
    incomeCategories.value = incRes.data;
    expenseCategories.value = expRes.data;
  } catch (e) {
    console.error('데이터 로드 실패:', e);
  }
};
onMounted(fetchData);

// ★ 추가 (121~126줄): 카테고리 id → 이름 변환
const getCategoryName = (item) => {
  const list =
    item.type === 'income' ? incomeCategories.value : expenseCategories.value;
  const found = list.find((c) => c.id === item.category);
  return found ? found.name : '';
};

// ★ 추가 (128~130줄): 필터 드롭다운용 전체 카테고리
const allCategories = computed(() => {
  return [...incomeCategories.value, ...expenseCategories.value];
});

// ★ 수정 (132~137줄): goToTab에 필터 초기화 추가
const goToTab = (key) => {
  activeTab.value = key;
  currentPage.value = 1;
  filterCategory.value = '';
  router.push('/' + key);
};

// ★ 추가 (139~157줄): 탭 + 날짜 + 카테고리 필터 적용
const filteredList = computed(() => {
  return (
    entries.value
      .filter((item) => {
        // 탭 필터: 'transaction/income' → 'income'만 꺼내서 비교
        const tabType = activeTab.value.split('/').pop();
        if (tabType !== 'all' && item.type !== tabType) {
          return false;
        }
        // 날짜 필터
        if (filterStartDate.value && item.date < filterStartDate.value) {
          return false;
        }
        if (filterEndDate.value && item.date > filterEndDate.value) {
          return false;
        }
        // 카테고리 필터
        if (filterCategory.value && item.category !== filterCategory.value) {
          return false;
        }
        return true;
      })
      // ★ 날짜 내림차순 정렬 (최신이 위에 옴)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  );
});

// ★ 추가 (159~162줄): 페이지네이션
const pagedList = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredList.value.slice(start, start + perPage);
});

const totalPages = computed(() => {
  return Math.ceil(filteredList.value.length / perPage);
});

// ★ 추가 (167~172줄): 필터 초기화
const resetFilter = () => {
  filterStartDate.value = '';
  filterEndDate.value = '';
  filterCategory.value = '';
  currentPage.value = 1;
};

// ★ 추가 (174~176줄): 필터 바뀌면 1페이지로
watch([filterStartDate, filterEndDate, filterCategory], () => {
  currentPage.value = 1;
});

// ★ 추가 (178~180줄): 수정 버튼
const goEdit = (id) => {
  router.push('/addList?edit=' + id);
};

// ★ 추가 (182~190줄): 삭제 버튼
const deleteItem = async (id) => {
  if (!confirm('정말 삭제하시겠습니까?')) return;
  try {
    await axios.delete(`http://localhost:3000/budget/${id}`);
    fetchData();
  } catch (e) {
    console.error('삭제 실패:', e);
    alert('삭제에 실패했습니다');
  }
};
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 1rem;
  background: #e8e6f8;
  min-height: 100vh;
  margin-bottom: 60px;
}
.tab-group {
  display: flex;
  align-self: flex-end;
  border-radius: 10px;
  overflow: hidden;
}
.tab-btn {
  padding: 7px 18px;
  font-size: 13px;
  border: none;
  cursor: pointer;
  color: white;
}
.tab-btn.all,
.tab-btn.income {
  background: #7b6fdc;
}
.tab-btn.expense {
  background: #e07a7a;
}
.tab-btn.active {
  filter: brightness(0.8);
}
.card {
  background: white;
  border-radius: 16px;
  flex: 1;
  padding: 16px;
  min-height: 300px;
}
.empty {
  color: #bbb;
  text-align: center;
  margin-top: 60px;
}
.entry {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 0.5px solid #f0f0f0;
  font-size: 14px;
  gap: 8px;
}
.entry .income {
  color: #4a90c4;
  font-weight: 500;
}
.entry .expense {
  color: #d9534f;
  font-weight: 500;
}
</style>
