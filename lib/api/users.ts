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

export async function getUsers(token: string) {
  const { data } = await api.get<UsersResponse | { data: UserData[] }>(
    "/users",
    {
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
