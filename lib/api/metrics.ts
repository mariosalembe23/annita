import api from "../api";

export interface MetricsResponse {
  totalEvents: number;
  totalNewsletterSubscribers: number;
  activeContributors: number;
}

export async function getMetrics() {
  const { data } = await api.get<MetricsResponse>("/metrics");
  return data;
}
