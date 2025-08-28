<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

axios.defaults.baseURL = "http://localhost/api";

interface Application {
  id: string;
  name: string;
  url: string;
  author: string;
  logo: string;
  created_at: string;
  updated_at: string;
}

interface Status {
  id: string;
  status: string;
  status_code: number;
  response_time_ms: number;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

const CACHE_KEY_APPS = 'cached_applications';
const CACHE_KEY_STATUSES = 'cached_statuses';
const CACHE_EXPIRY_MINUTES = 5;

const applications = ref<Application[]>([]);
const lastStatuses = ref<Record<string, Status | null>>({});

const isCacheValid = (cacheTime: string | null): boolean => {
  if (!cacheTime) return false;
  const now = new Date();
  const cachedAt = new Date(cacheTime);
  const diffMinutes = (now.getTime() - cachedAt.getTime()) / (1000 * 60);
  return diffMinutes < CACHE_EXPIRY_MINUTES;
};

const loadApplications = async () => {
  const cachedApps = localStorage.getItem(CACHE_KEY_APPS);
  const cachedTime = localStorage.getItem(`${CACHE_KEY_APPS}_time`);

  if (cachedApps && isCacheValid(cachedTime)) {
    applications.value = JSON.parse(cachedApps);
    const cachedStatuses = localStorage.getItem(CACHE_KEY_STATUSES);
    if (cachedStatuses) {
      lastStatuses.value = JSON.parse(cachedStatuses);
    }
  } else {
    await getApplications();
  }
};

const getApplications = async () => {
  try {
    const response = await axios.get('/application');
    applications.value = response.data;
    localStorage.setItem(CACHE_KEY_APPS, JSON.stringify(response.data));
    localStorage.setItem(`${CACHE_KEY_APPS}_time`, new Date().toISOString());
    await Promise.all(
      response.data.map((app: Application) => getLastStatus(app.id))
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des applications :", error);
  }
};

const getLastStatus = async (appId: string) => {
  const cachedStatuses = localStorage.getItem(CACHE_KEY_STATUSES);
  const cachedTime = localStorage.getItem(`${CACHE_KEY_STATUSES}_time`);

  if (cachedStatuses && isCacheValid(cachedTime)) {
    const statuses = JSON.parse(cachedStatuses);
    if (statuses[appId]) {
      lastStatuses.value[appId] = statuses[appId];
      return;
    }
  }

  try {
    const response = await axios.get(`/application/${appId}/statuses`);
    const statuses = response.data.data;
    if (statuses.length > 0) {
      const sortedStatuses = statuses.sort((a: Status, b: Status) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      lastStatuses.value[appId] = sortedStatuses[0];
      const currentStatuses = JSON.parse(localStorage.getItem(CACHE_KEY_STATUSES) || '{}');
      currentStatuses[appId] = sortedStatuses[0];
      localStorage.setItem(CACHE_KEY_STATUSES, JSON.stringify(currentStatuses));
      localStorage.setItem(`${CACHE_KEY_STATUSES}_time`, new Date().toISOString());
    } else {
      lastStatuses.value[appId] = null;
    }
  } catch (error) {
    console.error(`Erreur pour l'application ${appId} :`, error);
    lastStatuses.value[appId] = null;
  }
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
        <ul class="h-max flex flex-row gap-4 flex-wrap justify-center items-center">
          <li v-for="app in applications" :key="app.id" class="bg-secondary text-foreground p-4 rounded-sm w-full not-sm:mx-4 lg:w-2/7 border border-primary hover:scale-105 transition-transform">
            <div class="relative flex flex-col gap-2">

              <div class="absolute top-0 right-0 flex gap-2 items-baseline">
                <p>{{ lastStatuses[app.id]?.status || 'N/A' }}</p>
                <div v-if="lastStatuses[app.id]?.status == 'down'" class="size-3 bg-destructive"></div>
                <div v-if="lastStatuses[app.id]?.status == 'up'" class="size-3 bg-success"></div>
                <div v-if="lastStatuses[app.id]?.status == 'maintenance'" class="size-3 bg-warning"></div>
              </div>

              <div class="flex gap-2 items-center">
                <img width="56" height="56" :src="app.logo" alt="logo"
                  class="size-18 bg-primary text-primary-foreground">
                <div>
                  <h3 class="text-xl font-semibold">{{ app.name }}</h3>
                  <p class="text-sm font-medium">{{ app.author }}</p>
                </div>
              </div>

              <div class="flex flex-row items-center justify-between">
                <p class="text-xs">Last checked :
                  {{ lastStatuses[app.id]?.created_at ? new Date(lastStatuses[app.id]!.created_at).toLocaleString() : 'Never' }}
              </p>
                <a target="_blank" class="text-sm hover:text-primary underline" :href="app.url">website</a>
              </div>

            </div>
          </li>
        </ul>
      </div>
    </section>
  </main>

</template>
