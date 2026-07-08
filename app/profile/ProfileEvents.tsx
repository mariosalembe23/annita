import { RiCalendarEventLine } from "@remixicon/react";
import Link from "next/link";
import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import type { ApiEvent } from "@/lib/api/events";

interface ProfileEventsProps {
  isLoading: boolean;
  events: ApiEvent[];
  meta?: {
    page: number;
    perPage: number;
    totalElements: number;
    totalPages: number;
  };
  page?: number;
  onPageChange?: (page: number) => void;
}

export function ProfileEvents({
  isLoading,
  events,
  meta,
  page = 1,
  onPageChange,
}: ProfileEventsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 small:grid-cols-2 pot:grid-cols-3 det:grid-cols-4 gap-x-2 gap-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-96 bg-gray-100 dark:bg-zinc-800 animate-pulse rounded-3xl"
          />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-16 flex flex-col items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-700 rounded-2xl bg-zinc-50 dark:bg-zinc-800/20">
        <RiCalendarEventLine className="size-16 text-zinc-300 dark:text-zinc-600 mb-3" />
        <p className="text-zinc-500 dark:text-zinc-400 text-base">
          Nenhum evento encontrado para os filtros selecionados.
        </p>
        <Link href="/events/create" className="mt-4">
          <Button className="bg-design-2 hover:bg-design-2/90 text-white font-normal">
            Publicar Evento
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 small:grid-cols-2 pot:grid-cols-3 det:grid-cols-4 gap-x-2 gap-y-4">
        {events.map((ev) => (
          <EventCard key={ev.id} className="max-w-full!" event={ev} showStatus />
        ))}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => onPageChange?.(Math.max(1, page - 1))}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 text-sm hover:bg-gray-50 dark:hover:bg-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-zinc-700 dark:text-zinc-300 cursor-pointer bg-white dark:bg-zinc-900"
          >
            Anterior
          </button>
          {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange?.(p)}
              className={`size-10 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                p === page
                  ? "bg-design-2 text-white"
                  : "border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            disabled={page >= meta.totalPages}
            onClick={() => onPageChange?.(Math.min(meta.totalPages, page + 1))}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 text-sm hover:bg-gray-50 dark:hover:bg-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-zinc-700 dark:text-zinc-300 cursor-pointer bg-white dark:bg-zinc-900"
          >
            Seguinte
          </button>
        </div>
      )}
    </div>
  );
}
