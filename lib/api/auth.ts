import api from "../api";

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  receiveNotifications: boolean;
}

export interface RegisterResponse {
  id: string;
  username: string;
  email: string;
}

export async function register(payload: RegisterPayload) {
  const { data } = await api.post<RegisterResponse>(
    "/auth/register",
    payload
  );
  return data;
}
