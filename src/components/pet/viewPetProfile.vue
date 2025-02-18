<template>
  <div class="welcome-screen">
    <div class="header-text">
      <h1 :class="{ 'show': showFirstLine }">내가 등록한 반려동물</h1>
    </div>

    <div class="profile-slider-section" v-if="petProfiles.length > 0">
      <button class="slider-button prev" @click="prevCard">&lt;</button>

      <div class="profile-section">
        <div 
          class="profile-card" 
          ref="card"
          :data-sliding="slideDirection"
          @click="goToEdit(currentProfile.id)"
          @mousemove="handleMouseMove"
          @mouseleave="handleMouseLeave"
        >
          <div class="card-content">
            <div class="image-container">
              <img :src="currentProfile.imageUrl" :alt="currentProfile.name" class="profile-image"/>
            </div>
            <div class="profile-info">
              <h2 class="pet-name">{{ currentProfile.name }}</h2>
              <p class="pet-details">{{ currentProfile.age }}살 · {{ currentProfile.type }}</p>
            </div>
          </div>
        </div>
      </div>

      <button class="slider-button next" @click="nextCard">&gt;</button>
    </div>

    <!-- 등록된 반려동물이 없는 경우 -->
    <p v-else class="no-pet-message">등록된 반려동물이 없습니다.</p>

    <div class="bottom-section">
      <button :class="{ 'show': showButton }" @click="goToNext" class="start-button">
        돌아가기
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watchEffect } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/api/axios';
import { useUserStore } from '@/stores/userStore';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const userId = computed(() => userStore.userId);

const showFirstLine = ref(false);
const showButton = ref(false);
const petProfiles = ref([]); 
const currentProfile = ref(null);
const currentIndex = ref(0);
const isSliding = ref(false);
const slideDirection = ref('');

// ✅ 반려동물 프로필 가져오기
const fetchPetProfiles = async () => {
  try {
    if (!userId.value) return;
    const response = await api.get(`/users/${userId.value}/pet-profile`);
    
    if (response.data && response.data.result && Array.isArray(response.data.result.data)) {
      petProfiles.value = response.data.result.data;
      if (petProfiles.value.length > 0) {
        currentProfile.value = petProfiles.value[0];
      }
    } else {
      console.error("올바르지 않은 API 응답 형식:", response.data);
    }
  } catch (error) {
    console.error('반려동물 프로필 불러오기 오류:', error);
    alert('반려동물 목록을 불러오는 데 실패했습니다.');
  }
};

// ✅ 카드 클릭 시 수정 페이지로 이동
const goToEdit = (petId) => {
  router.push(`/editPetProfile/${petId}`); // ✅ petId를 URL에 포함하여 이동
};

// ✅ 라우트 변경 시 자동으로 API 실행
watchEffect(() => {
  if (route.path === '/myPetProfile') {
    fetchPetProfiles();
  }
});

// ✅ 다음 카드로 이동
const nextCard = () => {
  if (isSliding.value || petProfiles.value.length === 0) return;
  isSliding.value = true;
  slideDirection.value = 'exit-right';

  setTimeout(() => {
    currentIndex.value = (currentIndex.value + 1) % petProfiles.value.length;
    currentProfile.value = petProfiles.value[currentIndex.value];
    slideDirection.value = 'ready-left';

    requestAnimationFrame(() => {
      slideDirection.value = 'enter-from-left';
      setTimeout(() => {
        slideDirection.value = '';
        isSliding.value = false;
      }, 500);
    });
  }, 500);
};

// ✅ 이전 카드로 이동
const prevCard = () => {
  if (isSliding.value || petProfiles.value.length === 0) return;
  isSliding.value = true;
  slideDirection.value = 'exit-left';

  setTimeout(() => {
    currentIndex.value = (currentIndex.value - 1 + petProfiles.value.length) % petProfiles.value.length;
    currentProfile.value = petProfiles.value[currentIndex.value];
    slideDirection.value = 'ready-right';

    requestAnimationFrame(() => {
      slideDirection.value = 'enter-from-right';
      setTimeout(() => {
        slideDirection.value = '';
        isSliding.value = false;
      }, 500);
    });
  }, 500);
};

// ✅ 처음 마운트될 때 애니메이션 효과
onMounted(() => {
  setTimeout(() => { showFirstLine.value = true; }, 1000);
  setTimeout(() => { showButton.value = true; }, 3000);
});

