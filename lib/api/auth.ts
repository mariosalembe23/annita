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

export interface CheckUsernameResponse {
  available: boolean;
}

export async function checkUsername(username: string) {
  const { data } = await api.get<CheckUsernameResponse>("/auth/check-username", {
    params: { username },
  });
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

export interface GoogleAuthResponse {
  token: string;
}

/**
 * Exchange a Google ID token for an application JWT.
 * The backend validates the Google ID token server-side and returns its own JWT.
 */
export async function loginWithGoogle(idToken: string) {
  const { data } = await api.post<GoogleAuthResponse>("/auth/google", {
    idToken,
  });
  return data;
}

