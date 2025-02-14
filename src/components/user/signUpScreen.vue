<template>
  <div class="welcome-screen">

    <!-- 상단 텍스트 -->
    <div class="header-text">
      <h1 :class="{ 'show': showFirstLine }">회원가입을 진행해주세요!</h1>
    </div>

    <!-- 입력 필드 -->
    <div class="input-section">
      <input type="email" v-model="email" placeholder="이메일을 입력하세요" class="input-field" />
      <input type="password" v-model="password" placeholder="비밀번호를 입력하세요" class="input-field" />
      <input type="password" v-model="confirmPassword" placeholder="비밀번호 확인" class="input-field" />
      <input type="text" v-model="name" placeholder="이름을 입력하세요" class="input-field" />
      <input type="tel" v-model="phone" placeholder="연락처를 입력하세요" class="input-field" />
    </div>

    <!-- 하단 버튼과 로그인 링크 -->
    <div class="bottom-section">
      <button :class="{ 'show': showButton }" @click="signUp" class="start-button">
        다음으로
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 애니메이션을 위한 변수
const showFirstLine = ref(false);
const showButton = ref(false);
const showLogin = ref(false);

// 사용자 입력 데이터
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const name = ref('');
const phone = ref('');

onMounted(() => {
  setTimeout(() => { showFirstLine.value = true; }, 1000);
  setTimeout(() => { showButton.value = true; }, 3000);
  setTimeout(() => { showLogin.value = true; }, 3500);
});

const signUp = () => {
  console.log('이메일:', email.value);
  console.log('비밀번호:', password.value);
  console.log('비밀번호 확인:', confirmPassword.value);
  console.log('이름:', name.value);
  console.log('연락처:', phone.value);
  
  if (!email.value || !password.value || !confirmPassword.value || !name.value || !phone.value) {
    alert("모든 필드를 입력하세요!");
    return;
  }
  if (password.value !== confirmPassword.value) {
    alert("비밀번호가 일치하지 않습니다!");
    return;
  }
  router.push('/petProfile'); // 회원가입 성공 페이지로 이동
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
  padding-top: 20px;
  margin-bottom: 30px;
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

/* 입력 필드 */
.input-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-field {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 16px;
  box-sizing: border-box;
}

.input-field:focus {
  border-color: var(--color-primary);
  outline: none;
}

/* 하단 버튼 및 로그인 */
.bottom-section {
  margin-top: auto;
  padding-top: 20px;
}

/* 버튼 스타일 */
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
}

/* 애니메이션 키프레임 수정 */
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

/* 로그인 텍스트 */
.login-text {
  margin-top: 15px;
  font-size: 14px;
  text-align: right;
  color: var(--color-secondary);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.login-text.show {
  opacity: 1;
}

.login-link {
  color: var(--color-primary);
  cursor: pointer;
  font-weight: 700;
  transition: color 0.3s ease;
}

.login-link:hover {
  color: var(--color-accent2);
  text-decoration: underline;
}
</style>
