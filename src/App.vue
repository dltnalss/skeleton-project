<template>
  <!--
    ■ App.vue = 앱 전체의 껍데기 (뼈대)
    
    구조:
    ┌──────────────────┐
    │   router-view    │ ← URL에 따라 Home/Transaction/Summary 등이 여기에 표시됨
    │   (페이지 영역)    │
    │                  │
    ├──────────────────┤
    │   Header.vue     │ ← 하단 네비게이션 바 (고정)
    └──────────────────┘
  -->
  <div>
    <!-- 
      router-view: Vue Router가 URL을 보고, 맞는 페이지 컴포넌트를 여기에 넣어줌
      예) URL이 "/" 이면 → Home.vue가 여기에 표시
      예) URL이 "/transaction" 이면 → Transaction.vue가 여기에 표시
    -->
    <router-view></router-view>

    <!-- 하단 네비게이션 바 (항상 표시) -->
    <Header />
  </div>
</template>

<script setup>
<script>
// Header.vue 파일을 가져와서 이 파일 안에서 사용하겠다는 뜻
import Header from './components/Header.vue';

export default {
  name: 'App',
  // components: 이 파일 안에서 쓸 컴포넌트 목록을 등록
  // Header를 등록해야 위 template에서 <Header /> 태그를 쓸 수 있음
  components: { Header },
};
</script>
