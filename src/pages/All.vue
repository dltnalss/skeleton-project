<template>
  <div class="card card-body">
    <table>
      <tr>
        <th>날짜</th>
        <th>내역</th>
        <th>금액</th>
      </tr>
      <tr v-for="List in states.MyList" :key="List.id">
        <td>{{ List.date }}</td>
        <td>{{ List.memo }}</td>
        <td :class="List.type === 'expense' ? 'text-danger' : 'text-primary'">
          {{ List.type === 'expense' ? '-' : '+' }}
          {{ List.amount.toLocaleString() }}원
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { reactive } from 'vue';
import axios from 'axios';

const BASEURI = '/api/budget';
const states = reactive({ MyList: [] });

// budget 목록 조회
const fetchMyList = async () => {
  try {
    const response = await axios.get(BASEURI);
    console.log(response);
    if (response.status == 200) {
      states.MyList = response.data;
    } else {
      console.log('조회 실패');
      alert('데이터 조회 실패');
    }
  } catch (e) {
    console.log('에러');
    alert('에러발생 :' + e);
  }
};
fetchMyList();
</script>

<style></style>
