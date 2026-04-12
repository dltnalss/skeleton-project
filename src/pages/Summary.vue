<template>
  <section
    class="summary-page"
    :class="{ 'summary-page--entering': isEntering }"
  >
    <div class="ai-intro" aria-hidden="true">
      <div class="ai-intro__wash" />
      <div class="ai-intro__orb ai-intro__orb--violet" />
      <div class="ai-intro__orb ai-intro__orb--cyan" />
      <div class="ai-intro__orb ai-intro__orb--gold" />
      <div class="ai-intro__grid" />
    </div>

    <div class="summary-card">
      <p class="eyebrow">AI Summary</p>
      <h2 class="title">월별 수입/지출 추이</h2>
      <p class="description">
        월별 수입, 지출, 순합계를 한 번에 확인하고 선택한 달의 카테고리별 지출
        비중까지 함께 볼 수 있어요.
      </p>

      <div v-if="loading" class="status-box">데이터를 불러오는 중입니다.</div>
      <div v-else-if="error" class="status-box error">{{ error }}</div>

      <template v-else>
        <div v-if="monthlySummary.length" class="chart-card">
          <div class="chart-head">
            <div>
              <p class="chart-label">전체 지출 합계</p>
              <strong class="chart-value">{{
                formatCurrency(totalExpense)
              }}</strong>
            </div>
            <p class="chart-subtext">{{ monthlyRangeText }}</p>
          </div>

          <div class="line-chart-card" aria-label="Monthly summary chart">
            <div class="chart-legend">
              <span
                v-for="series in chartSeriesMeta"
                :key="series.key"
                class="legend-item"
              >
                <span class="legend-swatch" :class="series.className" />
                {{ series.label }}
              </span>
            </div>

            <svg
              class="line-chart"
              viewBox="0 0 360 240"
              role="img"
              aria-hidden="true"
              preserveAspectRatio="none"
            >
              <line
                v-for="guide in chartGuides"
                :key="guide.y"
                class="chart-guide"
                x1="24"
                :y1="guide.y"
                x2="336"
                :y2="guide.y"
              />

              <g v-for="series in lineChartSeries" :key="series.key">
                <polyline
                  class="chart-line"
                  :class="series.className"
                  :points="series.points"
                />
                <circle
                  v-for="point in series.pointList"
                  :key="`${series.key}-${point.month}`"
                  class="chart-point"
                  :class="series.className"
                  :cx="point.x"
                  :cy="point.y"
                  r="4.5"
                />
              </g>
            </svg>

            <div class="line-chart-labels">
              <div
                v-for="item in monthlySummary"
                :key="`${item.month}-label`"
                class="line-chart-item"
              >
                <span class="line-month">{{ item.label }}</span>
                <span class="line-value income"
                  >수입 {{ formatCurrency(item.income) }}</span
                >
                <span class="line-value expense"
                  >지출 {{ formatCurrency(item.expense) }}</span
                >
                <span class="line-value total"
                  >순합계 {{ formatCurrency(item.total) }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <div v-if="monthlySummary.length" class="chart-card secondary-card">
          <div class="chart-head">
            <div>
              <p class="chart-label">카테고리별 지출 비중</p>
              <strong class="chart-value">{{ selectedMonthDisplay }}</strong>
            </div>
            <p class="chart-subtext">
              선택한 달 총 지출 {{ formatCurrency(selectedMonthExpenseTotal) }}
            </p>
          </div>

          <div
            class="month-selector"
            aria-label="Select month for category chart"
          >
            <button
              v-for="item in monthlySummary"
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
            aria-label="Selected month category expense chart"
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
              <strong class="category-amount">{{
                formatCurrency(item.amount)
              }}</strong>
            </article>
          </div>

          <div v-else class="status-box inner-status">
            선택한 달의 카테고리별 지출 데이터가 없습니다.
          </div>
        </div>

        <div v-else class="status-box">표시할 월별 데이터가 없습니다.</div>
      </template>
    </div>
  </section>
  <br />
  <br />
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import axios from 'axios';

const budget = ref([]);
const expenseCategories = ref([]);
const selectedMonth = ref('');
const loading = ref(true);
const error = ref('');
const isEntering = ref(true);

let introTimer;

const formatCurrency = (value) =>
  new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(value);

const formatMonthLabel = (month) => {
  if (!month) {
    return '-';
  }

  const [, monthValue] = month.split('-');
  return `${Number(monthValue)}월`;
};

const formatMonthDisplay = (month) => {
  if (!month) {
    return '-';
  }

  const [year, monthValue] = month.split('-');
  return `${year}년 ${Number(monthValue)}월`;
};

onMounted(async () => {
  introTimer = window.setTimeout(() => {
    isEntering.value = false;
  }, 2200);

  try {
    const [budgetResponse, categoryResponse] = await Promise.all([
      axios.get('http://localhost:3000/budget'),
      axios.get('http://localhost:3000/expenseCategory'),
    ]);

    budget.value = Array.isArray(budgetResponse.data)
      ? budgetResponse.data
      : [];
    expenseCategories.value = Array.isArray(categoryResponse.data)
      ? categoryResponse.data
      : [];
  } catch (err) {
    error.value =
      '데이터를 불러오지 못했습니다. json-server 실행 상태를 확인해 주세요.';
    console.error(err);
  } finally {
    loading.value = false;
  }
});

onBeforeUnmount(() => {
  if (introTimer) {
    window.clearTimeout(introTimer);
  }
});

const monthlySummary = computed(() => {
  const grouped = budget.value.reduce((acc, item) => {
    if (!item.date) {
      return acc;
    }

    const month = item.date.slice(0, 7);
    const currentMonth = acc[month] || { income: 0, expense: 0 };

    if (item.type === 'income') {
      currentMonth.income += Number(item.amount || 0);
    }

    if (item.type === 'expense') {
      currentMonth.expense += Number(item.amount || 0);
    }

    acc[month] = currentMonth;
    return acc;
  }, {});

  return Object.entries(grouped)
    .sort(([monthA], [monthB]) => monthA.localeCompare(monthB))
    .map(([month, amounts]) => ({
      month,
      income: amounts.income,
      expense: amounts.expense,
      total: amounts.income - amounts.expense,
      label: formatMonthLabel(month),
      fullLabel: formatMonthDisplay(month),
    }));
});

const chartGuides = computed(() => [56, 108, 160, 212].map((y) => ({ y })));

const chartSeriesMeta = [
  { key: 'income', label: '수입', className: 'income' },
  { key: 'expense', label: '지출', className: 'expense' },
  { key: 'total', label: '순합계', className: 'total' },
];

const lineChartData = computed(() => {
  const items = monthlySummary.value;

  if (!items.length) {
    return [];
  }

  const chartWidth = 312;
  const chartHeight = 156;
  const left = 24;
  const top = 36;
  const bottom = top + chartHeight;
  const maxValue = Math.max(
    ...items.flatMap((item) => [item.income, item.expense, item.total]),
    0,
  );
  const stepX = items.length === 1 ? 0 : chartWidth / (items.length - 1);

  return items.map((item, index) => ({
    ...item,
    x: left + stepX * index,
    points: {
      income: maxValue
        ? bottom - (item.income / maxValue) * chartHeight
        : bottom,
      expense: maxValue
        ? bottom - (item.expense / maxValue) * chartHeight
        : bottom,
      total: maxValue ? bottom - (item.total / maxValue) * chartHeight : bottom,
    },
  }));
});

const lineChartSeries = computed(() =>
  chartSeriesMeta.map((series) => ({
    ...series,
    points: lineChartData.value
      .map((point) => `${point.x},${point.points[series.key]}`)
      .join(' '),
    pointList: lineChartData.value.map((point) => ({
      month: point.month,
      x: point.x,
      y: point.points[series.key],
    })),
  })),
);

watch(
  monthlySummary,
  (months) => {
    if (!months.length) {
      selectedMonth.value = '';
      return;
    }

    const hasSelectedMonth = months.some(
      (item) => item.month === selectedMonth.value,
    );

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

  return formatMonthDisplay(selectedMonth.value);
});

const totalExpense = computed(() =>
  monthlySummary.value.reduce((sum, item) => sum + item.expense, 0),
);

const monthlyRangeText = computed(() => {
  if (!monthlySummary.value.length) {
    return '';
  }

  const firstMonth = monthlySummary.value[0];
  const lastMonth = monthlySummary.value[monthlySummary.value.length - 1];

  if (firstMonth.month === lastMonth.month) {
    return `${firstMonth.fullLabel} 지출 합계`;
  }

  return `${firstMonth.fullLabel} ~ ${lastMonth.fullLabel} (${monthlySummary.value.length}개월)`;
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

  const totalAmount = entries.reduce((sum, item) => sum + item.amount, 0);

  return entries
    .sort((a, b) => b.amount - a.amount)
    .map((item) => ({
      ...item,
      percent: totalAmount ? Math.round((item.amount / totalAmount) * 100) : 0,
      ratio: totalAmount ? Math.round((item.amount / totalAmount) * 100) : 0,
    }));
});

const selectedMonthExpenseTotal = computed(() =>
  categoryExpenseTrend.value.reduce((sum, item) => sum + item.amount, 0),
);
</script>

<style scoped>
.summary-page {
  background:
    radial-gradient(
      circle at top right,
      rgba(234, 179, 8, 0.18),
      transparent 24%
    ),
    linear-gradient(
      160deg,
      rgba(255, 253, 247, 0.98) 0%,
      rgba(244, 239, 228, 0.98) 100%
    );
  box-sizing: border-box;
  margin: 0 auto;
  max-width: 460px;
  min-height: calc(100vh - 84px);
  padding: 18px 0 40px;
  position: relative;
  width: 100%;
}

.ai-intro {
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  position: fixed;
  z-index: 20;
}

.summary-page:not(.summary-page--entering) .ai-intro {
  opacity: 0;
  transition: opacity 0.7s ease;
}

.ai-intro__wash,
.ai-intro__orb,
.ai-intro__grid {
  position: absolute;
}

.ai-intro__wash {
  animation: prism-fade 2.1s ease forwards;
  background: linear-gradient(
    120deg,
    rgba(93, 76, 229, 0.36),
    rgba(66, 192, 255, 0.34) 28%,
    rgba(255, 184, 77, 0.3) 52%,
    rgba(255, 112, 166, 0.3) 76%,
    rgba(93, 76, 229, 0.34)
  );
  inset: -12%;
  mix-blend-mode: screen;
  transform: translateX(-8%) scale(1.08);
}

.ai-intro__orb {
  animation: orb-float 2.2s ease forwards;
  border-radius: 999px;
  filter: blur(18px);
  opacity: 0.85;
}

.ai-intro__orb--violet {
  background: radial-gradient(
    circle,
    rgba(116, 92, 255, 0.68),
    transparent 68%
  );
  height: 320px;
  right: -48px;
  top: 8%;
  width: 320px;
}

.ai-intro__orb--cyan {
  background: radial-gradient(
    circle,
    rgba(72, 206, 255, 0.56),
    transparent 68%
  );
  height: 280px;
  left: -72px;
  top: 24%;
  width: 280px;
}

.ai-intro__orb--gold {
  background: radial-gradient(
    circle,
    rgba(255, 196, 87, 0.46),
    transparent 70%
  );
  bottom: 10%;
  height: 260px;
  left: 24%;
  width: 260px;
}

.ai-intro__grid {
  animation: grid-fade 2.05s ease forwards;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.16) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.16) 1px, transparent 1px);
  background-position: center;
  background-size: 36px 36px;
  inset: 0;
  mask-image: radial-gradient(circle at center, black 28%, transparent 80%);
  opacity: 0.55;
}

