"use client";

import { RiArchiveStackLine } from "@remixicon/react";
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
import MetricsGrid from "./metrics-grid";
import EventCard from "./event-card";
import EventDetailsDialog from "./event-details-dialog";
import EditEventSheet from "./edit-event-sheet";

interface DashboardContentProps {
  onNavigate: (tab: string) => void;
}

export default function DashboardContent({
  onNavigate,
}: DashboardContentProps) {
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

  return (
    <>
      <MetricsGrid />

      <section className="mt-10">
        <header className="flex items-center justify-between">
          <h3 className="text-3xl">Eventos Recentes</h3>
          <button
            onClick={() => onNavigate("eventos")}
            className="text-base transition-all hover:opacity-75 text-white bg-design-2 border-design-2 border rounded-lg px-3 py-1.5 font-normal flex items-center gap-2"
          >
            <RiArchiveStackLine className="size-4" />
            Todos eventos
          </button>
        </header>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Input
            placeholder="Pesquisar eventos..."
            className="max-w-xs bg-white"
          />
          <Select>
            <SelectTrigger className="w-36 bg-white">
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
            <SelectTrigger className="w-28 bg-white">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PAID">Pago</SelectItem>
              <SelectItem value="FREE">Gratuito</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-36 bg-white">
              <SelectValue placeholder="Modalidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PRESENTIAL">Presencial</SelectItem>
              <SelectItem value="REMOTE">Remoto</SelectItem>
              <SelectItem value="HYBRID">Híbrido</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-36 bg-white">
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
                className="w-fit justify-start text-left font-normal"
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
          <span className="text-zinc-400">—</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-fit justify-start text-left font-normal"
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

        <div className="mt-6 grid grid-cols-4 gap-4">
          {isPending ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-zinc-200 rounded-2xl p-5 animate-pulse space-y-3"
              >
                <div className="h-5 bg-zinc-200 rounded w-3/4" />
                <div className="h-4 bg-zinc-200 rounded w-full" />
                <div className="h-4 bg-zinc-200 rounded w-5/6" />
                <div className="flex gap-2">
                  <div className="h-5 bg-zinc-200 rounded w-14" />
                  <div className="h-5 bg-zinc-200 rounded w-16" />
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-zinc-200">
                  <div className="h-4 bg-zinc-200 rounded w-24" />
                  <div className="size-8 bg-zinc-200 rounded" />
                </div>
              </div>
            ))
          ) : (
            events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onSelect={setSelectedEvent}
                  onEdit={setEditingEvent}
                />
            ))
          )}
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
