"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { EventCard } from "@/components/EventCard";
import { getEventDetails } from "@/lib/api/events";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { useUser } from "@/hooks/use-user";

interface EventPageProps {
  params: Promise<{ id_event: string }>;
}

export default function EventPage({ params }: EventPageProps) {
  const { id_event } = use(params);
  const { token } = useUser();

  const {
    data: event,
    isPending,
    error,
  } = useQuery({
    queryKey: ["event-details", id_event, token],
    queryFn: () => getEventDetails(id_event, token ?? undefined),
    retry: 1,
  });

  return (
    <div className="overflow-x-hidden min-h-screen flex flex-col justify-between bg-zinc-50 dark:bg-zinc-900">
      <main className="flex-1 pt-32 pb-24 flex flex-col items-center justify-center px-4 w-full max-w-7xl mx-auto">
        {isPending ? (
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="h-96 w-full max-w-80 bg-gray-200 dark:bg-zinc-700/60 animate-pulse rounded-3xl" />
            <div className="h-10 w-44 bg-gray-200 dark:bg-zinc-700/60 animate-pulse rounded-lg" />
          </div>
        ) : error || !event ? (
          <div className="text-center bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-700 shadow-sm dark:shadow-black/40 max-w-md w-full">
            <h2 className="text-2xl font-medium text-zinc-800 dark:text-zinc-200">
              Evento Não Encontrado
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">
              O evento que procura não existe ou foi removido.
            </p>
            <Link href="/events" className="mt-6 inline-block">
              <button className="text-base transition-all hover:opacity-75 text-white bg-design-2 border-design-2 border rounded-lg px-4 py-2 font-normal">
                Ver todos os eventos
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8 w-full">
            <EventCard event={event} className="shadow-2xl shadow-zinc-200" />
            <Link href="/events">
              <button className="text-sm transition-all hover:opacity-75 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 border rounded-lg px-4 py-2 font-normal flex items-center gap-2 ">
                Ver todos os eventos
              </button>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
