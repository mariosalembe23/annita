import { RiEqualizerLine, RiSearchLine } from "@remixicon/react";
import type { Metadata } from "next";
import { EventCard } from "@/components/EventCard";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { events } from "@/data/events";

export const metadata: Metadata = {
  title: "Eventos",
  description:
    "Explora todos os eventos de tecnologia em Angola. Hackathons, workshops, conferências, meetups e muito mais.",
  openGraph: {
    title: "Eventos de Tecnologia em Angola — Annita",
    description:
      "Explora todos os eventos de tecnologia em Angola. Encontra o teu próximo evento tech.",
  },
};

export default function EventsPage() {
  return (
    <div className="overflow-x-hidden">
      <Nav
        links={[
          { name: "Início", href: "/" },
          {
            name: "Contribuir",
            href: "/contribute",
          },
        ]}
      />

      <main className="pt-32">
        <section className="max-w-7xl mx-auto w-full">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-medium">Eventos</h1>
              <p className="text-zinc-500 mt-1 text-[15px]">
                {events.length} eventos encontrados
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex w-96 transition-all focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-400 items-center justify-between px-3 py-2 rounded-lg border border-gray-200">
                <RiSearchLine className="size-5 text-zinc-400" />
                <input
                  className="w-full outline-none ps-2"
                  type="text"
                  placeholder="Pesquisar"
                />
                <button className="text-zinc-600 transition-all hover:text-black">
                  <RiEqualizerLine className="size-5" />
                </button>
              </div>
            </div>
          </header>

          <div className="mt-10 grid grid-cols-4 gap-x-6 gap-y-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
