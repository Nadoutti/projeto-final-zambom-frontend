import axios, { type InternalAxiosRequestConfig } from 'axios';

const EVENTS_BASE = import.meta.env.VITE_EVENTS_API ?? 'http://localhost:8002';
const TICKETS_BASE = import.meta.env.VITE_TICKETS_API ?? 'http://localhost:8000';
const USERS_BASE = import.meta.env.VITE_USERS_API ?? 'http://localhost:8001';

export const TOKEN_STORAGE_KEY = 'zambom-token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
  else localStorage.removeItem(TOKEN_STORAGE_KEY);
}

function attachAuth(config: InternalAxiosRequestConfig) {
  const token = getToken();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
}

export const eventsApi = axios.create({ baseURL: EVENTS_BASE });
export const ticketsApi = axios.create({ baseURL: TICKETS_BASE });
export const usersApi = axios.create({ baseURL: USERS_BASE });

eventsApi.interceptors.request.use(attachAuth);
ticketsApi.interceptors.request.use(attachAuth);
usersApi.interceptors.request.use(attachAuth);
