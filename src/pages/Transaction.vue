<template>
  <div class="card card-body">
    <h2>Transaction</h2>
    <TransactionHeader/>
    
    <h2>가계부 내역</h2>

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

<button id="plusButton">
    <router-link to="/addList">+</router-link>
  </button>
</template>

<script setup>
import TransactionHeader from '@/components/TransactionHeader.vue';
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

<style scoped>
#plusButton {
  border-radius: 50%;
  background-color: rgb(190, 190, 255);
  color: white;
  width: 50px;
  height: 50px;
  border: none;
  font-size: 30px;
  text-decoration: none !important;

  position: fixed;
  right: 80px;
  bottom: 100px;

  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

