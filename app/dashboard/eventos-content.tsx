"use client";

import {
  RiArchiveStackLine,
  RiForbid2Fill,
  RiCheckboxFill,
  RiHourglass2Fill,
} from "@remixicon/react";
import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/hooks/use-user";
import { getEventsAdmin } from "@/lib/api/events";
import type { ApiEvent } from "@/lib/api/events";
import EventCard from "./event-card";
import EventDetailsDialog from "./event-details-dialog";
import EditEventSheet from "./edit-event-sheet";

export default function EventosContent() {
  const { token } = useUser();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [selectedEvent, setSelectedEvent] = useState<ApiEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<ApiEvent | null>(null);

  const { data, isPending } = useQuery({
    queryKey: ["events-admin"],
    queryFn: () => getEventsAdmin({}, token ?? undefined),
    enabled: !!token,
  });

  const events = data?.data ?? [];

  const total = events.length;
  const pending = events.filter((e) => e.status === "PENDING").length;
  const approved = events.filter((e) => e.status === "APPROVED").length;
  const rejected = events.filter((e) => e.status === "REJECTED").length;

  const eventMetrics = [
    {
      label: "Total de Eventos",
      icon: RiArchiveStackLine,
      value: total,
    },
    {
      label: "Eventos Pendentes",
      icon: RiHourglass2Fill,
      value: pending,
    },
    {
      label: "Eventos Ativos",
      icon: RiCheckboxFill,
      value: approved,
    },
    {
      label: "Eventos Rejeitados",
      icon: RiForbid2Fill,
      value: rejected,
    },
  ];

  return (
    <>
      <div className="mt-10 grid grid-cols-1 small:grid-cols-2 pot:grid-cols-4 gap-6">
        {eventMetrics.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-zinc-900 relative border overflow-hidden border-zinc-200 dark:border-zinc-700 p-6 rounded-2xl"
          >
            <header className="flex items-center justify-between">
              <span className="text-zinc-800 dark:text-zinc-200 font-medium text-md">
                {item.label}
              </span>
              <item.icon className="absolute size-32 text-zinc-300 dark:text-zinc-600! -bottom-10 -right-6" />
            </header>
            <footer className="pt-6">
              <p className="text-4xl">{item.value}</p>
            </footer>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <header className="flex items-center justify-between">
          <h3 className="text-3xl">Eventos</h3>
        </header>

        <div className="mt-6 flex flex-col small:flex-row flex-wrap items-stretch small:items-center gap-3">
          <Input
            placeholder="Pesquisar eventos..."
            className="w-full small:max-w-xs bg-white dark:bg-zinc-900"
          />
          <Select>
            <SelectTrigger className="w-full small:w-36 bg-white dark:bg-zinc-900">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pendente</SelectItem>
              <SelectItem value="APPROVED">Aprovado</SelectItem>
              <SelectItem value="REJECTED">Rejeitado</SelectItem>
              <SelectItem value="REPORTED">Reportado</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full small:w-28 bg-white dark:bg-zinc-900">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PAID">Pago</SelectItem>
              <SelectItem value="FREE">Gratuito</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full small:w-36 bg-white dark:bg-zinc-900">
              <SelectValue placeholder="Modalidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PRESENTIAL">Presencial</SelectItem>
              <SelectItem value="REMOTE">Remoto</SelectItem>
              <SelectItem value="HYBRID">Híbrido</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full small:w-36 bg-white dark:bg-zinc-900">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tecnologia">Tecnologia</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="artes">Artes</SelectItem>
              <SelectItem value="negocios">Negócios</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="educacao">Educação</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full small:w-fit justify-start text-left font-normal bg-white dark:bg-zinc-900"
              >
                <CalendarIcon className="mr-2 size-4" />
                {startDate ? format(startDate, "dd/MM/yyyy") : "Data início"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
              />
            </PopoverContent>
          </Popover>
          <span className="hidden small:inline text-zinc-400">—</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full small:w-fit justify-start text-left font-normal bg-white dark:bg-zinc-900"
              >
                <CalendarIcon className="mr-2 size-4" />
                {endDate ? format(endDate, "dd/MM/yyyy") : "Data fim"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="mt-6 grid grid-cols-1 small:grid-cols-2 pot:grid-cols-3 det:grid-cols-4 lal:grid-cols-5 gap-4">
          {isPending
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-5 animate-pulse space-y-3"
                >
                  <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4" />
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-full" />
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-5/6" />
                  <div className="flex gap-2">
                    <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded w-14" />
                    <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded w-16" />
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-700">
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-24" />
                    <div className="size-8 bg-zinc-200 dark:bg-zinc-700 rounded" />
                  </div>
                </div>
              ))
            : events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onSelect={setSelectedEvent}
                  onEdit={setEditingEvent}
                />
              ))}
        </div>
      </section>

      <EventDetailsDialog
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      <EditEventSheet
        event={editingEvent}
        onClose={() => setEditingEvent(null)}
      />
    </>
  );
}
