import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/global.css'; // ✅ 공통 CSS 추가

const app = createApp(App);
app.use(router);
app.mount('#app');
