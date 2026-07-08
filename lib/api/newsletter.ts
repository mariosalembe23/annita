import api from "../api";

export interface SubscribeNewsletterPayload {
  name: string;
  email: string;
  categoryIds: string[];
}

export async function subscribeNewsletter(payload: SubscribeNewsletterPayload) {
  const { data } = await api.post("/newsletter/subscribe", payload);
  return data;
}

export interface NewsletterSubscriber {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  categories?: { id: string; name: string }[];
}

export interface NewsletterSubscribersResponse {
  data: NewsletterSubscriber[];
  meta?: {
    page: number;
    perPage: number;
    totalElements: number;
    totalPages: number;
  };
}

export async function getNewsletterSubscribers(token: string, page = 1, perPage = 10) {
  const { data } = await api.get<NewsletterSubscribersResponse>("/newsletter", {
    params: { page, per_page: perPage },
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
