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
