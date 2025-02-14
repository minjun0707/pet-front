<template>
  <transition name="fade" mode="out-in">
    <router-view />
  </transition>
</template>

<script setup>
</script>

<style>
:root {
  --color-primary: #f4acb7;
  --color-secondary: #9d8189;
  --color-accent1: #ffcad4;
  --color-accent2: #ffe5d9;
  --color-accent3: #d8e2dc;
}

/* 📌 페이지 전환 애니메이션 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* 기존 스타일 유지 */
</style>
