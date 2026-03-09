import { useApiStatus } from "@/composables/useApiStatus";
import api from "@/services/api";
import type { ApiResponse, Application } from "@/types/application"
import { defineStore } from "pinia"
import { ref } from "vue"

export const useApplicationStore = defineStore('application', () => {

  const applications = ref<Application[]>([]);
  const isLoading = ref<Boolean>(false);
  const error = ref<string | null>(null);

  const getApplications = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.get<ApiResponse<Application>>('/application');
      applications.value = response.data.data;
      useApiStatus();
    } catch (err) {
      error.value = "Erreur lors de la récupération des applications";
      console.error(error.value, err);
    } finally {
      isLoading.value = false;
    }
  }

  
  return {
    applications,
    isLoading,
    error,
    getApplications,
  };
})