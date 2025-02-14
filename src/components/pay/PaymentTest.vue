<template>
    <div>
      <button @click="onPayment">결제하기</button>
    </div>
  </template>
  
  <script setup>
  const onPayment = () => {
    /* 1. 가맹점 식별 */
    const { IMP } = window;
    IMP.init('imp57085014'); // 고객사 식별 코드 (실제 결제 시 변경 필요)
  
    /* 2. 결제 데이터 정의 */
    const data = {
      pg: 'uplus', // PG사 (결제 서비스 제공 업체)
      pay_method: 'card', // 결제 수단
      merchant_uid: `mid_${new Date().getTime()}`, // 주문번호 (고유값)
      amount: 1000, // 결제 금액 (원)
      name: '아임포트 결제 테스트', // 주문명
      buyer_name: '홍길동', // 구매자 이름
      buyer_tel: '01012341234', // 구매자 전화번호
      buyer_email: 'baroq8@gmail.com', // 구매자 이메일
      buyer_addr: '서울특별시 강남구 신사동 661-16', // 구매자 주소
      buyer_postcode: '06018' // 구매자 우편번호
    };
  
    /* 3. 결제 창 호출 */
    IMP.request_pay(data, callback);
  };
  
  /* 4. 결제 결과 콜백 함수 */
  const callback = (response) => {
    const { success, error_msg } = response;
    console.log(response);
  
    if (success) {
      alert('결제 성공');
    } else {
      alert(`결제 실패: ${error_msg}`);
    }
  };
  </script>
  