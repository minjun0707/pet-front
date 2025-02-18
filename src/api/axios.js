import axios from 'axios';
import { useUserStore } from '@/stores/userStore';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // 백엔드 API 기본 주소
});

// 요청을 보내기 전에 JWT 토큰을 자동으로 추가
api.interceptors.request.use(config => {
  const userStore = useUserStore();

  // headers가 존재하지 않으면 생성
  config.headers = config.headers || {};

  // ✅ `/users/sign-up` 요청이면 Authorization 헤더 제외
  if (config.url.includes('/users/sign-up')) {
    console.log("회원가입 요청이므로 Authorization 헤더 제외");
  } else if (userStore.token) {
    // ✅ 그 외 요청에는 Authorization 헤더 추가
    config.headers.Authorization = `Bearer ${userStore.token}`;
  }

  return config;
}, error => {
  return Promise.reject(error);
});





export default api;
 