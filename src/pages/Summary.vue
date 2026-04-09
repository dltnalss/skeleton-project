<template>
  <section class="summary-page">
    <div class="summary-card">
      <p class="eyebrow">Monthly Expense Trend</p>
      <h2 class="title">월별 지출 추이</h2>
      <p class="description">
        `db.json`의 <code>budget</code> 데이터에서 지출만 모아 월별 흐름과 선택한
        달의 카테고리별 지출 합계를 함께 보여줍니다.
      </p>

      <div v-if="loading" class="status-box">데이터를 불러오는 중입니다.</div>
      <div v-else-if="error" class="status-box error">{{ error }}</div>

      <template v-else>
        <div v-if="monthlyExpenseTrend.length" class="chart-card">
          <div class="chart-head">
            <div>
              <p class="chart-label">최근 월별 합계</p>
              <strong class="chart-value">{{ formatCurrency(totalExpense) }}</strong>
            </div>
            <p class="chart-subtext">전체 {{ monthlyExpenseTrend.length }}개월 지출 합계</p>
          </div>

          <div class="chart-grid" aria-label="월별 지출 추이 그래프">
            <div
              v-for="item in monthlyExpenseTrend"
              :key="item.month"
              class="bar-group"
            >
              <span class="bar-value">{{ formatCurrency(item.expense) }}</span>
              <div class="bar-track">
                <div class="bar-fill" :style="{ height: `${item.ratio}%` }" />
              </div>
              <span class="bar-month">{{ item.label }}</span>
            </div>
          </div>
        </div>

        <div v-if="monthlyExpenseTrend.length" class="chart-card secondary-card">
          <div class="chart-head">
            <div>
              <p class="chart-label">카테고리별 지출 합계</p>
              <strong class="chart-value">{{ selectedMonthDisplay }}</strong>
            </div>
            <p class="chart-subtext">
              선택한 달 총 지출 {{ formatCurrency(selectedMonthExpenseTotal) }}
            </p>
          </div>

          <div class="month-selector" aria-label="카테고리 그래프 월 선택">
            <button
              v-for="item in monthlyExpenseTrend"
              :key="`${item.month}-button`"
              type="button"
              class="month-chip"
              :class="{ active: item.month === selectedMonth }"
              @click="selectedMonth = item.month"
            >
              {{ item.label }}
            </button>
          </div>

          <div
            v-if="categoryExpenseTrend.length"
            class="category-chart"
            aria-label="선택한 달의 카테고리별 지출 그래프"
          >
            <article
              v-for="item in categoryExpenseTrend"
              :key="item.categoryId"
              class="category-row"
            >
              <div class="category-copy">
                <div class="category-title-row">
                  <strong class="category-name">{{ item.name }}</strong>
                  <span class="category-percent">{{ item.percent }}%</span>
                </div>
                <div class="category-bar">
                  <div
                    class="category-fill"
                    :style="{ width: `${item.ratio}%` }"
                  />
                </div>
              </div>
              <strong class="category-amount">{{ formatCurrency(item.amount) }}</strong>
            </article>
          </div>

          <div v-else class="status-box inner-status">
            선택한 달의 카테고리 지출 데이터가 없습니다.
          </div>
        </div>

        <div v-if="monthlyExpenseTrend.length" class="table-card">
          <div class="table-head">
            <h3>월별 요약</h3>
            <p>지출이 가장 큰 달은 {{ highestExpenseMonthLabel }}입니다.</p>
          </div>

          <div class="summary-list">
            <article
              v-for="item in monthlyExpenseTrend"
              :key="`${item.month}-summary`"
              class="summary-item"
            >
              <div>
                <p class="summary-month">{{ item.label }}</p>
                <p class="summary-caption">총 지출</p>
              </div>
              <strong class="summary-amount">{{ formatCurrency(item.expense) }}</strong>
            </article>
          </div>
        </div>

        <div v-else class="status-box">표시할 지출 데이터가 없습니다.</div>
      </template>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import axios from 'axios';

const budget = ref([]);
const expenseCategories = ref([]);
const selectedMonth = ref('');
const loading = ref(true);
const error = ref('');

const formatCurrency = (value) =>
  new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(value);

