import axios, { AxiosError } from 'axios';
import type {
  AuthResponse,
  Category,
  CategoryFormValues,
  DashboardStats,
  EventFormValues,
  EventItem,
  MessageResponse,
  PagedResponse,
  Role,
  User,
} from '../types';

export const TOKEN_KEY = 'holistics.token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
    }
    return Promise.reject(error);
  },
);

export function extractErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message ?? error.message ?? fallback;
  }
  return fallback;
}

interface EventQuery {
  categoryId?: number;
  search?: string;
  page?: number;
  size?: number;
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }).then((r) => r.data),
  register: (name: string, email: string, password: string) =>
    api.post<AuthResponse>('/auth/register', { name, email, password }).then((r) => r.data),
  me: () => api.get<User>('/auth/me').then((r) => r.data),
};

export const eventsApi = {
  list: (query: EventQuery = {}) =>
    api
      .get<PagedResponse<EventItem>>('/events', { params: query })
      .then((r) => r.data),
  getBySlug: (slug: string) => api.get<EventItem>(`/events/${slug}`).then((r) => r.data),
  rsvp: (slug: string, name: string, email: string) =>
    api.post<MessageResponse>(`/events/${slug}/rsvp`, { name, email }).then((r) => r.data),
};

export const categoriesApi = {
  list: () => api.get<Category[]>('/categories').then((r) => r.data),
};

export const adminEventsApi = {
  list: () => api.get<EventItem[]>('/admin/events').then((r) => r.data),
  get: (id: number) => api.get<EventItem>(`/admin/events/${id}`).then((r) => r.data),
  create: (values: EventFormValues) =>
    api.post<EventItem>('/admin/events', values).then((r) => r.data),
  update: (id: number, values: EventFormValues) =>
    api.put<EventItem>(`/admin/events/${id}`, values).then((r) => r.data),
  remove: (id: number) => api.delete(`/admin/events/${id}`).then(() => undefined),
};

export const adminCategoriesApi = {
  list: () => api.get<Category[]>('/admin/categories').then((r) => r.data),
  create: (values: CategoryFormValues) =>
    api.post<Category>('/admin/categories', values).then((r) => r.data),
  update: (id: number, values: CategoryFormValues) =>
    api.put<Category>(`/admin/categories/${id}`, values).then((r) => r.data),
  remove: (id: number) => api.delete(`/admin/categories/${id}`).then(() => undefined),
};

export const adminUsersApi = {
  list: () => api.get<User[]>('/admin/users').then((r) => r.data),
  updateRole: (id: number, role: Role) =>
    api.patch<User>(`/admin/users/${id}/role`, { role }).then((r) => r.data),
};

export const adminDashboardApi = {
  stats: () => api.get<DashboardStats>('/admin/dashboard/stats').then((r) => r.data),
};

export default api;
