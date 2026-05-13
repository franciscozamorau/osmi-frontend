// src/lib/api.ts — Cliente HTTP para el backend gRPC-Gateway

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8083";

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: any;
  token?: string;
}

async function request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token } = options;
  const url = `${API_URL}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    next: {
      revalidate: 60,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ API Error [${method} ${endpoint}]:`, response.status, errorText);
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  const data = await response.json();
  return data as T;
}

export const api = {
  get: <T = any>(endpoint: string, token?: string) =>
    request<T>(endpoint, { method: "GET", token }),

  post: <T = any>(endpoint: string, body?: any, token?: string) =>
    request<T>(endpoint, { method: "POST", body, token }),

  patch: <T = any>(endpoint: string, body?: any, token?: string) =>
    request<T>(endpoint, { method: "PATCH", body, token }),

  delete: <T = any>(endpoint: string, token?: string) =>
    request<T>(endpoint, { method: "DELETE", token }),
};

export default api;
