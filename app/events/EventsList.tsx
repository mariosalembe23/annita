"use client";

import {
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
import { adaptApiEvent } from "@/data/events";
import { getEvents } from "@/lib/api/events";
import Link from "next/link";
import { useState } from "react";

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

export function EventsList() {
  const [search, setSearch] = useState("");
  const [modality, setModality] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);

  const { data, isPending } = useQuery({
    queryKey: ["events", search, modality, type, page],
    queryFn: () =>
      getEvents({
        search: search || undefined,
        modality: (modality || undefined) as any,
        type: (type || undefined) as any,
        page,
        per_page: 12,
      }),
  });

  const apiEvents = data?.data.map(adaptApiEvent) ?? [];
  const meta = data?.meta;

  return (
    <section className="max-w-7xl mx-auto w-full">
      <motion.header
        variants={container}
        initial="hidden"
        animate="show"
        className="flex items-center justify-between"
      >
        <motion.div variants={item}>
          <h1 className="text-5xl font-medium">Eventos</h1>
          {!isPending && (
            <p className="text-zinc-500 mt-1 text-[15px]">
              {meta?.totalElements ?? apiEvents.length}{" "}
              {(meta?.totalElements ?? apiEvents.length) === 1
                ? "evento encontrado"
                : "eventos encontrados"}
            </p>
          )}
        </motion.div>
        <motion.div variants={item} className="flex items-center gap-3">
          <Select
            value={modality || "all"}
            onValueChange={(v) => {
              setModality(v === "all" ? "" : v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-36">
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
            <SelectTrigger className="w-28">
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
        </motion.div>
      </motion.header>

      {isPending ? (
        <div className="mt-10 grid grid-cols-4 gap-x-6 gap-y-6">
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
            <button className="text-base transition-all hover:opacity-75 text-white bg-design-2 border-design-2 border rounded-lg px-3 py-1.5 font-normal flex items-center gap-2">
              <RiStickyNoteAddFill className="size-4" />
              Publicar evento
            </button>
          </Link>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-10 grid grid-cols-4 gap-x-6 gap-y-6"
        >
          {apiEvents.map((event) => (
            <motion.div key={event.id} variants={item}>
              <EventCard event={event} />
            </motion.div>
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
          {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
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
          ))}
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
  );
}
