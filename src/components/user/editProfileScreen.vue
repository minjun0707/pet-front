<template>
  <div class="welcome-screen">
    <!-- 상단 텍스트 -->
    <div class="header-text">
      <h1 :class="{ 'show': showFirstLine }">회원정보를</h1>
      <h1 :class="{ 'show': showFirstLine }">수정해주세요!</h1>
    </div>

    <!-- 입력 필드 -->
    <div class="input-section">
      <div class="input-group">
        <label>이메일</label>
        <input type="email" v-model="email" disabled class="input-field disabled" />
      </div>
      <div class="input-group">
        <label>이름</label>
        <input type="text" v-model="name" placeholder="이름을 입력하세요" class="input-field" />
      </div>
      <div class="input-group">
        <label>연락처</label>
        <input type="tel" v-model="phone" placeholder="연락처를 입력하세요" class="input-field" />
      </div>
    </div>

    <!-- 하단 버튼들 -->
    <div class="bottom-section">
      <button :class="{ 'show': showButton }" @click="updateProfile" class="start-button">
        수정하기
      </button>
      <div class="password-change-link" :class="{ 'show': showLogin }" @click="goToPasswordChange">
        비밀번호 변경하기
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import api from '@/api/axios';

const router = useRouter();
const userStore = useUserStore();

// ✅ 상태관리에서 userId 가져오기
const userId = computed(() => userStore.userId);

// ✅ 애니메이션 변수
const showFirstLine = ref(false);
const showButton = ref(false);
const showLogin = ref(false);

// ✅ 사용자 입력 데이터
const email = ref('');
const name = ref('');
const phone = ref('');

onMounted(() => {
  // 애니메이션 타이밍
  setTimeout(() => { showFirstLine.value = true; }, 1000);
  setTimeout(() => { showButton.value = true; }, 3000);
  setTimeout(() => { showLogin.value = true; }, 3500);

  // ✅ 사용자 정보 불러오기
  loadUserInfo();
});

// ✅ GET 요청: 사용자 정보 가져오기
const loadUserInfo = async () => {
  try {
    if (!userId.value) {
      console.error("사용자 ID가 없습니다!");
      return;
    }
    
    const response = await api.get(`/users/${userId.value}`);
    if (response.data) {
      email.value = response.data.result.data.email;
      name.value = response.data.result.data.name;
      phone.value = response.data.result.data.phoneNumber;
    }
  } catch (error) {
    console.error("사용자 정보 불러오기 실패:", error);
  }
};

// ✅ PUT 요청: 사용자 정보 수정
const updateProfile = async () => {
  if (!name.value || !phone.value) {
    alert("모든 필드를 입력하세요!");
    return;
  }

  try {
    const updateData = {
      email: email.value,  // 이메일은 수정 불가 (백엔드 DTO 규칙)
      name: name.value,
      phoneNumber: phone.value
    };

    const response = await api.put(`/users/${userId.value}`, updateData);
    
    if (response.data) {
      alert("회원정보가 성공적으로 수정되었습니다.");
      router.push('/home'); // ✅ 수정 후 홈 화면으로 이동
    }
  } catch (error) {
    console.error("회원정보 수정 실패:", error);
    alert("회원정보 수정 중 오류가 발생했습니다.");
  }
};

// ✅ 비밀번호 변경 페이지 이동
const goToPasswordChange = () => {
  router.push('/password-change');
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

/* 기본 레이아웃 */
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

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 700;
  color: var(--color-secondary);
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

.input-field.disabled {
  background-color: #f5f5f5;
  color: #888;
  cursor: not-allowed;
}

/* 하단 버튼 */
.bottom-section {
  margin-top: auto;
  padding-top: 20px;
}

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

/* 비밀번호 변경 링크 */
.password-change-link {
  margin-top: 20px;
  text-align: center;
  color: var(--color-secondary);
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.password-change-link.show {
  opacity: 1;
}

.password-change-link:hover {
  color: var(--color-primary);
  text-decoration: underline;
}
</style>