.summary-card {
  animation: card-settle 1.35s cubic-bezier(0.2, 0.9, 0.2, 1) both;
  background: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
  box-sizing: border-box;
  overflow: hidden;
  padding: 0 18px 24px;
  position: relative;
  width: 100%;
  z-index: 1;
}

.summary-page--entering .summary-card::before {
  animation: card-prism 1.8s ease-out forwards;
  background: linear-gradient(
    110deg,
    transparent 10%,
    rgba(255, 255, 255, 0.26) 24%,
    rgba(120, 196, 255, 0.28) 35%,
    rgba(151, 120, 255, 0.24) 48%,
    rgba(255, 193, 89, 0.24) 62%,
    transparent 82%
  );
  content: '';
  inset: 0;
  pointer-events: none;
  position: absolute;
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
.status-box {
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(140, 106, 54, 0.12);
  border-radius: 22px;
  margin-top: 22px;
  padding: 18px;
}

.secondary-card {
  background: linear-gradient(
    180deg,
    rgba(255, 253, 247, 0.96),
    rgba(253, 247, 234, 0.94)
  );
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

.chart-head {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

.chart-label,
.chart-subtext {
  margin: 0;
}

.chart-label {
  color: #8a7354;
  font-size: 0.82rem;
}

.chart-value {
  color: #2f2416;
  font-size: 1.2rem;
}

.chart-subtext {
  color: #6f5d46;
  font-size: 0.9rem;
}

.line-chart-card {
  margin-top: 22px;
}

.chart-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  margin-bottom: 12px;
}

.legend-item {
  align-items: center;
  color: #6f5d46;
  display: inline-flex;
  font-size: 0.82rem;
  font-weight: 700;
  gap: 8px;
}

.legend-swatch {
  border-radius: 999px;
  display: inline-block;
  height: 10px;
  width: 24px;
}

.legend-swatch.income {
  background: #2f9e8f;
}

.legend-swatch.expense {
  background: #d2672a;
}

.legend-swatch.total {
  background: #7058d8;
}

.line-chart {
  display: block;
  height: 240px;
  overflow: visible;
  width: 100%;
}

.chart-guide {
  stroke: rgba(154, 107, 0, 0.12);
  stroke-dasharray: 4 6;
  stroke-width: 1;
}

.chart-line {
  animation: rise 0.7s ease;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 4;
}

.chart-line.income {
  stroke: #2f9e8f;
}

.chart-line.expense {
  stroke: #d2672a;
}

.chart-line.total {
  stroke: #7058d8;
}

.chart-point {
  fill: #fff7e3;
  stroke-width: 3;
}

.chart-point.income {
  stroke: #2f9e8f;
}

.chart-point.expense {
  stroke: #d2672a;
}

.chart-point.total {
  stroke: #7058d8;
}

.line-chart-labels {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(72px, 1fr));
  margin-top: 8px;
}

.line-chart-item {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: center;
}

.line-value,
.line-month {
  color: #5f4c36;
  font-size: 0.82rem;
}

.line-value.income {
  color: #1f7f73;
}

.line-value.expense {
  color: #b4511b;
}

.line-value.total {
  color: #5b46bc;
  font-weight: 700;
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
  width: 100%;
}

.category-title-row {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
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

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
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

@keyframes prism-fade {
  0% {
    opacity: 0;
    transform: translateX(-8%) scale(1.08);
  }

  18% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateX(8%) scale(1.02);
  }
}

@keyframes orb-float {
  0% {
    opacity: 0;
    transform: scale(0.78) translateY(18px);
  }

  22% {
    opacity: 0.9;
  }

  100% {
    opacity: 0;
    transform: scale(1.08) translateY(-22px);
  }
}

@keyframes grid-fade {
  0% {
    opacity: 0;
    transform: scale(1.06);
  }

  24% {
    opacity: 0.55;
  }

  100% {
    opacity: 0;
    transform: scale(1);
  }
}

@keyframes card-settle {
  0% {
    opacity: 0;
    transform: translateY(26px) scale(0.985);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes card-prism {
  0% {
    opacity: 0;
    transform: translateX(-38%);
  }

  25% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateX(38%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ai-intro,
  .summary-card::before,
  .summary-card,
  .chart-line,
  .category-fill {
    animation: none !important;
    transition: none !important;
  }

  .summary-page--entering .ai-intro {
    opacity: 0;
  }
}

@media (max-width: 480px) {
  .summary-page {
    padding-left: 0;
    padding-right: 0;
    padding-top: 14px;
  }

  .summary-card {
    padding: 0 12px 20px;
  }

  .chart-head,
  .category-row {
    align-items: flex-start;
    flex-direction: column;
  }

  .line-chart {
    height: 220px;
  }

  .line-chart-labels {
    gap: 10px;
    grid-template-columns: repeat(auto-fit, minmax(64px, 1fr));
  }

  .category-row {
    display: flex;
    gap: 10px;
  }

  .category-title-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }

  .category-chart {
    gap: 12px;
  }

  .category-amount {
    align-self: flex-end;
    font-size: 0.9rem;
  }

  .category-bar {
    height: 16px;
  }

  .category-fill {
    min-width: 0;
  }
}
</style>
