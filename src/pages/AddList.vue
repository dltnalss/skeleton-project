<template>
  <div class="card card-body">
    <h2>AddList</h2>
    {{ states.budgetList }}
  </div>
</template>

<script setup>
import { reactive } from 'vue';
// import Header from '@/components/Header.vue';
import axios from 'axios';

const BASEURI = '/api/budget';

//지출 목록 조회
const fetchList = async ()=>{
    try{
        const response = await axios.get(BASEURI);
        if(response)
    }
}





// 예산 추가하는 add
// const states = reactive({ budgetList: [] });

// const addList = async ({ date, type, amount, category }) => {
//   try {
//     console.log(date + '/' + type + '/' + amount + '/' + category);
//     const payload = { date, type, amount, category };
//     const response = await axios.post(BASEURI, payload);
//     console.log(response);
//     if (response.status === 201) {
//       states.budgetList.push({ ...response.data });
//     } else {
//       alert('Budget 추가 실패');
//     }
//   } catch (e) {
//     console.log(e);
//     alert('에러발생 :' + e);
//   }
// };



// const d = {
//   date: '2026-04-03',
//   type: 'income',
//   amount: '20000',
//   category: '21',
// };

// // addList(d)
addList({
  date: '2026-04-03',
  type: 'income',
  amount: '20000',
  category: '21',
});
</script>

<style></style>
