<template>
  <div class="welcome-screen">
    <!-- 상단 텍스트 -->
    <div class="header-text">
      <h1 :class="{ 'show': showFirstLine }">비밀번호를</h1>
      <h1 :class="{ 'show': showFirstLine }">변경해주세요!</h1>
    </div>

    <!-- 입력 필드 -->
    <div class="input-section">
      <div class="input-group">
        <label>새 비밀번호</label>
        <input 
          type="password" 
          v-model="newPassword" 
          placeholder="새 비밀번호를 입력하세요" 
          class="input-field" 
        />
      </div>
      <div class="input-group">
        <label>새 비밀번호 확인</label>
        <input 
          type="password" 
          v-model="confirmPassword" 
          placeholder="새 비밀번호를 다시 입력하세요" 
          class="input-field" 
        />
      </div>
    </div>

    <!-- 하단 버튼 -->
    <div class="bottom-section">
      <button :class="{ 'show': showButton }" @click="changePassword" class="start-button">
        비밀번호 변경하기
      </button>
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

// ✅ 사용자 입력 데이터
const newPassword = ref('');
const confirmPassword = ref('');

onMounted(() => {
  setTimeout(() => { showFirstLine.value = true; }, 1000);
  setTimeout(() => { showButton.value = true; }, 3000);
});

// ✅ 비밀번호 변경 요청 (PUT)
const changePassword = async () => {
  if (!newPassword.value || !confirmPassword.value) {
    alert("모든 필드를 입력하세요!");
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    alert("새 비밀번호가 일치하지 않습니다!");
    return;
  }

  try {
    console.log("전송할 비밀번호:", newPassword.value);

    const response = await api.put(
      `/users/password/${userId.value}`,
      { password: newPassword.value }, 
      { headers: { "Content-Type": "application/json" } } // ✅ 명확한 JSON 설정
    );

    if (response.data) {
      alert("비밀번호가 성공적으로 변경되었습니다.");
      router.push('/home'); // ✅ 비밀번호 변경 후 홈으로 이동
    }
  } catch (error) {
    console.error("비밀번호 변경 실패:", error);
    alert("비밀번호 변경 중 오류가 발생했습니다.");
  }
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
}

.start-button:hover {
  background-color: var(--color-accent1);
  transform: scale(1.05);
}

.start-button:active {
  background-color: var(--color-secondary);
  transform: scale(0.98);
}
</style>
