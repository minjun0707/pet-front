import { createApp } from 'vue';
import { createPinia } from 'pinia'; // ✅ Pinia 추가
import App from './App.vue';
import router from './router';
import './assets/global.css'; // ✅ 공통 CSS 추가

const app = createApp(App);
const pinia = createPinia(); // ✅ Pinia 생성

app.use(pinia); // ✅ Pinia 등록
app.use(router);
app.mount('#app');
