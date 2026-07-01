import api from "../api";

export interface ApiEventCategory {
  id: string;
  name: string;
  groupName: string;
  createdAt: string;
}

export type EventModality = "PRESENTIAL" | "REMOTE" | "HYBRID";
export type EventType = "PAID" | "FREE";
export type EventStatus = "PENDING" | "APPROVED" | "REJECTED" | "REPORTED";

export interface ApiEvent {
  id: string;
  title: string;
  description: string;
  link: string;
  category: ApiEventCategory;
  modality: EventModality[];
  startDate: string;
  type: EventType;
  coverImage: string;
  status: EventStatus;
  createdById: string;
  createdByUsername: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventsMeta {
  page: number;
  perPage: number;
  totalElements: number;
  totalPages: number;
}

export interface EventsResponse {
  data: ApiEvent[];
  meta: EventsMeta;
}

export interface EventsFilters {
  search?: string;
  categoryId?: string;
  modality?: EventModality;
  type?: EventType;
  page?: number;
  per_page?: number;
}

export async function getEvents(filters: EventsFilters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.categoryId) params.set("categoryId", filters.categoryId);
  if (filters.modality) params.set("modality", filters.modality);
  if (filters.type) params.set("type", filters.type);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.per_page) params.set("per_page", String(filters.per_page));

  const { data } = await api.get<EventsResponse>("/events", { params });
  return data;
}

export interface CreateEventPayload {
  title: string;
  description: string;
  link: string;
  categoryId: string;
  modality: EventModality;
  startDate: string;
  type: EventType;
  coverImage: string;
}

export async function createEvent(payload: CreateEventPayload, token: string) {
  const { data } = await api.post<ApiEvent>("/events", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export interface CategoriesResponse {
  data: ApiEventCategory[];
  meta: EventsMeta;
}

export async function getCategories(token: string, page = 1, perPage = 10) {
  const { data } = await api.get<CategoriesResponse>("/categories", {
    headers: { Authorization: `Bearer ${token}` },
    params: { page, perPage },
  });
  return data;
}

export interface CreateCategoryPayload {
  name: string;
  groupName: string;
}

export async function createCategory(payload: CreateCategoryPayload, token: string) {
  const { data } = await api.post<ApiEventCategory>("/categories", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export interface EventsAdminFilters extends EventsFilters {
  status?: EventStatus;
}

export async function getEventsAdmin(
  filters: EventsAdminFilters = {},
  token?: string,
) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.categoryId) params.set("categoryId", filters.categoryId);
  if (filters.modality) params.set("modality", filters.modality);
  if (filters.type) params.set("type", filters.type);
  if (filters.status) params.set("status", filters.status);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.per_page) params.set("per_page", String(filters.per_page));

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const { data } = await api.get<EventsResponse>("/events/admin", {
    params,
    headers,
  });
  return data;
}
