import { isAxiosError } from "axios";
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
  upvoteCount: number;
  downvoteCount: number;
  coverImage: string;
  status: EventStatus;
  createdById: string;
  location: string;
  createdByUsername: string;
  createdAt: string;
  updatedAt: string;
  userVote?: "UPVOTE" | "DOWNVOTE" | null;
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

const onlyApproved = (response: EventsResponse): EventsResponse => ({
  ...response,
  data: (response.data ?? []).filter((event) => event.status === "APPROVED"),
});

export async function getEvents(filters: EventsFilters = {}, token?: string) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.categoryId) params.set("categoryId", filters.categoryId);
  if (filters.modality) params.set("modality", filters.modality);
  if (filters.type) params.set("type", filters.type);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.per_page) params.set("per_page", String(filters.per_page));

  if (token) {
    try {
      const { data } = await api.get<EventsResponse>("/events", {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      return onlyApproved(data);
    } catch (error) {
      // Um token inválido/expirado não deve esconder a listagem pública
      if (!isAxiosError(error) || error.response?.status !== 401) throw error;
    }
  }

  const { data } = await api.get<EventsResponse>("/events", { params });
  return onlyApproved(data);
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

export async function getMyEvents(token: string) {
  const { data } = await api.get<EventsResponse>("/events/my", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function createEvent(payload: CreateEventPayload, token: string) {
  const { data } = await api.post<ApiEvent>("/events", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export interface ReportEventPayload {
  reason: string;
  description: string;
}

export async function reportEvent(
  id: string,
  payload: ReportEventPayload,
  token?: string,
) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const { data } = await api.post(`/events/${id}/report`, payload, {
    headers,
  });
  return data;
}

export interface ReportItem {
  id: string;
  eventId: string;
  eventTitle: string;
  reason: string;
  createdAt: string;
}

export interface ReportsResponse {
  data: ReportItem[];
  meta: {
    page: number;
    perPage: number;
    totalElements: number;
    totalPages: number;
  };
}

export async function getMyReports(token: string, page = 1, perPage = 10) {
  const { data } = await api.get<ReportsResponse>("/reports/my", {
    params: { page, perPage },
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export type UpdateEventPayload = CreateEventPayload;

export async function approveEvent(id: string, token: string) {
  const { data } = await api.put<ApiEvent>(
    `/events/${id}/approve`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
}

export async function rejectEvent(id: string, token: string) {
  const { data } = await api.put<ApiEvent>(
    `/events/${id}/reject`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
}

export async function updateEvent(
  id: string,
  payload: UpdateEventPayload,
  token: string,
) {
  const { data } = await api.put<ApiEvent>(`/events/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export interface CategoriesResponse {
  data: ApiEventCategory[];
  meta: EventsMeta;
}

export async function getCategories(
  token: string,
  page = 1,
  perPage = 10,
  search?: string,
) {
  const { data } = await api.get<CategoriesResponse>("/categories", {
    headers: { Authorization: `Bearer ${token}` },
    params: { page, per_page: perPage, ...(search ? { search } : {}) },
  });
  return data;
}

export interface CategoryGroup {
  groupName: string;
  categories: { id: string; name: string }[];
}

export async function getCategoriesByGroup(token: string) {
  const { data } = await api.get<CategoryGroup[] | { data: CategoryGroup[] }>(
    "/categories/by-group",
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return Array.isArray(data)
    ? data
    : ((data as { data: CategoryGroup[] }).data ?? []);
}

export interface CreateCategoryPayload {
  name: string;
  groupName: string;
}

export async function createCategory(
  payload: CreateCategoryPayload,
  token: string,
) {
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

export async function getEventDetails(id: string, token?: string) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const { data } = await api.get<ApiEvent>(`/events/${id}/details`, {
    headers,
  });
  return data;
}

export interface VoteEventPayload {
  type: "UPVOTE" | "DOWNVOTE";
}

export async function voteEvent(
  id: string,
  payload: VoteEventPayload,
  token: string,
) {
  const { data } = await api.post(`/events/${id}/vote`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function deleteEvent(id: string, token: string) {
  const { data } = await api.delete(`/events/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
