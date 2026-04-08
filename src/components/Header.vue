<template>
  <!--
    ■ 하단 네비게이션 바
    - position: fixed + bottom: 0 → 화면 맨 아래 고정
    - 3개 메뉴: 홈, 거래내역, 통계
    - 가운데 + 버튼: 거래등록 페이지로 이동
  -->
  <nav class="navbar fixed-bottom bg-white border-top">
    <div class="container-fluid d-flex justify-content-around align-items-center py-1">

      <!-- 1) 홈 버튼 -->
      <router-link to="/" class="text-center text-decoration-none text-dark">
        <i class="bi bi-house-door" style="font-size: 1.3rem;"></i>
        <div style="font-size: 0.7rem;">홈</div>
      </router-link>

      <!-- 2) + 거래등록 버튼 (가운데, 동그란 버튼) -->
      <router-link to="/addList" class="text-decoration-none">
        <div class="rounded-circle d-flex align-items-center justify-content-center"
             style="width: 48px; height: 48px; background-color: #FFBC00;">
          <i class="bi bi-plus-lg text-dark" style="font-size: 1.4rem;"></i>
        </div>
      </router-link>

      <!-- 3) 거래내역 버튼 -->
      <router-link to="/transaction" class="text-center text-decoration-none text-dark">
        <i class="bi bi-list-ul" style="font-size: 1.3rem;"></i>
        <div style="font-size: 0.7rem;">거래내역</div>
      </router-link>

      <!-- 4) 통계 버튼 -->
      <router-link to="/summary" class="text-center text-decoration-none text-dark">
        <i class="bi bi-bar-chart" style="font-size: 1.3rem;"></i>
        <div style="font-size: 0.7rem;">통계</div>
      </router-link>

    </div>
  </nav>
</template>

<!--
  ■ 각 부분 설명:
  
  <nav>          → HTML의 네비게이션 영역 태그
  class="navbar" → Bootstrap이 제공하는 네비바 스타일
  class="fixed-bottom" → 화면 맨 아래 고정
  class="bg-white"     → 배경색 흰색
  class="border-top"   → 위쪽에 얇은 선
  
  <div class="container-fluid"> → 가로 전체를 채우는 컨테이너
  class="d-flex"                → 안에 있는 것들을 가로로 나열 (display: flex)
  class="justify-content-around" → 균등하게 간격 배치
  class="align-items-center"    → 세로 중앙 정렬
  
  <router-link to="/"> → Vue Router가 제공하는 링크. 클릭하면 해당 URL로 이동
                          일반 <a> 태그와 다르게 페이지 새로고침 없이 이동
  
  <i class="bi bi-house-door"> → Bootstrap Icons 아이콘
                                  bi = bootstrap icon
                                  bi-house-door = 집 모양 아이콘
  
  class="rounded-circle" → 동그랗게 만드는 Bootstrap 클래스
  class="text-decoration-none" → 밑줄 제거
  class="text-dark"     → 글자색 검정
  class="text-center"   → 글자 가운데 정렬
-->
