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

    <router-view />

    <!-- <div class="card">
      <p v-if="filteredEntries.length === 0" class="empty">내역이 없습니다</p>

      <div v-for="(entry, i) in filteredEntries" :key="i" class="entry">
        <div>
          <span style="color: #999; font-size: 12px; margin-right: 10px">
            {{ entry.date }}
          </span>
          <span>{{ entry.memo }}</span>
        </div>

        <span :class="entry.type">
          {{ entry.type === 'income' ? '+' : '-' }}₩{{
            entry.amount.toLocaleString()
          }}
        </span>
      </div>
    </div> -->
  </div>
</template>

<script setup>
// 1. axios와 onMounted를 추가로 불러옵니다.
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const tabs = [
  { key: 'transaction/all', classStyle: 'all', label: '전체' },
  { key: 'transaction/income', classStyle: 'income', label: '수입' },
  { key: 'transaction/expense', classStyle: 'expense', label: '지출' },
];

const router = useRouter();

const activeTab = ref(tabs[0].key);
// const showModal = ref(false);

// 2. 가짜 데이터를 지우고, 빈 창고(배열)만 하나 만들어 둡니다.
const entries = ref([]);

// 3. 화면이 켜질 때 db.json에서 데이터를 가져오라고 명령합니다.
// 3. 화면이 켜질 때 db.json의 "budget" 데이터를 가져오라고 명령합니다.
// onMounted(async () => {
//   try {
//     // 🚨 주소 맨 끝부분을 entries에서 budget으로 변경했습니다!
//     const response = await axios.get('http://localhost:3000/budget');
//     entries.value = response.data; // 가져온 예산 데이터를 빈 창고에 채워넣습니다!
//   } catch (error) {
//     console.error('데이터를 불러오는데 실패했습니다:', error);
//   }
// });

const goToTab = (key) => {
  // console.log(activeTab.value, '+', key);
  activeTab.value = key;
  router.push({ name: key });
};

// computed는 그대로 둡니다!
// const filteredEntries = computed(() => {
//   if (activeTab.value === tabs[0].key) return entries.value;
//   return entries.value.filter((e) => e.type === activeTab.value);
// });
</script>

<style scoped>
/* 스타일 코드는 보내주신 것과 100% 동일하게 유지했습니다 */
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 1rem;
  background: #e8e6f8;
  min-height: 100vh;
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
