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
  const { data } = await api.post<RegisterResponse>("/auth/register", payload);
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

export async function getUser(id: string, token: string) {
  const { data } = await api.get<UserData>(`/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
