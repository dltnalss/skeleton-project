<template>
  <div class="card card-body">
    <table>
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
          <td class="text-center">
            <div class="d-flex justify-content-center gap-1">
              <button class="btn btn-outline-primary">편집</button>
              <button class="btn btn-outline-primary" @click="deleteList(List)">
                삭제
              </button>
            </div>
          </td>
        </tr>
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
const deleteList = async (List) => {
  if (!confirm('정말 이 내역을 삭제하시겠습니까 ?')) return;
  try {
    const response = await axios.delete(`${BASEURI}/${List.id}`);

    //나중에 URL 부분 수정
    if (response.status == 200) {
      let index = states.MyList.findIndex((b) => b.id === List.id);
      if (index !== -1) {
        states.MyList.splice(index, 1);
      }
    } else {
      alert('Todo 삭제 실패');
    }
  } catch (e) {
    alert('에러발생 : ' + e);
  }
};
// const editList = async ({}) => {
//   if (!confirm('정말 이 내역을 삭제하시겠습니까 ?')) return;
//   try {
//     const response = await axios.delete(`${BASEURI}/${List.id}`);

//     //나중에 URL 부분 수정
//     if (response.status == 200) {
//       let index = states.MyList.findIndex((b) => b.id === List.id);
//       if (index !== -1) {
//         states.MyList.splice(index, 1);
//       }
//     } else {
//       alert('Todo 삭제 실패');
//     }
//   } catch (e) {
//     alert('에러발생 : ' + e);
//   }
// };
// watch(() => route.name, fetchMyList);

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
