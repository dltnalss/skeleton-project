<template>
  <div class="container">
    <Header />
    <router-view />
  </div>
</template>

<script setup>
// import { reactive } from 'vue';
import Header from './components/Header.vue';
// import axios from 'axios';

// const BASEURI = '/api/budget';
// // const router = useRouter();

// const states = reactive({
//   transactions: [],
// });

// const fetchTransaction = async () => {
//   try {
//     let response = await axios.get(BASEURI);
//     if (response.status === 200) {
//       console.log(response.data);
//       states.transactions = response.data;
//     } else {
//       console.log('데이터 전체 조회 실패');
//     }
//   } catch (error) {
//     console.log('예상치 못한 에러가 발생함. 에러 정보는 ' + error);
//   }
// };
</script>

<style lang="scss" scoped></style>
