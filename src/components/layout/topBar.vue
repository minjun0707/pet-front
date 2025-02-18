<template>
  <div class="top-bar">
    <div class="top-bar-container">
      <router-link to="/home" class="logo">멍뭉스토어</router-link>
      <div class="user-menu">
        <!-- ✅ 로그인되지 않은 경우 -->
        <template v-if="!isLoggedIn">
          <router-link to="/login" class="menu-item">로그인</router-link>
          <router-link to="/signup" class="menu-item">회원가입</router-link>
        </template>

        <!-- ✅ 로그인된 경우 -->
        <template v-else>
          <button @click="logout" class="menu-item logout-button">로그아웃</button>
        </template>

        <!-- ✅ 프로필 아이콘 (클릭 시 editProfileScreen 이동) -->
        <div class="profile-circle" @click="goToProfileEdit">
          <img :src="profileImage" alt="프로필 이미지">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

const router = useRouter();
const userStore = useUserStore();

// ✅ 로그인 상태 확인 (Pinia의 상태값 활용)
const isLoggedIn = computed(() => !!userStore.userId);

// ✅ 프로필 이미지 URL (디폴트 이미지 적용)
const profileImage = computed(() => userStore.profileImage || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png');

// ✅ 로그아웃 기능
const logout = () => {
  userStore.logout(); // ✅ Pinia에서 유저 정보 초기화
  window.location.reload(); // ✅ 새로고침하여 UI 반영
};

// ✅ 프로필 편집 페이지 이동
const goToProfileEdit = () => {
  router.push('/editProfileScreen');
};
</script>

<style scoped>
/* 📌 TopBar 전체 배경 */
.top-bar {
  width: 100%;
  background-color: white;
  border-bottom: 1px solid #E5E5E5;
  display: flex;
  justify-content: center; /* 가운데 정렬 */
}

/* 📌 TopBar 내부 컨테이너 */
.top-bar-container {
  width: 100%;
  max-width: 1200px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 📌 로고 */
.logo {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
  text-decoration: none;
  cursor: pointer;
  margin-left: 30px;
}

/* 📌 사용자 메뉴 */
.user-menu {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-right: 30px;
}

/* 📌 네비게이션 메뉴 아이템 */
.menu-item {
  text-decoration: none;
  color: var(--color-secondary);
  font-weight: 500;
}

/* 📌 로그아웃 버튼 */
.logout-button {
  background: none;
  border: none;
  color: var(--color-secondary);
  font-weight: 500;
  cursor: pointer;
}
.logout-button:hover {
  color: var(--color-primary);
}

/* 📌 프로필 이미지 */
.profile-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.profile-circle:hover {
  transform: scale(1.1);
}

.profile-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
