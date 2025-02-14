<template>
  <div class="main-layout">
    <div class="content-container">
      <div class="main-content">
        <!-- 검색 및 정렬 섹션 -->
        <div class="sort-search-section">
          <!-- 가격 정렬 버튼 -->
          <div class="sort-buttons">
            <button 
              class="sort-btn" 
              :class="{ active: sortBy === 'price', reverse: priceReverse }"
              @click="toggleSort"
            >
              가격순
              <span class="sort-arrow">{{ priceReverse ? '↑' : '↓' }}</span>
            </button>
          </div>

          <!-- 지역명 검색 -->
          <div class="search-box">
            <input 
              type="text" 
              v-model="searchKeyword" 
              placeholder="지역명 검색" 
              class="search-input"
            />
            <button class="search-btn" @click="searchProfiles">검색</button>
          </div>
        </div>

        <!-- 펫 프로필 목록 -->
        <div class="profile-grid">
          <div 
            v-for="profile in filteredProfiles" 
            :key="profile.id" 
            class="profile-card"
            @click="openModal(profile)"
          >
            <div class="profile-image">
              <img :src="profile.image" :alt="profile.name" />
            </div>
            <div class="profile-info">
              <h3>{{ profile.name }}</h3>
              <p class="location">📍 {{ profile.location }}</p>
              <p class="rate">💰 {{ profile.hourlyRate.toLocaleString() }}원</p>
              <p class="pets">🐶 돌봄 가능: {{ profile.petTypes.join(', ') }}</p>
              <p class="days">📅 요일: {{ profile.availableDays.join(', ') }}</p>
            </div>
          </div>
        </div>

        <!-- 페이지네이션 -->
        <div class="pagination">
          <button class="page-btn">&lt;</button>
          <button class="page-btn active">1</button>
          <button class="page-btn">2</button>
          <button class="page-btn">3</button>
          <button class="page-btn">4</button>
          <button class="page-btn">5</button>
          <button class="page-btn">&gt;</button>
        </div>
      </div>
    </div>

    <!-- 🔹 모달 창 -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-btn" @click="closeModal">×</button>
        <div class="modal-header">
          <h2>{{ selectedProfile.name }}</h2>
          <p class="modal-location">📍 {{ selectedProfile.location }}</p>
        </div>
        <div class="modal-body">
          <div class="modal-section">
            <h3>💰 시간당 요금</h3>
            <p>{{ selectedProfile.hourlyRate.toLocaleString() }} 원</p>
          </div>
          <div class="modal-section">
            <h3>🐶 돌봄 가능 반려동물</h3>
            <p>{{ selectedProfile.petTypes.join(', ') }}</p>
          </div>
          <div class="modal-section">
            <h3>📅 돌봄 가능 요일</h3>
            <p>{{ selectedProfile.availableDays.join(', ') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 검색어 및 정렬 상태
const searchKeyword = ref('');
const sortBy = ref('price');
const priceReverse = ref(false);
const showModal = ref(false);
const selectedProfile = ref(null);

// 펫 프로필 데이터
const profiles = ref([
  {
    id: 1, name: '김펫시터', location: '서울 강남구', hourlyRate: 20000, 
    petTypes: ['강아지', '고양이'], availableDays: ['월', '화', '수', '목', '금'], 
    image: '/src/assets/images/profile-1.jpg'
  },
  {
    id: 2, name: '이펫시터', location: '부산 해운대구', hourlyRate: 25000, 
    petTypes: ['말티즈', '포메라니안'], availableDays: ['토', '일'], 
    image: '/src/assets/images/profile-2.jpg'
  },
]);

// 검색 및 정렬된 데이터 반환
const filteredProfiles = computed(() => {
  let filtered = profiles.value.filter(profile =>
    profile.location.includes(searchKeyword.value)
  );

  if (sortBy.value === 'price') {
    filtered.sort((a, b) => priceReverse.value ? b.hourlyRate - a.hourlyRate : a.hourlyRate - b.hourlyRate);
  }

  return filtered;
});

// 가격순 정렬 토글
const toggleSort = () => {
  priceReverse.value = !priceReverse.value;
};

// 검색 실행
const searchProfiles = () => {
  console.log('검색 지역:', searchKeyword.value);
};

// 모달 열기/닫기
const openModal = (profile) => {
  selectedProfile.value = profile;
  showModal.value = true;
};
const closeModal = () => {
  showModal.value = false;
};
</script>


<style scoped>
/* 📌 메인 레이아웃 */
.main-layout {
  width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  font-family: 'Nanum Square Round', sans-serif;
}

/* 📌 컨텐츠 컨테이너 */
.content-container {
  display: flex;
  min-height: calc(100vh - 60px);
}

/* 📌 메인 컨텐츠 */
.main-content {
  flex: 1;
  padding: 20px;
  background-color: #f9f9f9;
}

/* 📌 검색 및 정렬 섹션 */
.sort-search-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 📌 정렬 버튼 */
.sort-buttons {
  display: flex;
  gap: 12px;
}

.sort-btn {
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  color: var(--color-secondary);
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.sort-btn:hover {
  background-color: var(--color-accent2);
}

.sort-btn.active {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.sort-arrow {
  font-size: 12px;
}

/* 📌 검색 박스 */
.search-box {
  display: flex;
  gap: 10px;
}

.search-input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 200px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.search-btn {
  padding: 10px 16px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.search-btn:hover {
  background-color: var(--color-accent1);
}

/* 📌 프로필 그리드 */
.profile-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

/* 📌 프로필 카드 */
.profile-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.profile-card:hover {
  transform: translateY(-5px);
}

/* 📌 프로필 이미지 */
.profile-image {
  width: 100%;
  height: 200px;
  background-color: #f0f0f0;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 📌 프로필 정보 */
.profile-info {
  padding: 15px;
}

.profile-info h3 {
  margin: 0;
  font-size: 16px;
  color: var(--color-secondary);
}

.location, .pets, .days {
  font-size: 14px;
  color: #666;
}

.rate {
  font-weight: 700;
  color: var(--color-primary);
}

/* 📌 페이지네이션 */
.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 40px;
}

.page-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  color: var(--color-secondary);
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:hover {
  background-color: var(--color-accent2);
}

.page-btn.active {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

/* 📌 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 400px;
  text-align: center;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  border: none;
  background: none;
  cursor: pointer;
}

.modal-header {
  margin-bottom: 20px;
}

.modal-header h2 {
  margin: 0;
  color: var(--color-primary);
}

.modal-location {
  color: var(--color-secondary);
}

.modal-body {
  text-align: left;
}

.modal-section {
  margin-bottom: 15px;
}

.modal-section h3 {
  margin: 0 0 5px;
  font-size: 16px;
  color: var(--color-secondary);
}

.modal-section p {
  font-size: 14px;
  color: #555;
}
</style>
