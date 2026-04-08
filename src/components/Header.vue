<template>
  <nav class="navbar navbar-expand-md bg-dark navbar-dark mt-2">
    <span class="navbar-brand">이날치(LeeNalChi)</span>

    <!-- 햄버거 버튼 -->
    <button class="navbar-toggler" type="button" @click="changeIsNavShow">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div :class="navClass">
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link class="nav-link" to="/">홈</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/addList">거래내역 추가</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/summary">리포트</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/transaction">거래내역</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script></script>
<style></style>