onMounted(async () => {
  try {
    const [budgetResponse, categoryResponse] = await Promise.all([
      axios.get('http://localhost:3000/budget'),
      axios.get('http://localhost:3000/expenseCategory'),
    ]);

    budget.value = Array.isArray(budgetResponse.data) ? budgetResponse.data : [];
    expenseCategories.value = Array.isArray(categoryResponse.data)
      ? categoryResponse.data
      : [];
  } catch (err) {
    error.value =
      '지출 데이터를 불러오지 못했습니다. json-server 실행 상태를 확인해 주세요.';
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const monthlyExpenseTrend = computed(() => {
  const grouped = budget.value.reduce((acc, item) => {
    if (item.type !== 'expense' || !item.date) {
      return acc;
    }

    const month = item.date.slice(0, 7);
    acc[month] = (acc[month] || 0) + Number(item.amount || 0);
    return acc;
  }, {});

  const entries = Object.entries(grouped)
    .sort(([monthA], [monthB]) => monthA.localeCompare(monthB))
    .map(([month, expense]) => ({
      month,
      expense,
      label: month.replace('-', '.'),
    }));

  const maxExpense = Math.max(...entries.map((item) => item.expense), 0);

  return entries.map((item) => ({
    ...item,
    ratio: maxExpense ? Math.round((item.expense / maxExpense) * 100) : 0,
  }));
});

watch(
  monthlyExpenseTrend,
  (months) => {
    if (!months.length) {
      selectedMonth.value = '';
      return;
    }

    const hasSelectedMonth = months.some((item) => item.month === selectedMonth.value);

    if (!hasSelectedMonth) {
      selectedMonth.value = months[months.length - 1].month;
    }
  },
  { immediate: true },
);

const selectedMonthDisplay = computed(() => {
  if (!selectedMonth.value) {
    return '-';
  }

  return selectedMonth.value.replace('-', '.');
});

const totalExpense = computed(() =>
  monthlyExpenseTrend.value.reduce((sum, item) => sum + item.expense, 0),
);

const highestExpenseMonthLabel = computed(() => {
  if (!monthlyExpenseTrend.value.length) {
    return '-';
  }

  const highest = [...monthlyExpenseTrend.value].sort(
    (a, b) => b.expense - a.expense,
  )[0];

  return `${highest.label} (${formatCurrency(highest.expense)})`;
});

const categoryExpenseTrend = computed(() => {
  if (!selectedMonth.value) {
    return [];
  }

  const grouped = budget.value.reduce((acc, item) => {
    if (
      item.type !== 'expense' ||
      !item.date ||
      item.date.slice(0, 7) !== selectedMonth.value
    ) {
      return acc;
    }

    acc[item.category] = (acc[item.category] || 0) + Number(item.amount || 0);
    return acc;
  }, {});

  const entries = Object.entries(grouped).map(([categoryId, amount]) => {
    const matchedCategory = expenseCategories.value.find(
      (category) => category.id === categoryId,
    );

    return {
      categoryId,
      amount,
      name: matchedCategory?.name || `카테고리 ${categoryId}`,
    };
  });

  const maxAmount = Math.max(...entries.map((item) => item.amount), 0);
  const totalAmount = entries.reduce((sum, item) => sum + item.amount, 0);

  return entries
    .sort((a, b) => b.amount - a.amount)
    .map((item) => ({
      ...item,
      ratio: maxAmount ? Math.round((item.amount / maxAmount) * 100) : 0,
      percent: totalAmount ? Math.round((item.amount / totalAmount) * 100) : 0,
    }));
});

const selectedMonthExpenseTotal = computed(() =>
  categoryExpenseTrend.value.reduce((sum, item) => sum + item.amount, 0),
);
</script>

<style scoped>
.summary-page {
  padding: 20px 16px 40px;
}

.summary-card {
  background:
    radial-gradient(circle at top right, rgba(234, 179, 8, 0.22), transparent 28%),
    linear-gradient(160deg, #fffdf7 0%, #f4efe4 100%);
  border: 1px solid #eadfca;
  border-radius: 28px;
  box-shadow: 0 18px 40px rgba(87, 62, 20, 0.08);
  padding: 24px;
}

.eyebrow {
  color: #9a6b00;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  margin: 0 0 8px;
  text-transform: uppercase;
}

.title {
  color: #2f2416;
  font-size: 1.8rem;
  margin: 0;
}

.description {
  color: #6f5d46;
  line-height: 1.6;
  margin: 12px 0 0;
}

.chart-card,
.table-card,
.status-box {
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(140, 106, 54, 0.12);
  border-radius: 22px;
  margin-top: 22px;
  padding: 18px;
}

.secondary-card {
  background:
    linear-gradient(180deg, rgba(255, 253, 247, 0.96), rgba(253, 247, 234, 0.94));
}

.status-box {
  color: #5f4c36;
  text-align: center;
}

.status-box.error {
  color: #8c2f1f;
}

.inner-status {
  margin-top: 16px;
}

.chart-head,
.table-head,
.summary-item {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.chart-label,
.summary-caption,
.chart-subtext,
.table-head p,
.summary-month {
  margin: 0;
}

.chart-label,
.summary-caption {
  color: #8a7354;
  font-size: 0.82rem;
}

.chart-value,
.summary-amount {
  color: #2f2416;
  font-size: 1.2rem;
}

.chart-subtext,
.table-head p {
  color: #6f5d46;
  font-size: 0.9rem;
}

.chart-grid {
  align-items: end;
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  margin-top: 22px;
}

.bar-group {
  align-items: stretch;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bar-value,
.bar-month {
  color: #5f4c36;
  font-size: 0.82rem;
  text-align: center;
}

.bar-track {
  align-items: end;
  background:
    linear-gradient(to top, rgba(194, 168, 116, 0.12), rgba(194, 168, 116, 0.02));
  border: 1px solid rgba(154, 107, 0, 0.08);
  border-radius: 18px;
  display: flex;
  height: 220px;
  overflow: hidden;
  padding: 8px;
}

.bar-fill {
  align-self: flex-end;
  animation: rise 0.7s ease;
  background: linear-gradient(180deg, #f5ba33 0%, #cc7f17 100%);
  border-radius: 14px;
  box-shadow: 0 10px 24px rgba(204, 127, 23, 0.28);
  display: block;
  min-height: 10px;
  width: 100%;
}

.month-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.month-chip {
  background: #fff7e3;
  border: 1px solid #e5c98a;
  border-radius: 999px;
  color: #7a5718;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 700;
  padding: 8px 14px;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.month-chip.active {
  background: linear-gradient(135deg, #f5ba33 0%, #d78618 100%);
  border-color: transparent;
  box-shadow: 0 8px 18px rgba(215, 134, 24, 0.25);
  color: #fffdf7;
}

.month-chip:hover {
  transform: translateY(-1px);
}

.category-chart {
  display: grid;
  gap: 14px;
  margin-top: 18px;
}

.category-row {
  align-items: center;
  display: grid;
  gap: 14px;
  grid-template-columns: minmax(0, 1fr) auto;
}

.category-copy {
  min-width: 0;
}

.category-title-row {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.category-name,
.category-amount {
  color: #2f2416;
}

.category-percent {
  color: #8a7354;
  flex-shrink: 0;
  font-size: 0.85rem;
  font-weight: 700;
}

.category-bar {
  background: rgba(194, 168, 116, 0.14);
  border-radius: 999px;
  height: 14px;
  overflow: hidden;
  width: 100%;
}

.category-fill {
  animation: widen 0.7s ease;
  background: linear-gradient(90deg, #f4a340 0%, #b86118 100%);
  border-radius: 999px;
  display: block;
  height: 100%;
  min-width: 10px;
}

.table-head {
  margin-bottom: 14px;
}

.table-head h3 {
  color: #2f2416;
  margin: 0;
}

.summary-list {
  display: grid;
  gap: 12px;
}

.summary-item {
  background: rgba(255, 249, 238, 0.92);
  border-radius: 16px;
  padding: 14px 16px;
}

.summary-month {
  color: #2f2416;
  font-weight: 700;
}

@keyframes rise {
  from {
    height: 0;
  }

  to {
    height: 100%;
  }
}

@keyframes widen {
  from {
    width: 0;
  }

  to {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .summary-card {
    border-radius: 22px;
    padding: 20px;
  }

  .chart-head,
  .table-head,
  .summary-item,
  .category-row {
    align-items: flex-start;
    flex-direction: column;
  }

  .chart-grid {
    gap: 10px;
    grid-template-columns: repeat(auto-fit, minmax(72px, 1fr));
  }

  .category-row {
    display: flex;
  }

  .category-title-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }
}
</style>
