import api from "../api";

export interface UserData {
  id: string;
  username: string;
  email: string;
  role: "CONTRIBUTOR" | "MODERATOR" | "ADMIN";
  receiveNotifications: boolean;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  emailVerified: boolean;
}

export interface UsersMeta {
  page: number;
  perPage: number;
  totalElements: number;
  totalPages: number;
}

export interface UsersResponse {
  data: UserData[];
  meta: UsersMeta;
}

export interface UsersFilters {
  search?: string;
  role?: string;
  isActive?: boolean;
  page?: number;
  perPage?: number;
}

export async function getUsers(token: string, filters: UsersFilters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.role) params.set("role", filters.role);
  if (filters.isActive !== undefined) params.set("isActive", String(filters.isActive));
  if (filters.page) params.set("page", String(filters.page));
  if (filters.perPage) params.set("per_page", String(filters.perPage));

  const { data } = await api.get<UsersResponse | { data: UserData[] }>(
    "/users",
    {
      params,
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return data;
}

export interface UpdateUserPayload {
  username: string;
  email: string;
  password?: string;
  receiveNotifications: boolean;
}

export async function updateUser(
  id: string,
  payload: UpdateUserPayload,
  token: string,
) {
  const { data } = await api.put<UserData>(`/users/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function deleteUser(id: string, token: string) {
  const { data } = await api.delete(`/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
