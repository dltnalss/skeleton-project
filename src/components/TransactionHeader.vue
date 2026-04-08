<template>
    <div class="wrapper">
    <div class="tab-group">
<button
    v-for="tab in tabs"
    :key="tab.key"
    :class="['tab-btn', tab.key, { active: activeTab === tab.key }]"
    @click="activeTab = tab.key"
  >
    {{ tab.label }}
  </button>
</div>

    <div class="card">
  <p v-if="filteredEntries.length === 0" class="empty">내역이 없습니다</p>
  <div v-for="(entry, i) in filteredEntries" :key="i" class="entry">
    <span>{{ entry.desc }}</span>
    <span :class="entry.type">
      {{ entry.type === 'income' ? '+' : '-' }}₩{{ entry.amount.toLocaleString() }}
    </span>
  </div>
</div>
</div>
</template>

<script setup>
import { ref, computed } from 'vue';


const activeTab = ref('all')
const showModal = ref(false)
const entries = ref([])

const tabs = [
  { key: 'all',     label: '전체' },
  { key: 'income',  label: '수입' },
  { key: 'expense', label: '지출' },
]  

const filteredEntries = computed(() => {
  if (activeTab.value === 'all') return entries.value
  return entries.value.filter(e => e.type === activeTab.value)
})
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 1rem;
  background: #e8e6f8;
  min-height: 100vh;
}
.tab-group { display: flex; align-self: flex-end; border-radius: 10px; overflow: hidden; }
.tab-btn { padding: 7px 18px; font-size: 13px; border: none; cursor: pointer; color: white; }
.tab-btn.all,
.tab-btn.income  { background: #7b6fdc; }
.tab-btn.expense { background: #e07a7a; }
.tab-btn.active  { filter: brightness(0.8); }
.card { background: white; border-radius: 16px; flex: 1; padding: 16px; min-height: 300px; }
.empty { color: #bbb; text-align: center; margin-top: 60px; }
.entry { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 0.5px solid #f0f0f0; font-size: 14px; }
.entry .income { color: #4a90c4; font-weight: 500; }
.entry .expense { color: #d9534f; font-weight: 500; }
</style>