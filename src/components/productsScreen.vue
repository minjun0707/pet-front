<template>
    <div class="main-layout">
      <div class="content-container">
        <div class="main-content">
          <!-- 정렬 및 검색 섹션 -->
          <div class="sort-search-section">
            <div class="sort-buttons">
              <button 
                class="sort-btn" 
                :class="{ active: sortBy === 'date', reverse: dateReverse }"
                @click="toggleSort('date')"
              >
                등록순 
                <span class="sort-arrow">{{ dateReverse ? '↑' : '↓' }}</span>
              </button>
              <button 
                class="sort-btn" 
                :class="{ active: sortBy === 'price', reverse: priceReverse }"
                @click="toggleSort('price')"
              >
                가격순
                <span class="sort-arrow">{{ priceReverse ? '↑' : '↓' }}</span>
              </button>
            </div>
            <div class="search-box">
              <input 
                type="text" 
                v-model="searchKeyword" 
                placeholder="상품 검색" 
                class="search-input"
              />
              <button class="search-btn" @click="searchProducts">검색</button>
            </div>
          </div>
  
          <!-- 상품 목록 -->
          <div class="product-grid">
            <div v-for="n in 8" :key="n" class="product-card">
                <div class="product-image">
                <img src="https://petone.kr/wp-content/uploads/2023/02/feed_4-1.jpg" alt="상품 이미지">
                </div>
                <div class="product-info">
                <h3>마싯는 사료</h3>
                <p class="price">50,000원</p>
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
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // 정렬 및 검색 상태
  const sortBy = ref('date');
  const dateReverse = ref(false);
  const priceReverse = ref(false);
  const searchKeyword = ref('');
  
  // 정렬 토글 함수
  const toggleSort = (type) => {
    if (type === 'date') {
      sortBy.value === 'date' ? (dateReverse.value = !dateReverse.value) : (sortBy.value = 'date');
    } else if (type === 'price') {
      sortBy.value === 'price' ? (priceReverse.value = !priceReverse.value) : (sortBy.value = 'price');
    }
  };
  
  // 검색 함수
  const searchProducts = () => {
    console.log('검색어:', searchKeyword.value);
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

/* 📌 배너 스타일 */
.main-banner {
  width: 100%;
  height: 400px;
  margin-bottom: 40px;
  overflow: hidden;
  border-radius: 12px;
  position: relative;
}

.banner-container {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease;
}

.banner-slide {
  min-width: 100%;
  height: 100%;
}

.banner-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* 📌 배너 네비게이션 버튼 */
.banner-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.7);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 24px;
  color: var(--color-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-in-out;
  z-index: 10;
}

.banner-nav:hover {
  background: rgba(255, 255, 255, 0.9);
  color: var(--color-primary);
}

.banner-nav.prev {
  left: 20px;
}

.banner-nav.next {
  right: 20px;
}

/* 📌 배너 인디케이터 */
.banner-indicators {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.indicator-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.indicator-dot.active {
  background: var(--color-primary);
  transform: scale(1.3);
}

.indicator-dot:hover {
  background: var(--color-accent1);
}

/* 📌 정렬 및 검색 섹션 */
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

/* 📌 상품 그리드 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
}

/* 📌 상품 이미지 스타일 */
.product-image {
  width: 100%;
  height: 200px; /* 기존 높이 유지 */
  background-color: #f0f0f0; /* 배경 유지 */
  border-radius: 12px 12px 0 0; /* 위쪽 둥근 모서리 유지 */
  overflow: hidden; /* 넘치는 부분 숨김 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 비율 유지하며 꽉 채움 */
  object-position: center;
}


.product-info {
  padding: 15px;
}

.product-info h3 {
  margin: 0;
  font-size: 16px;
  color: var(--color-secondary);
}

.price {
  margin: 8px 0 0;
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
</style>
