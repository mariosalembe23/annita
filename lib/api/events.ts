import api from "../api";

export interface ApiEventCategory {
  id: string;
  name: string;
  groupName: string;
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
