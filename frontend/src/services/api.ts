import { VerifyResponse, HistoryListResponse, HealthResponse } from '../types/verification';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/api/v1`
  : '/api/v1';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'X-Request-Source': 'truthlens-web',
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      let errorMsg = `Server error (${res.status})`;
      try {
        const errJson = await res.json();
        if (errJson.detail) {
          if (typeof errJson.detail === 'string') {
            errorMsg = errJson.detail;
          } else if (Array.isArray(errJson.detail)) {
            errorMsg = errJson.detail.map((d: any) => d.msg || JSON.stringify(d)).join(', ');
          }
        }
      } catch {
        // use default error message
      }
      throw new ApiError(errorMsg, res.status);
    }
    return await res.json() as T;
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(
      'Unable to connect to TruthLens AI verification backend. Please ensure the server is running.',
      0
    );
  }
}

export const api = {
  async verifyClaim(claim: string): Promise<VerifyResponse> {
    return request<VerifyResponse>('/verify', {
      method: 'POST',
      body: JSON.stringify({ claim }),
    });
  },

  async getHealth(): Promise<HealthResponse> {
    return request<HealthResponse>('/health');
  },

  async getHistory(limit: number = 50): Promise<HistoryListResponse> {
    return request<HistoryListResponse>(`/history?limit=${limit}`);
  },

  async getHistoryItem(id: string): Promise<VerifyResponse> {
    return request<VerifyResponse>(`/history/${id}`);
  },

  async deleteHistoryItem(id: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/history/${id}`, {
      method: 'DELETE',
    });
  }
};
