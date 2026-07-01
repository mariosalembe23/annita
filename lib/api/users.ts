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
