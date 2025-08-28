<script setup lang="ts">
import Theme from '@components/Theme.vue';
const appVersion = __APP_VERSION__;
</script>

<template>
  <header class="w-full bg-secondary text-foreground py-6 px-6">
    <div class="flex flex-row items-center justify-center">
      <div class="relative container w-full h-full">
        <h1 class="text-xl font-semibold">Infinity Status</h1>
        <Theme/>
      </div>
    </div>
  </header>
  <RouterView />
    <footer class="bg-secondary text-foreground not-lg:pb-18 py-6 w-full h-full flex gap-2 items-center justify-center text-center">
      <h4 class="text-lg font-semibold">Infinity Status</h4> 
      <p>- {{ new Date().getFullYear() }} -</p> 
      <a href="https://github.com/FortyTwo-Dev/infinity-status-frontend" class=" hover:text-primary">Github</a>
      <p>- V {{ appVersion }}</p> 
    </footer>
</template>
