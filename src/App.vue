<template>
  <!-- 모바일 화면에서의 짤림 때문에 container를 app-shell로 변경함 -->
  <div class="app-shell">
    <Header />
    <!-- <router-view /> -->
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
</script>

<style scoped>
.app-shell {
  width: 100%;
}
</style>
