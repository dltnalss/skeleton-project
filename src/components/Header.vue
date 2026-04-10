<template>
  <!-- ■ 상단 바: 앱 이름(왼쪽) + 프로필 버튼(오른쪽) -->
  <div
    class="app-header bg-dark ps-3 pe-3 d-flex align-items-center justify-content-between"
    style="height: 50px"
  >
    <span>많관부</span>

    <!-- 프로필 원형 버튼 -->
    <div style="position: relative">
      <button
        @click="toggleDropdown"
        style="
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.4);
          background: #6c63ff;
          color: white;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >
        <i class="bi bi-person-fill"></i>
      </button>

      <!-- 드롭다운 메뉴: showDropdown이 true일 때만 표시 -->
      <div
        v-if="showDropdown"
        style="
          position: absolute;
          right: 0;
          top: 44px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          min-width: 180px;
          z-index: 1000;
          color: #333;
        "
      >
        <!-- 프로필 정보 (db.json의 profile에서 가져옴) -->
        <div style="padding: 12px; border-bottom: 1px solid #eee">
          <strong>{{ profile.name }}</strong>
          <div style="font-size: 12px; color: #888">{{ profile.email }}</div>
        </div>

        <!-- 메뉴 항목들 -->
        <div @click="goToProfile" style="padding: 10px 12px; cursor: pointer">
          프로필 수정
        </div>
        <div
          @click="toggleDarkMode"
          style="padding: 10px 12px; cursor: pointer"
        >
          다크모드: {{ isDarkMode ? 'ON' : 'OFF' }}
        </div>
        <div @click="showLanguage" style="padding: 10px 12px; cursor: pointer">
          언어
        </div>
        <div @click="showHelp" style="padding: 10px 12px; cursor: pointer">
          도움받기
        </div>
      </div>
    </div>
  </div>

  <!-- 하단 네비게이션 바 (기존 유지) -->
  <nav class="navbar app-bottom-nav bg-dark navbar-dark fixed-bottom">
    <ul
      class="navbar-nav d-flex flex-row w-100 justify-content-around text-center"
    >
      <li class="nav-item flex-fill">
        <router-link
          class="nav-link nav-label d-flex align-items-center justify-content-center gap-2"
          to="/"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z"
            />
            <path
              d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z"
            />
          </svg>
          <span>홈</span>
        </router-link>
      </li>
      <li class="nav-item flex-fill">
        <router-link
          class="nav-link nav-label d-flex align-items-center justify-content-center gap-2"
          :to="{ name: 'transaction/all' }"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M14 4.5V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4.5h12z" />
            <path d="M11.5 1a1 1 0 0 1 1 1v1.5h-9V2a1 1 0 0 1 1-1h7z" />
            <path d="M4 6h8v1H4V6zm0 2h8v1H4V8zm0 2h5v1H4v-1z" />
          </svg>
          <span>거래 내역</span>
        </router-link>
      </li>
      <li class="nav-item flex-fill">
        <router-link
          class="nav-link nav-label d-flex align-items-center justify-content-center gap-2"
          to="/summary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              d="M9.5 2.672a.5.5 0 1 0 1 0V.843a.5.5 0 0 0-1 0zm4.5.035A.5.5 0 0 0 13.293 2L12 3.293a.5.5 0 1 0 .707.707zM7.293 4A.5.5 0 1 0 8 3.293L6.707 2A.5.5 0 0 0 6 2.707zm-.621 2.5a.5.5 0 1 0 0-1H4.843a.5.5 0 1 0 0 1zm8.485 0a.5.5 0 1 0 0-1h-1.829a.5.5 0 0 0 0 1zM13.293 10A.5.5 0 1 0 14 9.293L12.707 8a.5.5 0 1 0-.707.707zM9.5 11.157a.5.5 0 0 0 1 0V9.328a.5.5 0 0 0-1 0zm1.854-5.097a.5.5 0 0 0 0-.706l-.708-.708a.5.5 0 0 0-.707 0L8.646 5.94a.5.5 0 0 0 0 .707l.708.708a.5.5 0 0 0 .707 0l1.293-1.293Zm-3 3a.5.5 0 0 0 0-.706l-.708-.708a.5.5 0 0 0-.707 0L.646 13.94a.5.5 0 0 0 0 .707l.708.708a.5.5 0 0 0 .707 0z"
            />
          </svg>
          <span>AI 요약</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// ========== 프로필 데이터 ==========
const profile = ref({ name: '', email: '' });

const fetchProfile = async () => {
  try {
    const res = await axios.get('/api/profile');
    profile.value = res.data;
  } catch (e) {
    console.error('프로필 로딩 실패:', e);
  }
};
onMounted(fetchProfile);

// ========== 드롭다운 열기/닫기 ==========
const showDropdown = ref(false);
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

// ========== 다크모드 (실제 기능 구현) ==========
const isDarkMode = ref(false);
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
};

// ========== 기타 메뉴 ==========
const goToProfile = () => {
  showDropdown.value = false;
  alert('프로필 수정 기능은 준비 중입니다.');
};
const showLanguage = () => {
  showDropdown.value = false;
  alert('현재 언어: 한국어');
};
const showHelp = () => {
  showDropdown.value = false;
  alert('도움이 필요하면 multi@kbits.com으로 문의하세요.');
};
</script>

<style scoped>
.app-header {
  color: rgba(255, 255, 255, 0.55);
  height: 50px;
  margin: 0 auto;
  max-width: 460px;
  width: 100%;
}
.app-bottom-nav {
  margin: 0 auto;
  max-width: 460px;
  width: 100%;
}
.app-bottom-nav .navbar-nav {
  min-height: 64px;
  padding: 0 8px;
}
.nav-label {
  font-size: 0.95rem;
  font-weight: 500;
  min-height: 64px;
  white-space: nowrap;
}
.nav-label svg {
  flex-shrink: 0;
}
</style>
