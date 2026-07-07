import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { EventsList } from "./EventsList";

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
            href: "https://github.com/mariosalembe23/annita",
          },
        ]}
      />

      <main className="pt-32 pb-24">
        <EventsList />
      </main>

      <Footer />
    </div>
  );
}
