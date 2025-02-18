<template>
  <div class="side-menu">
    <!-- ✅ 반려동물 용품 (항상 보이는 메뉴) -->
    <div class="menu-group">
      <div class="menu-title" @click="goToProduct">반려동물 용품</div>
    </div>

    <!-- ✅ 로그인한 경우에만 보이는 메뉴 -->
    <div v-if="isLoggedIn">
      <!-- 🔹 반려동물 관리 -->
      <div class="menu-group">
        <div class="menu-title" @click="toggleMenu('petManagement')">
          반려동물 관리
          <span class="dropdown-arrow" :class="{ 'rotated': openMenus.petManagement }">▶</span>
        </div>
        <div class="submenu" v-show="openMenus.petManagement">
          <router-link to="/myPetProfile" class="submenu-item">반려동물 조회</router-link>
          <router-link to="/petProfileRegister" class="submenu-item">반려동물 등록</router-link>
        </div>
      </div>

      <!-- 🔹 펫시터 서비스 -->
      <div class="menu-group">
        <div class="menu-title" @click="toggleMenu('petSitter')">
          펫시터 서비스
          <span class="dropdown-arrow" :class="{ 'rotated': openMenus.petSitter }">▶</span>
        </div>
        <div class="submenu" v-show="openMenus.petSitter">
          <router-link to="/home/petsitter/list" class="submenu-item">펫시터 조회</router-link>
          <router-link to="/home/petsitter/register" class="submenu-item">펫시터 등록</router-link>
          <router-link to="/home/payment" class="submenu-item">결제내역조회</router-link>
        </div>
      </div>

      <!-- 🔹 코드 관리 -->

      <div class="menu-group">
        <div class="menu-title" @click="goToManagement">코드 관리</div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

const router = useRouter();
const userStore = useUserStore(); // ✅ 사용자 상태 접근

const openMenus = ref({
  petManagement: false,
  petSitter: false
});

const toggleMenu = (menuName) => {
  openMenus.value[menuName] = !openMenus.value[menuName];
};

// ✅ 로그인 상태 확인 (userId가 존재하는지 체크)
const isLoggedIn = computed(() => !!userStore.userId);

// 반려동물 용품 페이지로 이동
const goToProduct = () => {
  router.push('/home/products');
};

const goToManagement = () => {
  router.push('/home/codeManagement');
};


</script>





<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nanum+Square+Round:wght@400;700&display=swap');

:root {
  --color-primary: #f4acb7;
  --color-secondary: #9d8189;
  --color-accent1: #ffcad4;
  --color-accent2: #ffe5d9;
  --color-accent3: #d8e2dc;
}

/* 📌 사이드 메뉴 */
.side-menu {
  width: 250px;
  background-color: white;
  padding: 20px;
  border-right: 1px solid #E5E5E5;
}

/* 📌 메뉴 그룹 */
.menu-group {
  margin-bottom: 15px;
}

/* 📌 메뉴 타이틀 */
.menu-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
  padding: 14px;
  font-weight: 700;
  color: var(--color-secondary);
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s;
  font-size: 16px; /* 기존보다 글자 크기 살짝 증가 */
}

.menu-title:hover {
  background-color: var(--color-accent2);
}

/* 📌 드롭다운 화살표 기본 모양 '▶' → 클릭 시 '▼'로 회전 */
.dropdown-arrow {
  font-size: 14px;
  transition: transform 0.3s ease;
  display: inline-block;
}

/* 📌 '▶' → '▼'로 회전 */
.dropdown-arrow.rotated {
  transform: rotate(90deg);
}

/* 📌 서브메뉴 */
.submenu {
  padding-left: 20px;
}

/* 📌 서브메뉴 항목 */
.submenu-item {
  display: block;
  padding: 10px;
  color: var(--color-secondary);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.submenu-item:hover {
  color: var(--color-primary);
}
</style>
