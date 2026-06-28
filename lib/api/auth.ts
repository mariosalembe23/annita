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

export interface LoginPayload {
  username: string;
  password: string;
}

export async function login(payload: LoginPayload) {
  const { data } = await api.post("/auth/login", payload);
  return data;
}

export async function sendVerificationCode(token: string) {
  const { data } = await api.post(
    "/auth/send-verification-code",
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
}

export async function verifyEmailCode(token: string, code: string) {
  const { data } = await api.post(
    "/auth/verify-email",
    { code },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
}
