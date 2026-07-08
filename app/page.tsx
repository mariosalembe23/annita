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
import { getCategories, getEvents } from "@/lib/api/events";
import { getMetrics } from "@/lib/api/metrics";
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

function formatMetricValue(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return String(value);
}

export default function Home() {
  const { token } = useUser();
  const [search, setSearch] = useState("");
  const [modality, setModality] = useState("");
  const [type, setType] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [page, setPage] = useState(1);

  const { data, isPending } = useQuery({
    queryKey: ["events", search, modality, type, categoryId, page, token],
    queryFn: () =>
      getEvents(
        {
          search: search || undefined,
          modality: (modality || undefined) as any,
          type: (type || undefined) as any,
          categoryId: categoryId || undefined,
          page,
          per_page: 8,
        },
        token ?? undefined,
      ),
  });

  const { data: metricsData, isPending: metricsPending } = useQuery({
    queryKey: ["metrics"],
    queryFn: getMetrics,
  });

  const { data: categoriesResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(undefined, 1, 1000),
  });

  const categories = categoriesResponse?.data ?? [];

  const apiEvents = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="overflow-x-hidden relative">
      <Nav />

      <motion.header variants={container} initial="hidden" animate="show">
        <section className="grid pt-20 max-w-7xl mt-16 gap-16 pot:gap-32 items-center mx-auto px-4 det:px-0 grid-cols-1 pot:grid-cols-[50%_50%]">
          <motion.div variants={item} className="max-w-3xl pot:px-0 px-4">
            <Link href={"/newsletter"}>
              <button className="px-4 py-2 transition-all dark:hover:bg-design-2/40 hover:bg-design-2/40 rounded-full text-sm font-normal bg-design-2/10 dark:bg-design-2/20 gap-2 items-center gap- text-design-3 dark:text-design-1 inline-flex mb-6">
                <RiMailSendFill className="size-4" />
                Subscreva a nossa newsletter
              </button>
            </Link>
            <h1 className="text-5xl  small:text-6xl pot:text-7xl pot:leading-16 font-medium">
              O teu próximo{" "}
              <span className="text-design-2 font-medium">evento</span> começa
              aqui.
            </h1>
            <p className="mt-10 text-lg font-normal max-w-xl text-zinc-600 dark:text-zinc-400">
              Publique ou encontre eventos relacionados com a tecnologia em
              Angola. Desde meetups a conferências, tudo o que precisas para
              estares a par do que se passa no mundo tech.
            </p>
            <motion.div
              variants={item}
              className="flex items-center flex-wrap gap-2 mt-6"
            >
              <Link href={"/events"}>
                <button className="text-base transition-all hover:opacity-75 text-white bg-design-2 border-design-2 border rounded-lg px-3 py-1.5 font-normal  flex items-center gap-2 ">
                  <RiStackFill className="size-4" />
                  Explorar eventos
                </button>
              </Link>
              <Link href={"/events/create"}>
                <button className="text-base transition-all hover:opacity-75 bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 border-gray-200 dark:border-zinc-700 border rounded-lg px-3 py-1.5 font-normal  flex items-center gap-2 ">
                  <RiStickyNoteAddFill className="size-4" />
                  Publicar evento
                </button>
              </Link>
            </motion.div>
            <motion.footer
              variants={item}
              className="flex items-center flex-wrap gap-8 small:gap-12"
            >
              <div className="flex flex-col gap-1">
                <p className="flex items-center text-gray-500 dark:text-zinc-500 gap-0.5 mt-10">
                  Inscritos
                </p>
                {metricsPending ? (
                  <div className="h-8 w-12 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse mt-1" />
                ) : (
                  <p className="text-2xl text-black dark:text-zinc-100 gap-0.5">
                    {formatMetricValue(
                      metricsData?.totalNewsletterSubscribers ?? 0,
                    )}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <p className="flex items-center text-gray-500 dark:text-zinc-500 gap-0.5 mt-10">
                  Eventos
                </p>
                {metricsPending ? (
                  <div className="h-8 w-12 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse mt-1" />
                ) : (
                  <p className="text-2xl text-black dark:text-zinc-100 gap-0.5">
                    {formatMetricValue(metricsData?.totalEvents ?? 0)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <p className="flex items-center text-gray-500 dark:text-zinc-500 gap-0.5 mt-10">
                  Contribuidores
                </p>
                {metricsPending ? (
                  <div className="h-8 w-12 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse mt-1" />
                ) : (
                  <p className="text-2xl text-black dark:text-zinc-100 gap-0.5">
                    {formatMetricValue(metricsData?.activeContributors ?? 0)}
                  </p>
                )}
              </div>
            </motion.footer>
          </motion.div>
          <motion.div variants={item} className="relative mt-4 pot:mt-20">
            <div className="flex items-center   pot:ms-20 gap-4 pot:gap-2 flex-nowrap relative justify-center">
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
        <section className="max-w-7xl mx-auto w-full px-5 det:px-0">
          <motion.header
            variants={item}
            className="flex flex-col pot:flex-row pot:items-center gap-6 mt-10 justify-between"
          >
            <h2 className="text-4xl pot:text-5xl font-medium">Eventos</h2>
            <div className="flex items-center flex-wrap gap-3">
              <Select
                value={categoryId || "all"}
                onValueChange={(v) => {
                  setCategoryId(v === "all" ? "" : v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-40 py-4.5">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <div className="flex w-full small:w-72 bg-white dark:bg-white/5 transition-all focus-within:ring-4 focus-within:ring-blue-100 dark:focus-within:ring-blue-500/20 focus-within:border-blue-400 items-center justify-between px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-600">
                <RiSearchLine className="size-5 text-zinc-400 shrink-0" />
                <input
                  className="w-full outline-none ps-2 text-base det:text-sm bg-transparent"
                  type="text"
                  placeholder="Pesquisar"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
                {(search || modality || type || categoryId) && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setModality("");
                      setType("");
                      setCategoryId("");
                      setPage(1);
                    }}
                    className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors shrink-0"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>
          </motion.header>

          {isPending ? (
            <div className="mt-10 grid grid-cols-1 small:grid-cols-2 pot:grid-cols-3 det:grid-cols-4 gap-x-2 gap-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-96 rounded-3xl bg-gray-100 dark:bg-zinc-700 animate-pulse"
                />
              ))}
            </div>
          ) : apiEvents.length === 0 ? (
            <div className="mt-20 text-center flex flex-col items-center justify-center gap-4 text-zinc-300 dark:text-zinc-700">
              <RiStackFill className="size-24" />
              <p className="text-base text-zinc-500 dark:text-zinc-400">
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
              className="mt-10 grid grid-cols-1 small:grid-cols-2 pot:grid-cols-3 det:grid-cols-4 gap-x-2 gap-y-4"
            >
              {apiEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </motion.div>
          )}

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-center flex-wrap gap-2 mt-12">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 text-sm hover:bg-gray-50 dark:hover:bg-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
                        : "border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-900"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
              <button
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 text-sm hover:bg-gray-50 dark:hover:bg-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
