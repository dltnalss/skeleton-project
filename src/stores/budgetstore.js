import { defineStore } from 'pinia';
import axios from 'axios';

const BASEURL = 'http://localhost:3000';

export const useBudgetStore = defineStore('budget', {
  state: () => ({
    budgetList: [],
    incomeCategories: [],
    expenseCategories: [],
    transactionList: [],
  }),

  actions: {
    // 수입/지출 카테고리 정보 로드
    async initData() {
      try {
        const [income, expense] = await Promise.all([
          axios.get(`${BASE_URL}/incomeCategory`),
          axios.get(`${BASE_URL}/expenseCategory`),
        ]);
        this.incomeCategories = income.data;
        this.expenseCategories = expense.data;
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      }
    },
    // 새로운 거래 데이터를 서버에 저장
    async addTransaction(payload) {
      try {
        const response = await axios.post(`${BASEURL}/budget`, payload);
        if (response.status === 201) {
          // 서버 저장 성공 시 로컬 상태에도 추가 (새로고침 없이 반영)
          this.budgetList.push(response.data);
          return true;
        }
      } catch (error) {
        console.error('추가 실패:', error);
        return false;
      }
    },
    // edit 하는 기능 axios.put 하는 중
    async EditTransaction(updateList, successCallback) {
      try {
        const { id, date, type, amount, category, memo } = updateList;
        const payload = { id, date, type, amount, category, memo };
        const response = await axios.put(BASEURL + `/${id}`, payload);
        if (response.status == 200) {
          let index = this.transactionList.findIndex(
            (budget) => budget.id === id,
          );
          if (index !== -1) {
            this.transactionList[index] = { ...payload };
          }
          if (successCallback) successCallback();
        } else {
          alert('거래 내역 변경 실패');
        }
      } catch (e) {
        alert('에러발생 :' + e);
      }
    },
  },
});
