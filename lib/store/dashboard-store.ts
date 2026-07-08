import { create } from "zustand";
import { getAdminDashboardMetrics, DashboardMetrics } from "@/lib/api/admin";

interface DashboardState {
  metrics: DashboardMetrics | null;
  isLoading: boolean;
  error: string | null;
  setMetrics: (metrics: DashboardMetrics) => void;
  fetchMetrics: (token: string) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  metrics: null,
  isLoading: false,
  error: null,
  setMetrics: (metrics) => set({ metrics }),
  fetchMetrics: async (token: string) => {
    // If we already have metrics, avoid duplicate loading states if not necessary,
    // but let's refresh it.
    set({ isLoading: true, error: null });
    try {
      const data = await getAdminDashboardMetrics(token);
      set({ metrics: data, isLoading: false });
    } catch (err) {
      let message = "Erro ao carregar métricas do painel";
      if (err instanceof Error) {
        message = err.message;
      }
      set({ error: message, isLoading: false });
    }
  },
}));
