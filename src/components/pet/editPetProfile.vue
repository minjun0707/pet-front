<template>
    <div class="welcome-screen">
      <div class="header-text">
        <h1 :class="{ 'show': showFirstLine }">반려동물 프로필을</h1>
        <h1 :class="{ 'show': showFirstLine }">만들어주세요!</h1>
      </div>
  
      <form @submit.prevent="createProfile" class="profile-form">
        <div class="image-upload-section">
          <div class="image-preview"
               :style="previewImage ? { backgroundImage: `url(${previewImage})` } : {}"
               @click="triggerImageUpload">
            <span v-if="!previewImage">사진을 업로드해주세요</span>
            <input 
              type="file" 
              ref="fileInput" 
              @change="handleImageChange" 
              accept="image/*"
              class="hidden-input"
            >
          </div>
        </div>
  
        <div class="input-group">
          <label>이름</label>
          <input 
            type="text" 
            v-model="petInfo.name"
            placeholder="반려동물의 이름을 입력하세요"
          >
        </div>
  
        <div class="input-group">
          <label>나이</label>
          <div class="age-input">
            <input 
              type="number" 
              v-model="petInfo.age"
              placeholder="숫자만 입력"
            >
            <span class="age-suffix">살</span>
          </div>
        </div>
  
        <div class="input-group">
          <label>종류</label>
          <input 
            type="text" 
            v-model="petInfo.type"
            placeholder="반려동물의 종류를 입력하세요"
          >
        </div>
  
        <div class="bottom-section">
          <button v-if="petId" @click="editProfile" type="button" class="edit-button">
            수정하기
          </button>
          <button v-if="petId" @click="deleteProfile" type="button" class="edit-button">
            삭제하기
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import api from '@/api/axios';
  
  const router = useRouter();
  const route = useRoute();
  
  const petId = computed(() => route.params.id);
  
  const petInfo = ref({ name: '', age: '', type: '', imageUrl: '' });
  const previewImage = ref('');
  const fileInput = ref(null);
  
  const fetchPetProfile = async () => {
      try {
          if (!petId.value) {
              console.error("petId가 존재하지 않습니다!");
              return;
          }
          
          const response = await api.get(`/users/pet-profile/${petId.value}`);
          if (response.data && response.data.result && response.data.result.data) {
              const petData = response.data.result.data;
              petInfo.value = {
                  name: petData.name,
                  age: petData.age,
                  type: petData.type,
                  imageUrl: petData.imageUrl
              };
              previewImage.value = petData.imageUrl || 'https://your-default-image-url.com/default.jpg';
          } else {
              console.error("잘못된 API 응답 형식:", response.data);
          }
      } catch (error) {
          console.error('프로필 가져오기 실패:', error);
      }
  };
  
  // ✅ 프로필 수정 요청 (PUT)
// ✅ 프로필 수정 요청 (PUT)
const updateProfile = async () => {
    try {
        if (!petId.value) {
            console.error("petId가 존재하지 않습니다!");
            return;
        }

        const updatedData = {
            name: petInfo.value.name,
            age: petInfo.value.age,
            type: petInfo.value.type,
            imageUrl: previewImage.value || petInfo.value.imageUrl
        };

        // ✅ 응답을 response 변수에 저장
        const response = await api.put(`/users/pet-profile/${petId.value}`, updatedData);

        // ✅ 응답이 정상적으로 왔는지 확인
        if (response.data) {
            console.log('프로필 수정 성공:', response.data);
            router.push('/myPetProfile'); // ✅ 수정 성공 후 이동
        } else {
            console.error("잘못된 응답 형식:", response.data);
        }
    } catch (error) {
        console.error('프로필 수정 실패:', error);
    }
};

  // ✅ 프로필 삭제 요청 (DELETE)
  const deleteProfile = async () => {
      try {
          if (!petId.value) {
              console.error("petId가 존재하지 않습니다!");
              return;
          }
  
          await api.delete(`/users/pet-profile/${petId.value}`);
          router.push('/myPetProfile');
      } catch (error) {
          console.error('프로필 삭제 실패:', error);
      }
  };
  
  // ✅ 수정하기 버튼 추가
  const editProfile = () => {
      updateProfile();
  };
  
  onMounted(() => {
      if (petId.value) {
          fetchPetProfile();
      }
  });
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
  border: 8px solid #E5E5E5;
  margin: 0 auto;
  box-sizing: border-box;
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
  margin: 5px 0;
  font-size: 24px;
}

h1.show {
  opacity: 1;
  transform: translateY(0);
}

.profile-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.image-upload-section {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.image-preview {
  width: 180px;
  height: 180px;
  border-radius: 15px;
  border: 2px dashed var(--color-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-size: cover;
  background-position: center;
  color: var(--color-secondary);
  transition: all 0.3s ease;
}

.image-preview:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.hidden-input {
  display: none;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

.input-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 16px;
  box-sizing: border-box;
}

.input-group input:focus {
  border-color: var(--color-primary);
  outline: none;
}

.age-input {
  position: relative;
  display: flex;
  align-items: center;
}

.age-input input {
  padding-right: 40px;
}

.age-suffix {
  position: absolute;
  right: 12px;
  color: #666;
}

.bottom-section {
  margin-top: auto;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.start-button,
.edit-button,
.delete-button {
  width: 100%;
  padding: 15px 0;
  font-size: 16px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.start-button {
  background-color: var(--color-primary);
  color: white;
}

.start-button:hover {
  background-color: var(--color-accent1);
  transform: scale(1.05);
}

.start-button:active {
  transform: scale(0.98);
}

/* ✅ 수정 버튼 스타일 */
.edit-button {
  background-color: var(--color-secondary);
  color: white;
}

.edit-button:hover {
  background-color: var(--color-accent2);
  transform: scale(1.05);
}

/* ✅ 삭제 버튼 스타일 */
.delete-button {
  background-color: var(black);
  color: white;
}

.delete-button:hover {
  background-color: #ff4f4f;
  transform: scale(1.05);
}

.delete-button:active {
  transform: scale(0.98);
}

/* ✅ 버튼 정렬 */
.action-buttons {
  display: flex;
  gap: 10px;
  width: 100%;
}

.action-buttons .edit-button,
.action-buttons .delete-button {
  flex: 1;
}

/* ✅ 버튼 컨테이너 추가 */
.button-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* ✅ 스타일이 전혀 적용되지 않는 경우 global 적용 */
:deep(.delete-button) {
  background-color: var(--color-danger);
}


 
  
  </style>
  