<<template>
  <div class="tl-container">
    <!-- 필터 바 -->
    <div class="tl-filter-bar">
      <div class="tl-filter-row">
        <label class="tl-filter-label">
          시작일
          <input type="date" v-model="filterStartDate" class="tl-input" />
        </label>
        <label class="tl-filter-label">
          종료일
          <input type="date" v-model="filterEndDate" class="tl-input" />
        </label>
      </div>
      <div class="tl-filter-row">
        <label class="tl-filter-label">
          카테고리
          <select v-model="filterCategory" class="tl-select">
            <option value="">전체</option>
            <option v-for="cat in allCategories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </label>
        <div class="tl-filter-buttons">
          <button class="btn btn-sm btn-outline-secondary" @click="resetFilter">
            초기화
          </button>
        </div>
      </div>
    </div>
    <!-- 표 레이아웃 -->
    <div class="tl-table-wrap">
      <!-- 테이블 헤더 -->
      <table class="tl-table">
        <thead>
          <tr>
            <th class="tl-col-no">No.</th>
            <th class="tl-col-date">날짜</th>
            <th class="tl-col-memo">내역</th>
            <th class="tl-col-amount">금액</th>
            <th class="tl-col-action">수정</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="pagedList.length === 0">
            <td colspan="5" class="tl-empty">내역이 없습니다</td>
          </tr>
          <tr v-for="(item, index) in pagedList" :key="item.id">
            <td class="tl-col-no">
              {{ (currentPage - 1) * perPage + index + 1 }}
            </td>
            <td class="tl-col-date">{{ item.date }}</td>
            <td class="tl-col-memo">
              <strong>{{ getCategoryName(item) }}</strong>
              <div class="tl-memo-text">{{ item.memo }}</div>
            </td>
            <td
              class="tl-col-amount"
              :class="item.type === 'expense' ? 'text-danger' : 'text-primary'"
            >
              {{ item.type === 'expense' ? '-' : '+'
              }}{{ item.amount.toLocaleString() }}원
            </td>
            <td class="tl-col-action">
              <div class="tl-action-buttons">
                <button
                  class="btn btn-sm btn-outline-primary tl-icon-btn"
                  @click="goToEdit(item.id)"
                  aria-label="내역 편집"
                  title="편집"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button
                  class="btn btn-sm btn-outline-danger tl-icon-btn"
                  @click="deleteList(item)"
                  aria-label="내역 삭제"
                  title="삭제"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 페이지네이션 -->
    <div v-if="totalPages > 1" class="tl-pagination">
      <button
        class="btn btn-sm btn-outline-secondary"
        @click="currentPage--"
        :disabled="currentPage <= 1"
      >
        이전
      </button>
      <span class="tl-page-info">{{ currentPage }} / {{ totalPages }}</span>
      <button
        class="btn btn-sm btn-outline-secondary"
        @click="currentPage++"
        :disabled="currentPage >= totalPages"
      >
        다음
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const BASEURI = '/api/budget';
const route = useRoute();
const router = useRouter();

// ========== 데이터 ==========
const states = reactive({ MyList: [] });
const incomeCategories = ref([]);
const expenseCategories = ref([]);

// ========== 필터 변수 ==========
const filterStartDate = ref('');
const filterEndDate = ref('');
const filterCategory = ref('');

// ========== 페이지네이션 ==========
const currentPage = ref(1);
const perPage = 15;

// ========== 데이터 가져오기 ==========
const fetchMyList = async () => {
  try {
    const queryParams = {};
    if (route.name && route.name !== 'transaction/all') {
      const typeOnly = route.name.includes('/')
        ? route.name.split('/')[1]
        : route.name;
      queryParams.type = typeOnly;
    }
    const response = await axios.get(BASEURI, { params: queryParams });
    if (response.status === 200) {
      states.MyList = response.data;
    }
  } catch (e) {
    console.error('데이터 로드 실패:', e);
    states.MyList = [];
  }
};

const fetchCategories = async () => {
  try {
    const [incRes, expRes] = await Promise.all([
      axios.get('/api/incomeCategory'),
      axios.get('/api/expenseCategory'),
    ]);
    incomeCategories.value = incRes.data;
    expenseCategories.value = expRes.data;
  } catch (e) {
    console.error('카테고리 로딩 실패:', e);
  }
};

// ========== 카테고리 이름 찾기 ==========
const getCategoryName = (item) => {
  const list =
    item.type === 'income' ? incomeCategories.value : expenseCategories.value;
  const found = list.find((c) => c.id === item.category);
  return found ? found.name : '기타';
};

// ========== 전체 카테고리 (필터용) ==========
const allCategories = computed(() => {
  return [...incomeCategories.value, ...expenseCategories.value];
});

