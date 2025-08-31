<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style scoped lang="scss">
.page-enter-active {
  transition: all 0.2s ease-out;
}

.page-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.page-enter-from,
.page-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
