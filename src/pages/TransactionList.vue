<template>
  <div class="card card-body">
    <table>
<<<<<<< HEAD
    <thead>
      <tr>
        <th>날짜</th>
        <th>내역</th>
        <th>금액</th>
      </tr>
    </thead>
<tbody>
      <tr v-for="List in states.MyList" :key="List.id">
        <td>{{ List.date }}</td>
        <td>{{ List.memo }}</td>
        <td :class="List.type === 'expense' ? 'text-danger' : 'text-primary'">
          {{ List.type === 'expense' ? '-' : '+' }}
          {{ List.amount.toLocaleString() }}원
        </td>
      </tr>
=======
      <thead>
        <tr>
          <th>날짜</th>
          <th>내역</th>
          <th>금액</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="List in states.MyList" :key="List.id">
          <td>{{ List.date }}</td>
          <td>{{ List.memo }}</td>
          <td :class="List.type === 'expense' ? 'text-danger' : 'text-primary'">
            {{ List.type === 'expense' ? '-' : '+' }}
            {{ List.amount.toLocaleString() }}원
          </td>
        </tr>
>>>>>>> 724220a2b6776b77d349e3c5b45aa23afecf2f1f
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { reactive, watch } from 'vue';
import axios from 'axios';

const BASEURI = '/api/budget';
const route = useRoute();
const states = reactive({ MyList: [] });

const fetchMyList = async () => {
  try {
    const queryParams = {};

    if (route.name !== 'all') {
      queryParams.type = route.name;
    }
    const response = await axios.get(BASEURI, { params: queryParams });

    if (response.status == 200) {
      states.MyList = response.data;
    }
  } catch (e) {
    console.error('데이터 로드 실패:', e);
    states.MyList = [];
  }
};
fetchMyList();
watch(() => route.name, fetchMyList);

// budget 목록 조회
// const fetchMyList = async () => {
//   try {
//     const response = await axios.get(BASEURI);
//     console.log(response);
//     if (response.status == 200) {
//       states.MyList = response.data;
//     } else {
//       console.log('조회 실패');
//       alert('데이터 조회 실패');
//     }
//   } catch (e) {
//     console.log('에러');
//     alert('에러발생 :' + e);
//   }
// };
// fetchMyList();
</script>

<style></style>
