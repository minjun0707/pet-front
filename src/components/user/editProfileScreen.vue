<template>
  <div class="welcome-screen">
    <!-- 상단 텍스트 -->
    <div class="header-text">
      <h1 :class="{ 'show': showFirstLine }">회원정보를</h1>
      <h1 :class="{ 'show': showFirstLine }">수정해주세요!</h1>
    </div>

    <!-- 반려동물 아이콘 이미지 -->
    <div class="pet-icon" :class="{ 'show': showFirstLine }">
      <img src="@/assets/images/pet-icon.png" alt="강아지와 고양이 아이콘" />
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 애니메이션을 위한 변수
const showFirstLine = ref(false);
const showButton = ref(false);
const showLogin = ref(false);

// 사용자 입력 데이터
const email = ref('user@example.com'); // 실제로는 현재 로그인된 사용자의 이메일
const name = ref('');
const phone = ref('');

onMounted(() => {
  // 애니메이션 타이밍
  setTimeout(() => { showFirstLine.value = true; }, 1000);
  setTimeout(() => { showButton.value = true; }, 3000);
  setTimeout(() => { showLogin.value = true; }, 3500);
  
  // TODO: 현재 사용자 정보 불러오기
  loadUserInfo();
});

const loadUserInfo = async () => {
  // TODO: API에서 현재 사용자 정보를 가져와서 설정
  // 임시 데이터
  name.value = '홍길동';
  phone.value = '010-1234-5678';
};

const updateProfile = async () => {
  if (!name.value || !phone.value) {
    alert("모든 필드를 입력하세요!");
    return;
  }

  try {
    // TODO: API 호출하여 프로필 업데이트
    console.log('업데이트할 정보:', {
      name: name.value,
      phone: phone.value
    });
    
    alert("회원정보가 성공적으로 수정되었습니다.");
  } catch (error) {
    alert("회원정보 수정 중 오류가 발생했습니다.");
  }
};

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

/* 기존 스타일 유지 */
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

/* 반려동물 아이콘 이미지 */
.pet-icon {
  width: 100%;
  text-align: center;
  margin: 20px 0 30px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.pet-icon.show {
  opacity: 1;
  transform: translateY(0);
}

.pet-icon img {
  width: 200px;
  height: auto;
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

/* 하단 버튼 및 비밀번호 변경 링크 */
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