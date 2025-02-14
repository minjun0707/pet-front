<template>
  <div class="welcome-screen">
    <div class="header-text">
      <h1 :class="{ 'show': showFirstLine }">반려동물 프로필을</h1>
      <h1 :class="{ 'show': showFirstLine }">만들어주세요!</h1>
    </div>

    <form @submit.prevent="handleSubmit" class="profile-form">
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
        <label>품종</label>
        <input 
          type="text" 
          v-model="petInfo.breed"
          placeholder="반려동물의 품종을 입력하세요"
        >
      </div>

      <div class="bottom-section">
        <button :class="{ 'show': showButton }" @click="createProfile" class="start-button">
          프로필 만들기
        </button>
      </div>
    </form>


  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showFirstLine = ref(false)
const showButton = ref(false)
const previewImage = ref(null)
const fileInput = ref(null)

const petInfo = ref({
  name: '',
  age: '',
  breed: '',
  image: null
})

const showSuccess = ref(false)
const showMessage = ref(false)
const showCard = ref(false)
const showFireworks = ref(false)
const showSuccessButton = ref(false)

const petName = ref('')
const petAge = ref('')
const petBreed = ref('')

const triggerImageUpload = () => {
  fileInput.value.click()
}

const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImage.value = e.target.result
      petInfo.value.image = file
    }
    reader.readAsDataURL(file)
  }
}

const handleSubmit = () => {
  // 여기에 서버로 데이터를 전송하는 로직을 추가하세요
  console.log('제출된 펫 정보:', petInfo.value)
  // 제출 후 다음 페이지로 이동
  router.push('/home')
}

const createProfile = () => {
  if (!petInfo.value.name || !petInfo.value.age || !petInfo.value.breed) {
    alert('모든 정보를 입력해주세요!')
    return
  }

  showSuccessScreen()
}

const showSuccessScreen = () => {
  showSuccess.value = true
  setTimeout(() => { showMessage.value = true }, 500)
  setTimeout(() => { showCard.value = true }, 1000)
  setTimeout(() => { showFireworks.value = true }, 1500)
  setTimeout(() => { showSuccessButton.value = true }, 2500)

  petName.value = petInfo.value.name
  petAge.value = petInfo.value.age
  petBreed.value = petInfo.value.breed
}


onMounted(() => {
  setTimeout(() => { showFirstLine.value = true }, 500)
  setTimeout(() => { showButton.value = true }, 1000)
})
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
  transform: translateY(20px);
}

.start-button.show {
  opacity: 1;
  transform: translateY(0);
}

.start-button:hover {
  background-color: var(--color-accent1);
  transform: scale(1.05);
}

.start-button:active {
  transform: scale(0.98);
}

.success-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.success-content {
  background-color: white;
  padding: 40px;
  border-radius: 40px;
  box-sizing: border-box;
  text-align: center;
}

.success-message {
  opacity: 0;
  transform: translateY(-20px);
  transition: opacity 0.8s ease, transform 0.8s ease;
  margin-bottom: 30px;
}

.success-message.show {
  opacity: 1;
  transform: translateY(0);
}

.profile-card-container {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease, transform 0.8s ease;
  margin-bottom: 30px;
}

.profile-card-container.show {
  opacity: 1;
  transform: translateY(0);
}

.profile-card {
  background-color: var(--color-accent3);
  border-radius: 15px;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-container {
  width: 120px;
  height: 120px;
  border-radius: 10px;
  overflow: hidden;
  margin-right: 20px;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info {
  text-align: left;
}

.pet-name {
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 5px;
}

.pet-details {
  font-size: 14px;
  color: #666;
}

.fireworks {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease, transform 0.8s ease;
  margin-bottom: 30px;
}

.fireworks.show {
  opacity: 1;
  transform: translateY(0);
}

.firework {
  width: 10px;
  height: 10px;
  background-color: var(--color-primary);
  border-radius: 50%;
  margin: 0 5px;
}

.success-button {
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
  transform: translateY(20px);
}

.success-button.show {
  opacity: 1;
  transform: translateY(0);
}

.success-button:hover {
  background-color: var(--color-accent1);
  transform: scale(1.05);
}

.success-button:active {
  transform: scale(0.98);
}
</style>
