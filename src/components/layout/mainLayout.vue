<template>
  <div class="main-layout">
    <TopBar />
    <div class="content-container">
      <SideMenu />
      <div class="main-content">
        <router-view />  <!-- 🔹 여기가 변경되는 부분 -->
      </div>
    </div>
  </div>
</template>

<script setup>
import TopBar from '@/components/layout/topBar.vue';
import SideMenu from '@/components/layout/sideMenu.vue';
</script>

<style scoped>
.main-layout {
  width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  font-family: 'Nanum Square Round', sans-serif;
}

.content-container {
  display: flex;
  min-height: calc(100vh - 60px);
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: #f9f9f9;
}
</style>
