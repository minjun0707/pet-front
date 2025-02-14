<template>
  <div class="welcome-screen">
    
    <!-- 상단 텍스트 -->
    <div class="header-text">
      <h1 :class="{ 'show': showFirstLine }">안녕하세요</h1>
      <h1 :class="{ 'show': showSecondLine }">멍뭉스토어 입니다!</h1>
    </div>

    <!-- 반려동물 아이콘 이미지 -->
    <div class="pet-icon" :class="{ 'show': showSecondLine }">
      <img src="@/assets/images/pet-icon.png" alt="강아지와 고양이 아이콘" />
    </div>

    <!-- 하단 버튼과 로그인 링크 -->
    <div class="bottom-section">
      <button :class="{ 'show': showButton }" @click="startApp" class="start-button">
        시작하기
      </button>
      <p :class="{ 'show': showLogin }" class="login-text">
        이미 계정이 있나요?
        <span @click="showLoginScreen" class="login-link">로그인</span>
      </p>
    </div>
  </div>
</template>



<script setup>
import { ref, onMounted } from 'vue';

const showFirstLine = ref(false);
const showSecondLine = ref(false);
const showButton = ref(false);
const showLogin = ref(false);

onMounted(() => {
  setTimeout(() => { showFirstLine.value = true; }, 1000);
  setTimeout(() => { showSecondLine.value = true; }, 2000);
  setTimeout(() => { showButton.value = true; }, 3000);
  setTimeout(() => { showLogin.value = true; }, 3500);
});


import { useRouter } from 'vue-router';

const router = useRouter();
const startApp = () => {
  router.push('/signUp');
};

const showLoginScreen = () => {
  router.push('/login');
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

/* 배경 이미지 스타일 */
.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.15;
}

/* 상단 텍스트 */
.header-text {
  text-align: left;
  width: 100%;
  padding-top: 20px;
  margin-bottom: 30px;
}

h1, h2 {
  opacity: 0;
  transform: translateY(-20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
  font-weight: 700;
  color: var(black);
}

h1.show, h2.show {
  opacity: 1;
  transform: translateY(0);
}

/* 반려동물 아이콘 */
.pet-icon {
  width: 100%;
  text-align: center;
  margin: 80px 0;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.pet-icon.show {
  opacity: 1;
  transform: translateY(0);
}

.pet-icon img {
  width: 220px;
  height: auto;
}

/* 하단 버튼 및 로그인 */
.bottom-section {
  margin-top: auto;
  padding-top: 20px;
}

/* ✅ 버튼 스타일 (부드러운 등장 애니메이션 적용) */
.start-button {
  width: 100%;
  padding: 15px 0;
  font-size: 16px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transform: scale(0.95); /* 시작 크기를 0.95로 조정 */
  animation: fadeInScale 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards; /* 더 부드러운 애니메이션 */
  animation-delay: 3s; /* 버튼이 3초 후에 등장 */
}



/* 버튼 애니메이션 효과 (보이게 하기) */
.start-button.show {
opacity: 1;
}

/* 버튼 호버 효과 */
.start-button:hover {
  background-color: var(--color-accent1);
  transform: scale(1.05);
}

/* 버튼 클릭 시 효과 */
.start-button:active {
  background-color: var(--color-secondary);
  transform: scale(0.98);
}


/* 로그인 텍스트 */
.login-text {
  margin-top: 15px;
  font-size: 14px;
  text-align: right;
  opacity: 0;
  transition: opacity 0.5s ease;
  color: var(#9d8189);
}

.login-text.show {
  opacity: 1;
}

.login-link {
  color: var(#f4acb7);
  cursor: pointer;
  font-weight: 700;
  transition: color 0.3s ease;
}

.login-link:hover {
  color: var(#ffe5d9);
  text-decoration: underline;
}
</style>


