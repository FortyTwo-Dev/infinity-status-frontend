import { useApplicationStore } from "@/store/ApplicationStore";

export function useApiStatus() {
    const applicationStore = useApplicationStore();
    applicationStore.applications.forEach((application, index) => {        
        const http_codes = application.http_codes || [0];
        var total = 0;
    
        for (let index = 0; index < http_codes.length; index++) {
            total += http_codes[index];
        }
    
        applicationStore.applications[index].avg_http_code = total;

        if (total >= 200 && total < 300) {
            application.status = 'up';
        } else if (total >= 400) {
            application.status = 'down';
        } else if (total == 503) {
            application.status = 'maintenance';
        }
    });
}