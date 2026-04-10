import { defineStore } from 'pinia';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const useBudgetStore = defineStore('budget', {
  state: () => ({
    budgetList: [],
    incomeCategories: [],
    expenseCategories: [],
  }),
  actions: {
    // 수입/지출 카테고리 정보 로드
    async initData() {
      console.log('현재 주소:', BASE_URL);
      try {
        const API_ROOT = BASE_URL.replace('/budget', '');
        const [income, expense] = await Promise.all([
          axios.get(`${API_ROOT}/incomeCategory`),
          axios.get(`${API_ROOT}/expenseCategory`),
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
        const response = await axios.post(`${BASE_URL}/budget`, payload);
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
  },
});
