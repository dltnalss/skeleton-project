<template>
  <div
    class="bg-dark text-white ps-3 d-flex align-items-center"
    style="height: 50px"
  >
    많관부
  </div>

  <!-- <button id="plusButton">
    <router-link to="/addList">+</router-link>
  </button> -->

  <nav class="navbar bg-dark navbar-dark fixed-bottom">
    <ul
      class="navbar-nav d-flex flex-row w-100 justify-content-around text-center"
    >
      <li class="nav-item flex-fill">
        <router-link
          class="nav-link d-flex align-items-center justify-content-center gap-1"
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
        </router-link>
      </li>

      <li class="nav-item flex-fill">
        <router-link
          class="nav-link d-flex align-items-center justify-content-center gap-1"
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
        </router-link>
      </li>

      <li class="nav-item flex-fill">
        <router-link
          class="nav-link d-flex align-items-center justify-content-center gap-1"
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
              d="M0 0h1v15h15v1H0V0zm2 10h2v4H2v-4zm4-3h2v7H6V7zm4-4h2v11h-2V3zm4 6h2v5h-2V9z"
            />
          </svg>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import router from '@/router';
</script>
<style scoped>
#plusButton,
#plusButton:visited,
#plusButton:hover,
#plusButton:active,
#plusButton:focus {
  border-radius: 50%;
  background-color: rgb(190, 190, 255);
  color: white;
  width: 50px;
  height: 50px;
  border: none;
  font-size: 30px;
  text-decoration: none !important;

  position: fixed;
  right: 20px;
  bottom: 80px;

  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
