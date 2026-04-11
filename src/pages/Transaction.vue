<template>
  <div class="card card-body">
    <h2>가계부 내역</h2>
    <div class="transaction-container">
      <TransactionHeader />
      <router-view />
    </div>
  </div>

  <!-- 플러스 버튼 -->
  <router-link id="plusButton" to="/addList">
    <span class="plus-icon">+</span>
  </router-link>
</template>

<script setup>
import TransactionHeader from '@/components/TransactionHeader.vue';
</script>

<style scoped>
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
.transaction-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 1rem;
  background: #e8e6f8;
  min-height: 60vh;
  border-radius: 10px;
  margin-bottom: 60px;
}
</style>
