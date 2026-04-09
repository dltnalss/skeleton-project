<template>
  <div class="wrapper">
    <!-- 탭 버튼 (전체/수입/지출) -->
    <div class="tab-group">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="['tab-btn', tab.key, { active: activeTab === tab.key }]"
        @click="goToTab(tab.key)"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- ■ 필터 바: 날짜 범위 + 카테고리 -->
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

    <!-- ■ 거래 목록 카드 -->
    <div class="card">
      <p v-if="pagedList.length === 0" class="empty">내역이 없습니다</p>

      <!-- 각 거래 항목 -->
      <div v-for="entry in pagedList" :key="entry.id" class="entry">
        <div>
          <span style="color: #999; font-size: 12px; margin-right: 10px">
            {{ entry.date }}
          </span>
          <span style="margin-right: 8px">{{ getCategoryName(entry) }}</span>
          <span>{{ entry.memo }}</span>
        </div>
      </div>
    </div>

    <!-- ■ 페이지네이션 -->
    <div v-if="totalPages > 1" style="text-align: center; margin-top: 12px">
      <button @click="currentPage--" :disabled="currentPage <= 1">이전</button>
      <span style="margin: 0 12px">{{ currentPage }} / {{ totalPages }}</span>
      <button @click="currentPage++" :disabled="currentPage >= totalPages">
        다음
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

// ========== 탭 ==========
const tabs = [
  { key: 'all', label: '전체' },
  { key: 'income', label: '수입' },
  { key: 'expense', label: '지출' },
];
const activeTab = ref('all');

// ========== 데이터 ==========
const entries = ref([]);
const incomeCategories = ref([]);
const expenseCategories = ref([]);

// ========== 필터 ==========
const filterStartDate = ref('');
const filterEndDate = ref('');
const filterCategory = ref('');

// ========== 페이지네이션 ==========
const currentPage = ref(1);
const perPage = 15;

// ========== 데이터 가져오기 ==========
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

// ========== 카테고리 이름 찾기 ==========
const getCategoryName = (item) => {
  const list =
    item.type === 'income' ? incomeCategories.value : expenseCategories.value;
  const found = list.find((c) => c.id === item.category);
  return found ? found.name : '';
};

// ========== 전체 카테고리 (필터 드롭다운용) ==========
const allCategories = computed(() => {
  return [...incomeCategories.value, ...expenseCategories.value];
});

// ========== 탭 전환 ==========
const goToTab = (key) => {
  activeTab.value = key;
  currentPage.value = 1;
  filterCategory.value = '';
};

// ========== 탭 + 필터 적용된 목록 ==========
const filteredList = computed(() => {
  return entries.value.filter((item) => {
    // 탭 필터 (전체/수입/지출)
    if (activeTab.value !== 'all' && item.type !== activeTab.value) {
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
  });
});

// ========== 페이지네이션 ==========
const pagedList = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredList.value.slice(start, start + perPage);
});

const totalPages = computed(() => {
  return Math.ceil(filteredList.value.length / perPage);
});

// ========== 필터 초기화 ==========
const resetFilter = () => {
  filterStartDate.value = '';
  filterEndDate.value = '';
  filterCategory.value = '';
  currentPage.value = 1;
};

// ========== 필터 바뀌면 1페이지로 ==========
watch([filterStartDate, filterEndDate, filterCategory], () => {
  currentPage.value = 1;
});

// ========== 수정 ==========
const goEdit = (id) => {
  router.push('/addList?edit=' + id);
};

// ========== 삭제 ==========
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
  margin-bottom: 65px;
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
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 0.5px solid #f0f0f0;
  font-size: 14px;
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
