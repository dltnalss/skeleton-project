<template>
  <div class="card card-body">
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

  <!-- 플러스 버튼 -->
  <router-link id="plusButton" to="/addList">
    <span class="plus-icon">+</span>
  </router-link>
</template>

<script setup>
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
</style>