// ========== 필터 적용된 목록 ==========
const filteredList = computed(() => {
  return states.MyList.filter((item) => {
    if (filterStartDate.value && item.date < filterStartDate.value)
      return false;
    if (filterEndDate.value && item.date > filterEndDate.value) return false;
    if (filterCategory.value && item.category !== filterCategory.value)
      return false;
    return true;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));
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

// ========== 필터 적용 버튼 ==========
const applyFilter = () => {
  currentPage.value = 1;
};

// ========== 삭제 ==========
const deleteList = async (item) => {
  if (!confirm('정말 이 내역을 삭제하시겠습니까?')) return;
  try {
    const response = await axios.delete(`${BASEURI}/${item.id}`);
    if (response.status === 200) {
      let index = states.MyList.findIndex((b) => b.id === item.id);
      if (index !== -1) {
        states.MyList.splice(index, 1);
      }
    }
  } catch (e) {
    alert('삭제 실패: ' + e);
  }
};

// ========== 수정 ==========
const goToEdit = (id) => {
  router.push({
    name: 'detailedit/id',
    params: { id: id },
    query: { from: route.fullPath.substring(1) },
  });
};

// ========== 탭 바뀌면 필터 초기화 + 재조회 ==========
watch(
  () => route.name,
  () => {
    currentPage.value = 1;
    filterCategory.value = '';
    fetchMyList();
  },
  { immediate: true },
);

// ========== 페이지 열릴 때 ==========
onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
.tl-container {
  padding: 0;
}
.tl-filter-bar {
  background: #f8f8fc;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 12px;
}
.tl-filter-row {
  display: flex;
  gap: 8px;
  align-items: flex-end;
  margin-bottom: 8px;
  flex-wrap: wrap;
}
.tl-filter-row:last-child {
  margin-bottom: 0;
}
.tl-filter-label {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  flex: 1;
  min-width: 100px;
}
.tl-input,
.tl-select {
  margin-top: 4px;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 13px;
  width: 100%;
}
.tl-filter-buttons {
  display: flex;
  gap: 6px;
  align-items: flex-end;
  padding-bottom: 1px;
}
.tl-table-wrap {
  width: 100%;
  overflow-x: hidden;
}
.tl-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 13px;
}
.tl-table thead {
  background: #f0eef8;
}
.tl-table th {
  padding: 10px 6px;
  font-weight: 700;
  font-size: 12px;
  color: #555;
  text-align: center;
  border-bottom: 2px solid #7b6fdc;
}
.tl-table td {
  padding: 10px 6px;
  border-bottom: 1px solid #eee;
  vertical-align: middle;
}
.tl-col-no {
  width: 34px;
  text-align: center;
  color: #999;
  font-size: 12px;
}
.tl-col-date {
  width: 84px;
  text-align: center;
  font-size: 12px;
  color: #777;
}
.tl-col-memo {
  width: auto;
  overflow: hidden;
}
.tl-col-memo strong {
  font-size: 13px;
  font-weight: 700;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tl-memo-text {
  font-size: 11px;
  color: #aaa;
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tl-col-amount {
  width: 86px;
  text-align: right;
  font-weight: 700;
  font-size: 13px;
  white-space: nowrap;
}
.tl-col-action {
  width: 76px;
  text-align: center;
}
.tl-action-buttons {
  display: flex;
  gap: 3px;
  justify-content: center;
}
.tl-action-buttons .btn {
  font-size: 11px;
  padding: 3px 6px;
  white-space: nowrap;
}
.tl-icon-btn {
  width: 30px;
  height: 30px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #777;
  border: none;
  background-color: transparent;
}
.tl-icon-btn i {
  font-size: 13px;
  line-height: 1;
}
.tl-icon-btn:hover,
.tl-icon-btn:focus,
.tl-icon-btn:active {
  color: #777;
  border: none;
  background-color: transparent;
  box-shadow: none;
}
.tl-empty {
  text-align: center;
  color: #bbb;
  padding: 40px 0;
}
.tl-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 14px;
  padding-bottom: 10px;
}
.tl-page-info {
  font-size: 13px;
  font-weight: 600;
  color: #555;
}

@media (max-width: 480px) {
  .tl-table td {
    padding: 8px 4px;
  }

  .tl-filter-label {
    min-width: 0;
  }

  .tl-table th {
    padding: 8px 4px;
    font-size: 11px;
  }

  .tl-table {
    font-size: 12px;
  }

  .tl-col-no {
    width: 28px;
    font-size: 11px;
  }

  .tl-col-date {
    width: 70px;
    font-size: 11px;
  }

  .tl-col-memo strong {
    font-size: 12px;
  }

  .tl-memo-text {
    font-size: 10px;
  }

  .tl-col-amount {
    width: 72px;
    font-size: 11px;
  }

  .tl-action-buttons {
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .tl-action-buttons .btn {
    font-size: 10px;
    padding: 2px 4px;
  }

  .tl-icon-btn {
    width: 26px;
    height: 26px;
    padding: 0;
  }

  .tl-icon-btn i {
    font-size: 12px;
  }
}
</style>