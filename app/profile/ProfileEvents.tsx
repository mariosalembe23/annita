import { RiCalendarEventLine } from "@remixicon/react";
import Link from "next/link";
import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import type { ApiEvent } from "@/lib/api/events";

interface ProfileEventsProps {
  isLoading: boolean;
  events: ApiEvent[];
}

export function ProfileEvents({ isLoading, events }: ProfileEventsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-96 bg-gray-100 animate-pulse rounded-3xl" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-16 flex flex-col items-center justify-center border border-dashed border-zinc-200 rounded-2xl bg-zinc-50/20">
        <RiCalendarEventLine className="size-16 text-zinc-300 mb-3" />
        <p className="text-zinc-500 text-base">
          Não publicou nenhum evento ainda.
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
    <div className="grid grid-cols-4 gap-1">
      {events.map((ev) => (
        <EventCard key={ev.id} className="max-w-full!" event={ev} />
      ))}
    </div>
  );
}
