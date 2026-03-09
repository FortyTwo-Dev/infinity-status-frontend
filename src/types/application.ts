// types/application.ts
export interface ApiResponse<T> {
  data: T[];
}

// Application
export interface Application {
  id: number;
  name: string;
  author: string;
  url: string;
  logo_url: string;
  http_codes?: number[];
  avg_http_code: number;
  status: 'up' | 'down' | 'maintenance';
  last_checked_at?: string;
  api?: Api[];
}

// API
export interface Api {
  api_id: string;
  name: string;
  url: string;
  last_http_status?: number | null;
  statuses?: ApiStatus[];
}

export interface ApiStatus {
  status: string;
  code: number;
  response_time_ms: number;
  checked_at: string;
}