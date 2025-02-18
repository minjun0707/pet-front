<template>
    <div class="main-layout">
      <div class="content-container">
        <div class="main-content">
          <h2 class="section-title">💳 결제 내역</h2>
  
          <div class="payment-grid">
            <div v-for="payment in payments" :key="payment.merchantUid" class="payment-card">
              <div class="payment-header">
                <h3>📌 주문 번호: {{ payment.merchantUid }}</h3>
              </div>
  
              <div class="payment-details">
                <p>💰 결제 금액: <strong>{{ payment.paidAmount.toLocaleString() }} 원</strong></p>
                <p>🕒 결제 시간: {{ formatDate(payment.paidAt) }}</p>
                <p>💳 결제 방법: {{ payment.payMethod }}</p>
                <p>🏦 PG사: {{ payment.pgProvider }}</p>
                <p>🔢 거래 번호: {{ payment.pgTid }}</p>
              </div>
  
              <div class="card-info" v-if="payment.cardName">
                <h4>💳 카드 정보</h4>
                <p>카드사: {{ payment.cardName }}</p>
                <p>카드번호: {{ maskCardNumber(payment.cardNumber) }}</p>
                <p>할부 개월 수: {{ payment.cardQuota === 0 ? "일시불" : `${payment.cardQuota}개월` }}</p>
              </div>
  
              <div class="buyer-info">
                <h4>👤 구매자 정보</h4>
                <p>이름: {{ payment.buyerName }}</p>
                <p>📞 연락처: {{ payment.buyerTel }}</p>
                <p>✉️ 이메일: {{ payment.buyerEmail }}</p>
              </div>
  
              <a v-if="payment.receiptUrl" :href="payment.receiptUrl" target="_blank" class="receipt-link">
                🧾 영수증 보기
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import api from '@/api/axios';
  import { useUserStore } from '@/stores/userStore';
  
  const userStore = useUserStore();
  const userId = computed(() => userStore.userId);
  const payments = ref([]);
  
  // ✅ 사용자 결제 내역 불러오기
  const fetchPayments = async () => {
    try {
      const response = await api.get(`/payments/${userId.value}`);
      console.log("결제 내역 응답:", response.data);
      
      if (response.data) {
        payments.value = Array.isArray(response.data) ? response.data : [response.data];
      } else {
        console.warn("결제 내역이 없습니다.");
      }
    } catch (error) {
      console.error("결제 내역을 불러오는 중 오류 발생:", error);
    }
  };
  
  // ✅ 날짜 포맷팅 (Unix Timestamp → YYYY-MM-DD HH:mm)
  const formatDate = (timestamp) => {
    if (!timestamp) return "알 수 없음";
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };
  
  // ✅ 카드번호 마스킹
  const maskCardNumber = (cardNumber) => {
    if (!cardNumber) return "정보 없음";
    return cardNumber.replace(/\d(?=\d{4})/g, "*");
  };
  
  // ✅ 페이지 로드 시 결제 내역 불러오기
  onMounted(fetchPayments);
  </script>
  
  <style scoped>
  /* 📌 메인 레이아웃 */
  .main-layout {
    width: 800px;
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
  
  /* 📌 섹션 제목 */
  .section-title {
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 20px;
    color: var(--color-primary);
  }
  
  /* 📌 결제 내역 그리드 */
  .payment-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
    margin-bottom: 40px;
  }
  
  /* 📌 결제 카드 */
  .payment-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: transform 0.2s;
  }
  
  .payment-card:hover {
    transform: translateY(-5px);
  }
  
  /* 📌 결제 카드 헤더 */
  .payment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .payment-header h3 {
    font-size: 16px;
    color: var(--color-secondary);
  }
  
  /* 📌 결제 정보 */
  .payment-details, .buyer-info, .card-info {
    font-size: 14px;
    color: #555;
  }
  
  .payment-details p, .buyer-info p, .card-info p {
    margin: 5px 0;
  }
  
  /* 📌 카드 정보 */
  .card-info h4 {
    margin-top: 15px;
    color: var(--color-primary);
  }
  
  /* 📌 영수증 링크 */
  .receipt-link {
    display: block;
    margin-top: 10px;
    text-align: right;
    color: var(--color-primary);
    font-weight: bold;
    text-decoration: none;
  }
  
  .receipt-link:hover {
    text-decoration: underline;
  }
  </style>
  