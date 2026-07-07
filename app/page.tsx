"use client";

import {
  RiMailSendFill,
  RiSearchLine,
  RiStackFill,
  RiStickyNoteAddFill,
} from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EventCard } from "@/components/EventCard";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { getEvents } from "@/lib/api/events";
import { useUser } from "@/hooks/use-user";
import Link from "next/link";
import { useState } from "react";
import { events } from "@/data/events";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 } as const,
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function Home() {
  const { token } = useUser();
  const [search, setSearch] = useState("");
  const [modality, setModality] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);

  const { data, isPending } = useQuery({
    queryKey: ["events", search, modality, type, page, token],
    queryFn: () =>
      getEvents(
        {
          search: search || undefined,
          modality: (modality || undefined) as any,
          type: (type || undefined) as any,
          page,
          per_page: 12,
        },
        token ?? undefined,
      ),
  });

  const apiEvents = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="overflow-x-hidden relative">
      <Nav />

      <motion.header variants={container} initial="hidden" animate="show">
        <section className="grid pt-24 max-w-7xl mt-16 gap-32 items-center mx-auto grid-cols-[50%_50%]">
          <motion.div variants={item} className="max-w-3xl">
            <p className="px-4 py-2 rounded-full text-sm font-normal bg-design-2/10 gap-2 items-center gap- text-design-3 inline-flex mb-6">
              <RiMailSendFill className="size-4" />
              Subscreva a nossa newsletter
            </p>
            <h1 className="text-7xl leading-16 font-medium">
              O teu próximo{" "}
              <span className="text-design-2 font-medium">evento</span> começa
              aqui.
            </h1>
            <p className="mt-10 text-lg font-normal max-w-xl text-zinc-600">
              Publique ou encontre eventos relacionados com a tecnologia em
              Angola. Desde meetups a conferências, tudo o que precisas para
              estares a par do que se passa no mundo tech.
            </p>
            <motion.div
              variants={item}
              className="flex items-center gap-2 mt-6"
            >
              <button className="text-base transition-all hover:opacity-75 text-white bg-design-2 border-design-2 border rounded-lg px-3 py-1.5 font-normal  flex items-center gap-2 ">
                <RiStackFill className="size-4" />
                Explorar eventos
              </button>
              <Link href={"/events/create"}>
                <button className="text-base transition-all hover:opacity-75 bg-white text-black border-gray-200 border rounded-lg px-3 py-1.5 font-normal  flex items-center gap-2 ">
                  <RiStickyNoteAddFill className="size-4" />
                  Publicar evento
                </button>
              </Link>
            </motion.div>
            <motion.footer variants={item} className="flex items-center gap-12">
              <div className="flex flex-col gap-1">
                <p className="flex items-center text-gray-500 gap-0.5 mt-10">
                  Inscritos
                </p>
                <p className="text-xl text-black gap-0.5">2K</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="flex items-center text-gray-500 gap-0.5 mt-10">
                  Eventos
                </p>
                <p className="text-xl text-black gap-0.5">50</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="flex items-center text-gray-500 gap-0.5 mt-10">
                  Contribuidores
                </p>
                <p className="text-xl text-black gap-0.5">12</p>
              </div>
            </motion.footer>
          </motion.div>
          <motion.div variants={item} className="relative mt-20">
            <div className="flex items-center ms-20 gap-2 relative justify-center">
              {events.slice(0, 3).map((event) => (
                <EventCard type="presentation" key={event.id} event={event} />
              ))}
            </div>
          </motion.div>
        </section>
      </motion.header>

      <motion.main
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="mt-28"
      >
        <section className="max-w-7xl mx-auto w-full">
          <motion.header
            variants={item}
            className="flex items-center mt-10 justify-between"
          >
            <h2 className="text-5xl font-medium">Eventos</h2>
            <div className="flex items-center gap-3">
              <Select
                value={modality || "all"}
                onValueChange={(v) => {
                  setModality(v === "all" ? "" : v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-36 py-4.5">
                  <SelectValue placeholder="Modalidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="PRESENTIAL">Presencial</SelectItem>
                  <SelectItem value="REMOTE">Remoto</SelectItem>
                  <SelectItem value="HYBRID">Híbrido</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={type || "all"}
                onValueChange={(v) => {
                  setType(v === "all" ? "" : v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-28 py-4.5">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="FREE">Gratuito</SelectItem>
                  <SelectItem value="PAID">Pago</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex w-72 transition-all focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-400 items-center justify-between px-3 py-2 rounded-lg border border-gray-200">
                <RiSearchLine className="size-5 text-zinc-400 shrink-0" />
                <input
                  className="w-full outline-none ps-2 text-sm"
                  type="text"
                  placeholder="Pesquisar"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
                {(search || modality || type) && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setModality("");
                      setType("");
                      setPage(1);
                    }}
                    className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors shrink-0"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>
          </motion.header>

          {isPending ? (
            <div className="mt-10 grid grid-cols-4 gap-x-6 gap-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-96 rounded-3xl bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : apiEvents.length === 0 ? (
            <div className="mt-20 text-center flex flex-col items-center justify-center gap-4 text-zinc-300">
              <RiStackFill className="size-24" />
              <p className="text-base text-zinc-500">
                Seja o primeiro a publicar um evento.
              </p>
              <Link href={"/events/create"}>
                <button className="text-base transition-all hover:opacity-75 text-white bg-design-2 border-design-2 border rounded-lg px-3 py-1.5 font-normal  flex items-center gap-2 ">
                  <RiStickyNoteAddFill className="size-4" />
                  Publicar evento
                </button>
              </Link>
            </div>
          ) : (
            <motion.div
              variants={item}
              initial="hidden"
              animate="show"
              className="mt-10 grid grid-cols-4 gap-x-2 gap-y-4"
            >
              {apiEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </motion.div>
          )}

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Anterior
              </button>
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`size-10 rounded-lg text-sm font-medium transition-all ${
                      p === page
                        ? "bg-design-2 text-white"
                        : "border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
              <button
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Seguinte
              </button>
            </div>
          )}
        </section>
      </motion.main>

      <Footer />
    </div>
  );
}
