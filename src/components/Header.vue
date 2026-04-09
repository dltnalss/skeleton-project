<template>
  <div
    class="app-header bg-dark ps-3 d-flex align-items-center"
    style="height: 50px"
  >
    많관부
  </div>

  <!-- <button id="plusButton">
    <router-link to="/addList">+</router-link>
  </button> -->

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
            aria-hidden="true"
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
          to="/transaction"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            viewBox="0 0 16 16"
            aria-hidden="true"
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
            aria-hidden="true"
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

<script>
import router from '@/router';
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
