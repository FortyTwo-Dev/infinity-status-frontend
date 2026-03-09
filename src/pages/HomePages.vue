<script setup lang="ts">
import { onMounted } from 'vue';
import { useApplicationStore } from '@/store/ApplicationStore';
import { useDateFormatter } from '@/composables/useDateFormatter';

const applicationStore = useApplicationStore();

const loadApplications = async () => {
  await applicationStore.getApplications();
};

onMounted(() => {
  loadApplications();
});
</script>

<template>
  <main class="flex-grow w-full h-full bg-background py-4">
    <section class="text-foreground bg-background p-14">
      <h2 class="text-4xl font-semibold text-center">The status of applications</h2>
    </section>
    
    <section class="flex flex-row items-center justify-center">
      <div class="relative container w-full h-full">
        <ul v-if="!applicationStore.isLoading" class="h-max flex flex-row gap-4 flex-wrap justify-center items-center">
          <li v-for="app in applicationStore.applications" :key="app.id" class="bg-secondary text-foreground p-4 rounded-sm w-full not-sm:mx-4 lg:w-2/7 border border-primary hover:scale-105 transition-transform">
            <div class="relative flex flex-col gap-2">

              <div class="absolute top-0 right-0 flex gap-2 items-baseline">
                <p class="text-sm">{{ app.avg_http_code || 'N/A' }}</p>
                <div v-if="app.status == 'down'" class="size-3 bg-destructive"></div>
                <div v-if="app.status == 'up'" class="size-3 bg-success"></div>
                <div v-if="app.status == 'maintenance'" class="size-3 bg-warning"></div>
              </div>

              <div class="flex gap-2 items-center">
                <img width="56" height="56" :src="app.logo_url" alt="logo"
                  class="aspect-auto object-contain p-2 size-18 bg-primary/15 text-primary-foreground">
                <div>
                  <h3 class="text-xl font-semibold">{{ app.name }}</h3>
                  <p class="text-sm font-medium">{{ app.author }}</p>
                </div>
              </div>

              <div class="flex flex-row items-center justify-between">
                <p class="text-xs">Last checked :
                  {{ useDateFormatter(app.last_checked_at!) }}
              </p>
                <a target="_blank" class="text-sm hover:text-primary underline" :href="app.url">API</a>
              </div>

            </div>
          </li>
        </ul>
      </div>
    </section>
  </main>

</template>
