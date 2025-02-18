<template>
  <div class="welcome-screen" :class="{ 'fade-out': isFading }">
    <!-- 상단 텍스트 -->
    <div class="header-text">
      <h1 :class="{ 'show': showFirstLine }">이메일과 비밀번호로</h1>
      <h1 :class="{ 'show': showFirstLine }">로그인해주세요.</h1>
    </div>

    <!-- 입력 필드 -->
    <div class="input-section">
      <input 
        type="email" 
        v-model="email" 
        placeholder="이메일을 입력하세요" 
        class="input-field" 
      />
      <input 
        type="password" 
        v-model="password" 
        placeholder="비밀번호를 입력하세요" 
        class="input-field" 
      />
    </div>

    <!-- 하단 버튼과 회원가입 링크 -->
    <div class="bottom-section">
      <button 
        :class="{ 'show': showButton }" 
        @click="login" 
        class="start-button"
      >
        로그인
      </button>
      <p class="signup-text" :class="{ 'show': showSignup }">
        계정이 없으신가요? 
        <span class="signup-link" @click="goToSignUp">회원가입</span>
      </p>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import api from '@/api/axios'; // ✅ Axios 사용

const router = useRouter();
const userStore = useUserStore();

// 애니메이션을 위한 변수
const showFirstLine = ref(false);
const showButton = ref(false);
const showSignup = ref(false);
const isFading = ref(false); // 페이드아웃 상태

// ✅ 사용자 입력 데이터 (기본값 설정)
const email = ref('kt2025@kt.com');
const password = ref('kt2025@@');

onMounted(() => {
  setTimeout(() => { showFirstLine.value = true; }, 1000);
  setTimeout(() => { showButton.value = true; }, 2000);
  setTimeout(() => { showSignup.value = true; }, 2500);
});

const login = async () => {
  if (!email.value || !password.value) {
    alert("이메일과 비밀번호를 모두 입력해주세요!");
    return;
  }

  try {
    const response = await api.post('/users/login', {
      email: email.value,
      password: password.value
    });

    if (response.data.status) {
      const userId = response.data.result.data.userId; 
      const name = response.data.result.data.name;
      const accessToken = response.data.result.data.accessToken;
      
      console.log(response.data.result)
      console.log("userId"+ response.data.result.data.userId);
      console.log("name" + response.data.result.data.name);
      console.log("token" + response.data.result.data.token);

      // ✅ Pinia 상태 업데이트 (userId, name, token 개별 저장)
      userStore.setUser(userId, name, accessToken);


      // ✅ 페이드아웃 효과 적용 후 홈으로 이동
      isFading.value = true;
      setTimeout(() => {
        router.push('/home');
      }, 1500);
    } else {
      alert('로그인 실패: ' + response.data.message);
    }
  } catch (error) {
    console.error('로그인 오류:', error);
    alert('서버 오류');
  }
};

const goToSignUp = () => {
  router.push('/signup');
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
  margin-top: 50px;
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

/* 하단 버튼 및 회원가입 */
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
  opacity: 0;
  transform: scale(0.9);
}

.start-button.show {
  opacity: 1;
  transform: scale(1);
}

.start-button:hover {
  background-color: var(--color-accent1);
  transform: scale(1.05);
}

.start-button:active {
  background-color: var(--color-secondary);
  transform: scale(0.98);
}

/* 회원가입 텍스트 */
.signup-text {
  margin-top: 15px;
  font-size: 14px;
  text-align: center;
  color: var(--color-secondary);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.signup-text.show {
  opacity: 1;
}

.signup-link {
  color: var(--color-primary);
  cursor: pointer;
  font-weight: 700;
  transition: color 0.3s ease;
}

.signup-link:hover {
  color: var(--color-accent1);
  text-decoration: underline;
}

/* 화면 페이드아웃 효과 */
.fade-out {
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 1s ease-out, transform 1s ease-out;
}
</style> 