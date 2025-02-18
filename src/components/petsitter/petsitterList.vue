<template>
  <div class="main-layout">
    <div class="content-container">
      <div class="main-content">
        <!-- 검색 및 정렬 섹션 -->
        <div class="sort-search-section">
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
          <div class="search-box">
            <input 
              type="text" 
              v-model="searchKeyword" 
              placeholder="지역명 검색" 
              class="search-input"
            />
            <button class="search-btn" @click="fetchPetSitterProfiles">검색</button>
          </div>
        </div>

        <!-- 펫시터 프로필 목록 -->
        <div class="profile-grid">
          <div 
            v-for="profile in filteredProfiles" 
            :key="profile.petSitterId" 
            class="profile-card"
            @click="openModal(profile)"
          >
            <div class="profile-image">
              <img :src="profile.image" :alt="profile.name" />
            </div>
            <div class="profile-info">
              <h3>{{ profile.name }}</h3>
              <p class="location">📍 {{ profile.city }}</p>
              <p class="rate">💰 {{ profile.hourlyRate.toLocaleString() }}원</p>
              <p class="pets">🐶 돌봄 가능: {{ profile.petTypes.join(', ') }}</p>
              <p class="days">📅 요일: {{ profile.availableDays.join(', ') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 🔹 모달 창 -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-btn" @click="closeModal">×</button>
        <div class="modal-header">
          <h2>{{ selectedProfile.name }}</h2>
          <p class="modal-location">📍 {{ selectedProfile.city }}</p>
        </div>
        <div class="modal-body">
          <div class="modal-profile-image">
            <img :src="selectedProfile.image" :alt="selectedProfile.name" />
          </div>
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
        <button class="reserve-btn" @click="onPayment">예약하기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/api/axios';
import { useUserStore } from '@/stores/userStore';
const searchKeyword = ref('');
const sortBy = ref('price');
const priceReverse = ref(false);
const showModal = ref(false);
const selectedProfile = ref(null);
const profiles = ref([]);
const userStore = useUserStore();
const userId = computed(() => userStore.userId);


// ✅ 펫시터 목록 가져오기 (API 호출)
const fetchPetSitterProfiles = async () => {
  try {
    const response = await api.get('/users/pet-sitter');

    console.log("API 응답 데이터:", response.data);

    if (response.data && response.data.result && Array.isArray(response.data.result.data)) {
      const petSitterList = response.data.result.data; // 배열 추출

      profiles.value = petSitterList.map(petData => ({
        petSitterId: petData.petSitterId,
        city: petData.city && petData.city.trim() !== '' ? petData.city : '미정', // ✅ 빈 값 처리
        petTypes: Array.isArray(petData.availablePets) ? petData.availablePets : [], // ✅ 배열 보장
        startDate: petData.startDate ? new Date(petData.startDate) : null,
        endDate: petData.endDate ? new Date(petData.endDate) : null,
        availableDays: Array.isArray(petData.availableDays) ? petData.availableDays : [], // ✅ 배열 보장
        startTime: petData.startTime || 0,
        endTime: petData.endTime || 0,
        hourlyRate: petData.hourlyRate || 0,
        image: "https://play-lh.googleusercontent.com/-uTxgOi0Ufauf0q0XM5T70cAESs_xwNIIBL-A24DKCcZnJC4ULbdksk2KvBsnxw0gYDx=w240-h480-rw" // ✅ 고정 이미지 설정
      }));

      console.log("변환된 profiles:", profiles.value);
    } else {
      console.warn("API 응답 데이터가 예상과 다릅니다:", response.data);
    }

  } catch (error) {
    console.error('펫시터 목록을 불러오는 중 오류 발생:', error);
  }
};

// ✅ 필터링 및 정렬된 목록 계산
const filteredProfiles = computed(() => {
  if (!profiles.value.length) return []; // 데이터가 없으면 빈 배열 반환

  return profiles.value
    .filter(profile => profile.city && profile.city.includes(searchKeyword.value)) // undefined 방지
    .sort((a, b) => priceReverse.value ? b.hourlyRate - a.hourlyRate : a.hourlyRate - b.hourlyRate);
});

// ✅ 정렬 토글
const toggleSort = () => {
  priceReverse.value = !priceReverse.value;
};

// ✅ 모달 열기
const openModal = (profile) => {
  selectedProfile.value = profile;
  showModal.value = true;
};

// ✅ 모달 닫기
const closeModal = () => {
  showModal.value = false;
};

const onPayment = () => {
  /* 1. 아임포트(I'mport) SDK 초기화 */
  const { IMP } = window;
  IMP.init('imp57085014'); // 실제 가맹점 식별코드 입력

  /* 2. 사용자 정보 가져오기 */
  let userData = {
    buyer_name: '김민준',
    buyer_tel: '01012341234',
    buyer_email: 'kt2025@naver.com',
  };

  try {
    const response = api.get(`/users/${userId.value}`);
    console.log("✅ 사용자 데이터 응답:", response);
      userData = {
        buyer_name: response.data.result.data.name || userData.buyer_name,
        buyer_tel: response.data.result.data.phoneNumber || userData.buyer_tel,
        buyer_email: response.data.result.data.email || userData.buyer_email,
      };
  } catch (error) {
    console.error("❌ 사용자 데이터를 불러오는 중 오류 발생:", error);
  }

  console.log("여기");
  console.log(userData);
  console.log(userData.buyer_name);

  /* 3. 결제 데이터 설정 */
  const data = {
    pg: 'uplus', // PG사 선택 (이니시스)
    pay_method: 'card', // 결제수단 (카드)
    merchant_uid: `mid_${new Date().getTime()}`, // 주문번호 (고유 값)
    amount: 100, // 결제 금액
    name: '아임포트 결제 테스트', // 주문명
    buyer_name: userData.buyer_name,
    buyer_tel: userData.buyer_tel,
    buyer_email: userData.buyer_email,
    buyer_addr: '신사동 661-16',
    buyer_postcode: '06018',
  };

  console.log("✅ 최종 결제 데이터:", data);

  /* 3. 결제 요청 */
  IMP.request_pay(data, callback);
};

/* 4. 결제 결과 처리 */
const callback = (response) => {
  console.log(response);

  const { success, imp_uid, merchant_uid, apply_num, bank_name, card_name, card_number, card_quota, 
          buyer_name, buyer_tel, buyer_email, buyer_addr, buyer_postcode, currency, paid_amount, 
          paid_at, pay_method, pg_provider, pg_tid, receipt_url, status } = response;

  if (success) {
    alert('결제 성공!');

    // ✅ 서버로 결제 데이터 전송
    api.post(`/payments/${selectedProfile.value.petSitterId}/${userId.value}`, {
      impUid: imp_uid,
      merchantUid: merchant_uid,
      applyNum: apply_num || null,
      bankName: bank_name || null,
      cardName: card_name || null,
      cardNumber: card_number || null,
      cardQuota: card_quota || 0,
      buyerName: buyer_name,
      buyerTel: buyer_tel,
      buyerEmail: buyer_email,
      buyerAddr: buyer_addr,
      buyerPostcode: buyer_postcode,
      currency: currency || "KRW",
      paidAmount: paid_amount,
      paidAt: paid_at || Date.now(),
      payMethod: pay_method,
      pgProvider: pg_provider,
      pgTid: pg_tid || null,
      receiptUrl: receipt_url || null,
      status: status,
    })
    .then(() => {
      alert("결제 내역이 저장되었습니다.");
      closeModal();
    })
    .catch((error) => {
      console.error("결제 데이터 전송 오류:", error);
      alert("결제 데이터 저장에 실패했습니다.");
    });

  }
};


// ✅ 페이지 로드 시 API 호출
onMounted(fetchPetSitterProfiles);
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
  height: 200px;
  object-fit: cover;
  border-radius: 12px 12px 0 0;
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


.modal-profile-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 15px;
}

.add-btn {
  padding: 10px;
  width: 40px;
  height: 40px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-weight: bold;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  margin: 10px auto;
}

.add-btn {
  padding: 10px;
  width: 40px;
  height: 40px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-weight: bold;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  margin: 10px auto;
}

.add-btn:hover {
  transform: rotate(90deg);
  background-color: var(--color-accent1);
}
/* 📌 정렬 버튼 */
.sort-btn {
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-size: 14px;
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
  padding: 20px;
}

.profile-card:hover {
  transform: translateY(-5px);
}

/* 📌 예약 버튼 */
.reserve-btn {
  padding: 12px 24px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 15px;
  width: 100%;
}

.reserve-btn:hover {
  background-color: var(--color-accent1);
}
</style>