// ✅ 돌아가기 버튼 클릭
const goToNext = () => {
  router.push('/home');
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

body {
  font-family: 'Nanum Square Round', sans-serif;
}

/* 전체 화면 */
.welcome-screen {
  width: 400px;
  height: 800px;
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 40px 30px;
  border-radius: 40px;
  border: 1px solid #E5E5E5;
  margin: 0 auto;
  box-sizing: border-box;
}

/* 상단 텍스트 */
.header-text {
  text-align: left;
  width: 100%;
  padding-top: 40px;
}

h1 {
  opacity: 0;
  transform: translateY(-20px);
  transition: opacity 0.8s ease, transform 0.8s ease;
  font-weight: 700;
  color: black;
}

h1.show {
  opacity: 1;
  transform: translateY(0);
}

/* 하단 버튼 및 로그인 */
.bottom-section {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 40px;
}

/* 버튼 스타일 */
.start-button {
  margin-top: 20px;
  padding: 15px 30px;
  font-size: 18px;
  width: 100%;
  max-width: 350px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 700;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  
  opacity: 0;
  transform: translateY(20px) scale(0.95);
  animation: fadeInButton 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards;
  animation-delay: 1.0s;
}

/* 애니메이션 키프레임 */
@keyframes fadeInButton {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.start-button:hover {
  background-color: var(--color-accent1);
  transform: scale(1.05);
}

.start-button:active {
  background-color: var(--color-secondary);
  transform: scale(0.98);
}

/* 슬라이더 섹션 스타일 */
.profile-slider-section {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
}

.slider-button {
  background: none;
  border: none;
  font-size: 25px;
  color: var(--color-secondary);
  cursor: pointer;
  padding: 1px;
  transition: all 0.3s ease;
}

.slider-button:hover {
  color: var(--color-primary);
  transform: scale(1.2);
}

/* 프로필 카드 스타일 */
.profile-section {
  position: relative;
  width: 280px;
  height: 380px;
}

.profile-card {
  position: absolute;
  left: 0;
  top: 0;
  width: 280px;
  height: 380px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.25s ease, opacity 0.5s ease;
  transform-style: preserve-3d;
  will-change: transform;
}

.card-content {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  transform-style: preserve-3d;
}

.image-container {
  width: 100%;
  height: 280px;
  overflow: hidden;
  border-radius: 20px 20px 0 0;
  transform: translateZ(20px);
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info {
  padding: 20px;
  text-align: left;
  transform: translateZ(40px);
}

.pet-name {
  font-size: 1.4rem;
  font-weight: 700;
  color: #333;
  margin: 0;
  margin-bottom: 5px;
}

.pet-details {
  font-size: 1rem;
  color: var(--color-secondary);
  margin: 0;
}

/* 슬라이드 애니메이션 */
.profile-card[data-sliding="exit-right"] {
  transform: translateX(100%);
  opacity: 0;
}

.profile-card[data-sliding="ready-left"] {
  transition: none; /* 순간이동을 위해 트랜지션 비활성화 */
  transform: translateX(-100%);
  opacity: 0;
}

.profile-card[data-sliding="enter-from-left"] {
  transform: translateX(0);
  opacity: 1;
}

.profile-card[data-sliding="exit-left"] {
  transform: translateX(-100%);
  opacity: 0;
}

.profile-card[data-sliding="ready-right"] {
  transition: none; /* 순간이동을 위해 트랜지션 비활성화 */
  transform: translateX(100%);
  opacity: 0;
}

.profile-card[data-sliding="enter-from-right"] {
  transform: translateX(0);
  opacity: 1;
}

/* ready 상태일 때는 트랜지션 즉시 비활성화 */
.profile-card[data-sliding="ready-right"],
.profile-card[data-sliding="ready-left"] {
  transition: none !important;
}

/* 호버 시 그림자 효과 강화 */
.profile-card:hover {
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  transition: transform 0.08s ease, box-shadow 0.08s ease;
}

/* 예시 프로필 텍스트 스타일 */
.example-text {
  opacity: 0;
  transform: translateY(-20px);
  transition: opacity 0.8s ease, transform 0.8s ease;
  font-size: 1rem;
  color: var(--color-secondary);
  margin-top: 10px;
  font-weight: 500;
}

.example-text.show {
  opacity: 1;
  transform: translateY(0);
}
</style>


