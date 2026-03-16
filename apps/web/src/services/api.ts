import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  mockPackages,
  mockVersions,
  mockClients,
  mockDeployments,
  mockDeploymentClientStatuses,
  mockLogs,
  mockDashboardStats,
  mockDownloadActivity,
  mockClientStatusBreakdown,
  mockInstalledPackages,
  mockSigningKeys,
  mockAdminUsers,
  mockPlatformSettings,
} from "@/mocks";

const isMock = import.meta.env.VITE_USE_MOCK === "true";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

// Attach auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth-token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock-data fallback table keyed by URL pattern
interface MockRoute {
  pattern: RegExp;
  handler: (url: string) => unknown;
}

const mockRoutes: MockRoute[] = [
  { pattern: /^\/api\/dashboard\/stats$/, handler: () => mockDashboardStats },
  { pattern: /^\/api\/dashboard\/downloads$/, handler: () => mockDownloadActivity },
  { pattern: /^\/api\/dashboard\/client-status$/, handler: () => mockClientStatusBreakdown },
  { pattern: /^\/api\/packages\/([^/]+)\/versions$/, handler: () => mockVersions },
  { pattern: /^\/api\/packages\/([^/]+)$/, handler: (url) => {
    const id = url.split("/").pop();
    return mockPackages.find((p) => p.id === id) ?? mockPackages[0];
  }},
  { pattern: /^\/api\/packages$/, handler: () => mockPackages },
  { pattern: /^\/api\/clients\/([^/]+)\/packages$/, handler: () => mockInstalledPackages },
  { pattern: /^\/api\/clients\/([^/]+)$/, handler: (url) => {
    const id = url.split("/").pop();
    return mockClients.find((c) => c.id === id) ?? mockClients[0];
  }},
  { pattern: /^\/api\/clients$/, handler: () => mockClients },
  { pattern: /^\/api\/deployments\/([^/]+)\/clients$/, handler: () => mockDeploymentClientStatuses },
  { pattern: /^\/api\/deployments\/([^/]+)$/, handler: (url) => {
    const id = url.split("/").pop();
    return mockDeployments.find((d) => d.id === id) ?? mockDeployments[0];
  }},
  { pattern: /^\/api\/deployments$/, handler: () => mockDeployments },
  { pattern: /^\/api\/logs$/, handler: () => mockLogs },
  { pattern: /^\/api\/settings$/, handler: () => mockPlatformSettings },
  { pattern: /^\/api\/settings\/keys$/, handler: () => mockSigningKeys },
  { pattern: /^\/api\/settings\/users$/, handler: () => mockAdminUsers },
];

function resolveMock(url: string): unknown | undefined {
  for (const route of mockRoutes) {
    if (route.pattern.test(url)) {
      return route.handler(url);
    }
  }
  return undefined;
}

// Response interceptor: on failure in mock mode, return mock data
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isMock) {
      const url: string = error?.config?.url ?? "";
      const data = resolveMock(url);
      if (data !== undefined) {
        return Promise.resolve({ data, status: 200, statusText: "OK (mock)" } as AxiosResponse);
      }
    }
    return Promise.reject(error);
  },
);

/* Typed helpers */
export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  if (isMock) {
    const data = resolveMock(url);
    if (data !== undefined) return data as T;
  }
  const res = await api.get<T>(url, config);
  return res.data;
}

export async function apiPost<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
  if (isMock) {
    const data = resolveMock(url);
    if (data !== undefined) return data as T;
  }
  const res = await api.post<T>(url, body, config);
  return res.data;
}

export async function apiPut<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
  if (isMock) {
    const data = resolveMock(url);
    if (data !== undefined) return data as T;
  }
  const res = await api.put<T>(url, body, config);
  return res.data;
}

export async function apiDelete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  if (isMock) {
    const data = resolveMock(url);
    if (data !== undefined) return data as T;
  }
  const res = await api.delete<T>(url, config);
  return res.data;
}

export default api;
