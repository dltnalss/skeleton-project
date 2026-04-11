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

    <!-- TransactionList가 여기에 router-view로 표시됨 -->
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const tabs = [
  { key: 'transaction/all', classStyle: 'all', label: '전체' },
  { key: 'transaction/income', classStyle: 'income', label: '수입' },
  { key: 'transaction/expense', classStyle: 'expense', label: '지출' },
];

const router = useRouter();
const route = useRoute();
const activeTab = ref(route.name || tabs[0].key);

const goToTab = (key) => {
  activeTab.value = key;
  router.push('/' + key);
};
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 1rem;
  background: #e8e6f8;
  min-height: 60vh;
  margin-bottom: 60px;
}
.tab-group {
  display: flex;
  align-self: flex-end;
  border-radius: 10px;
  overflow: hidden;
}
.tab-btn {
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 600;
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
</style>
