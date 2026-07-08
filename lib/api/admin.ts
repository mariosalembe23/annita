import api from "../api";

export interface MetricDetail {
  total: number;
  currentMonth: number;
  lastMonth: number;
  changePercentage: number;
}

export interface DashboardMetrics {
  events: MetricDetail;
  users: MetricDetail;
  categories: MetricDetail;
  subscribers: MetricDetail;
}

export async function getAdminDashboardMetrics(token: string) {
  const { data } = await api.get<DashboardMetrics>("/admin/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
