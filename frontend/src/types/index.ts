export type Role = 'USER' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  color: string;
  eventCount?: number | null;
}

export interface EventItem {
  id: number;
  title: string;
  slug: string;
  summary?: string | null;
  description: string;
  location: string;
  imageUrl?: string | null;
  startTime: string;
  endTime: string;
  capacity: number;
  price: number;
  published: boolean;
  category: Category;
  attendeeCount: number;
  spotsLeft?: number | null;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface DashboardStats {
  totalEvents: number;
  publishedEvents: number;
  totalCategories: number;
  totalUsers: number;
  totalAttendees: number;
  upcomingEvents: number;
}

export interface MessageResponse {
  message: string;
}

export interface EventFormValues {
  title: string;
  summary: string;
  description: string;
  location: string;
  imageUrl: string;
  startTime: string;
  endTime: string;
  capacity: number;
  price: number;
  published: boolean;
  categoryId: number;
}

export interface CategoryFormValues {
  name: string;
  description: string;
  color: string;
}
