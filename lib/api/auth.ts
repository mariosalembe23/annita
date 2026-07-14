import api from "../api";

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  receiveNotifications: boolean;
  role?: "CONTRIBUTOR" | "MODERATOR" | "ADMIN" | "COMPANY";
  companyName?: string;
  companyNif?: string;
  companyPhone?: string;
  companyAddress?: string;
  companyWebsite?: string;
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
  const { data } = await api.get<CheckUsernameResponse>(
    "/auth/check-username",
    {
      params: { username },
    },
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

export interface UserData {
  id: string;
  username: string;
  email: string;
  role: "CONTRIBUTOR" | "MODERATOR" | "ADMIN" | "COMPANY";
  receiveNotifications: boolean;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  emailVerified: boolean;
  companyName?: string;
  companyNif?: string;
  companyPhone?: string;
  companyAddress?: string;
  companyWebsite?: string;
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

export interface NifVerificationResponse {
  success: boolean;
  message: string;
  data: {
    name: string;
  } | null;
  errors: unknown;
}

export async function verifyNif(nif: string) {
  const isBi = /^\d{9}[A-Za-z]{2}\d{3}$/.test(nif);
  const baseUrl = "http://consulta.edgarsingui.ao/consultar/";
  const url = isBi ? `${baseUrl}${nif}` : `${baseUrl}${nif}/nif`;

  const response = await fetch(url);

  if (response.status === 404 || response.status === 400 || response.ok) {
    try {
      const rawData = await response.json();
      return {
        success: !rawData.error,
        message:
          rawData.message || (rawData.error ? "Dados não encontrados." : ""),
        data: rawData.name ? { name: rawData.name } : null,
        errors: rawData.error ? rawData.message : null,
      } as NifVerificationResponse;
    } catch {
      // fallback if response body is not json
    }
  }

  const err = new Error("Erro na consulta do documento") as Error & {
    status?: number;
  };
  err.status = response.status;
  throw err;
}
