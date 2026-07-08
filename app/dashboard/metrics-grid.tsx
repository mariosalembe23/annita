"use client";

import {
  RiArrowDownSFill,
  RiArrowUpSFill,
  RiArchiveStackLine,
  RiGroup3Line,
  RiAppsLine,
  RiMailSendLine,
} from "@remixicon/react";
import { useDashboardStore } from "@/lib/store/dashboard-store";

export default function MetricsGrid() {
  const { metrics, isLoading, error } = useDashboardStore();

  if (isLoading) {
    return (
      <div className="mt-10 grid grid-cols-1 small:grid-cols-2 pot:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-6 rounded-2xl h-36 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-10 p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl">
        Erro ao carregar métricas: {error}
      </div>
    );
  }

  if (!metrics) return null;

  const items = [
    {
      label: "Total de Eventos",
      icon: RiArchiveStackLine,
      value: metrics.events.total,
      percentage: Math.abs(Math.round(metrics.events.changePercentage * 100)),
      typeDash: metrics.events.changePercentage >= 0 ? "up" : "down",
    },
    {
      label: "Total de Usuários",
      icon: RiGroup3Line,
      value: metrics.users.total,
      percentage: Math.abs(Math.round(metrics.users.changePercentage * 100)),
      typeDash: metrics.users.changePercentage >= 0 ? "up" : "down",
    },
    {
      label: "Total de Categorias",
      icon: RiAppsLine,
      value: metrics.categories.total,
      percentage: Math.abs(Math.round(metrics.categories.changePercentage * 100)),
      typeDash: metrics.categories.changePercentage >= 0 ? "up" : "down",
    },
    {
      label: "Inscritos em Newsletter",
      icon: RiMailSendLine,
      value: metrics.subscribers.total,
      percentage: Math.abs(Math.round(metrics.subscribers.changePercentage * 100)),
      typeDash: metrics.subscribers.changePercentage >= 0 ? "up" : "down",
    },
  ];

  return (
    <div className="mt-10 grid grid-cols-1 small:grid-cols-2 pot:grid-cols-4 gap-6">
      {items.map((item, index) => (
        <div
          key={index}
          className="bg-white dark:bg-zinc-900 relative border overflow-hidden border-zinc-200 dark:border-zinc-700 p-6 rounded-2xl"
        >
          <header className="flex items-center justify-between">
            <span className="text-zinc-800 dark:text-zinc-200 font-medium text-md z-10">
              {item.label}
            </span>
            <div className="flex items-center gap-1 z-10">
              {item.typeDash === "up" ? (
                <RiArrowUpSFill className="size-6 text-green-600" />
              ) : (
                <RiArrowDownSFill className="size-6 text-red-600" />
              )}
              <p
                className={`text-base ${item.typeDash === "up" ? "text-green-600" : "text-red-600"}`}
              >
                {item.percentage}%
              </p>
            </div>
            <item.icon className="absolute size-32 text-zinc-300 dark:text-zinc-700! -bottom-10 -right-6 pointer-events-none opacity-20 dark:opacity-10" />
          </header>
          <footer className="pt-6 z-10 relative">
            <p className="text-4xl">{item.value}</p>
            <p className="pt-2 text-sm font-normal! text-zinc-600 dark:text-zinc-400">
              {item.typeDash === "up"
                ? "Aumento neste mês"
                : "Redução neste mês"}
            </p>
          </footer>
        </div>
      ))}
    </div>
  );
}
