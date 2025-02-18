import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: localStorage.getItem('userId') || null, 
    name: localStorage.getItem('name') || null,
    token: localStorage.getItem('token') || null, 
  }),
  getters: {
    getUserId: (state) => state.userId, // ✅ computed 불필요
  },
  actions: {
    setUser(userId, name, token) {
      this.userId = userId;
      this.name = name;
      this.token = token;
      
      localStorage.setItem('userId', userId);
      localStorage.setItem('name', name);
      localStorage.setItem('token', token);
    },
    logout() {
      this.userId = null;
      this.name = null;
      this.token = null;
      
      localStorage.removeItem('userId');
      localStorage.removeItem('name');
      localStorage.removeItem('token');
    },
  },
});
