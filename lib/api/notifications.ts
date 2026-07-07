import api from "../api";

export interface ApiNotification {
  id: string;
  eventId: string;
  eventTitle: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface NotificationsResponse {
  data: ApiNotification[];
  meta: {
    page: number;
    perPage: number;
    totalElements: number;
    totalPages: number;
  };
}

export async function getNotifications(token: string, page = 1, perPage = 50) {
  const { data } = await api.get<NotificationsResponse>("/notifications", {
    params: { page, per_page: perPage },
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function markNotificationRead(id: string, token: string) {
  const { data } = await api.put(
    `/notifications/${id}/read`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
}
