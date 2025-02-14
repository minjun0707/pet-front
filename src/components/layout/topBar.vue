<template>
  <div class="top-bar">
    <div class="top-bar-container">
      <router-link to="/home" class="logo">멍뭉스토어</router-link>
      <div class="user-menu">
        <router-link to="/login" class="menu-item">로그인</router-link>
        <router-link to="/signup" class="menu-item">회원가입</router-link>
        <div class="profile-circle">
          <!-- <img src="@/assets/default-profile.png" alt="프로필" /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 필요한 로직 추가 가능
</script>

<style scoped>
/* 📌 TopBar 전체 배경 */
.top-bar {
  width: 117%;
  background-color: white;
  border-bottom: 1px solid #E5E5E5;
  display: flex;
  justify-content: center; /* 가운데 정렬 */
}

/* 📌 TopBar 내부 컨테이너 (MainLayout과 같은 크기) */
.top-bar-container {
  width: 117%;
  max-width: 1200px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 📌 로고 (왼쪽 정렬, 왼쪽에서 30px 떨어지도록 설정) */
.logo {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
  text-decoration: none;
  cursor: pointer;
  margin-left: -70px; /* 왼쪽에서 30px 떨어지도록 설정 */
}

/* 📌 사용자 메뉴 (오른쪽 정렬, 오른쪽에서 50px 떨어지도록 설정) */
.user-menu {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-right: -50px; /* 오른쪽에서 50px 떨어지도록 설정 */
}

/* 📌 네비게이션 메뉴 아이템 */
.menu-item {
  text-decoration: none;
  color: var(--color-secondary);
  font-weight: 500;
}

/* 📌 프로필 이미지 */
.profile-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--color-primary);
}

/* 📌 반응형 지원 */
@media (max-width: 768px) {
  .top-bar-container {
    padding: 0 10px; /* 작은 화면에서는 패딩 줄이기 */
  }
  .logo {
    margin-left: 15px; /* 모바일에서는 좌측 여백 줄이기 */
  }
  .user-menu {
    margin-right: 20px; /* 모바일에서는 우측 여백 줄이기 */
  }
}
</style>
