"use client";

import { isAxiosError } from "axios";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyReports, getEventDetails, deleteReport } from "@/lib/api/events";
import { EventDetailModal } from "@/components/EventDetailModal";
import { RiLoader2Line } from "@remixicon/react";
import { formatDate } from "@/data/events";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface ProfileReportsProps {
  token: string;
}

export function ProfileReports({ token }: ProfileReportsProps) {
  const [page, setPage] = useState(1);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const perPage = 6;

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query reports
  const { data: reportsData, isPending } = useQuery({
    queryKey: ["my-reports", token, page],
    queryFn: () => getMyReports(token, page, perPage),
    enabled: !!token,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteReport(id, token),
    onSuccess: () => {
      toast("success", "Denúncia removida com sucesso!");
      setReportToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["my-reports"] });
    },
    onError: (error) => {
      let message = "Erro ao remover a denúncia";
      if (isAxiosError(error)) {
        message = error.response?.data?.message || error.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      toast("error", message);
    },
  });

  // Query event details when a card "Ver Detalhes" button is clicked
  const { data: eventDetails, isFetching: loadingDetails } = useQuery({
    queryKey: ["event-details", selectedEventId, token],
    queryFn: () => getEventDetails(selectedEventId ?? "", token),
    enabled: !!selectedEventId,
  });

  const reports = reportsData?.data ?? [];
  const meta = reportsData?.meta;

  const adaptedEvent =
    eventDetails && selectedEventId && eventDetails.id === selectedEventId
      ? eventDetails
      : null;

  return (
    <div className="space-y-6">
      <div className="p-1 pb-2">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Histórico de Denúncias
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Denúncias efetuadas por si para ajudar a moderar a plataforma.
        </p>
      </div>

      {isPending ? (
        <div className="grid grid-cols-1 small:grid-cols-2 pot:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-32 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 animate-pulse "
            />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-16 "></div>
      ) : (
        <div className="grid grid-cols-1  gap-2">
          {reports.map((report) => {
            return (
              <div
                key={report.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 dark:border-l-red-500 border-l-4 border-l-red-500 p-5 shadow-xs flex flex-col small:flex-row gap-4 items-start small:items-center justify-between transition-shadow"
              >
                <div className="space-y-1">
                  <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base">
                      {report.eventTitle || "Evento não disponível"}
                    </h4>
                  </div>

                  {report.reason && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {report.reason}
                    </p>
                  )}
                  <span className="flex items-center gap-1 text-xs text-zinc-400">
                    Criado em {formatDate(report.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-3 w-full small:w-auto justify-end shrink-0">
                  <button
                    onClick={() => setSelectedEventId(report.eventId || null)}
                    disabled={!report.eventId}
                    className="text-base transition-all hover:opacity-75 bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 border-gray-200 dark:border-zinc-700 border rounded-lg px-3 py-1 font-normal  flex items-center gap-2 "
                  >
                    Detalhes
                  </button>
                  <button
                    onClick={() => setReportToDelete(report.id)}
                    className="text-base transition-all hover:opacity-75 bg-red-500 text-white border-red-500 border rounded-lg px-3 py-1 font-normal  flex items-center gap-2 "
                  >
                    Remover
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-700">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="text-sm px-4 py-2 border rounded-lg bg-white dark:bg-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Anterior
          </button>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            Página {page} de {meta.totalPages}
          </span>
          <button
            onClick={() =>
              setPage((prev) => Math.min(prev + 1, meta.totalPages))
            }
            disabled={page === meta.totalPages}
            className="text-sm px-4 py-2 border rounded-lg bg-white dark:bg-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Próximo
          </button>
        </div>
      )}

      {/* Event Details Overlay Loader */}
      {loadingDetails && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-lg flex items-center gap-3">
            <RiLoader2Line className="animate-spin size-5 text-design-2" />
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              A carregar detalhes...
            </span>
          </div>
        </div>
      )}

      {/* Event Detail Modal Overlay */}
      {selectedEventId && adaptedEvent && (
        <EventDetailModal
          open={!!selectedEventId}
          onClose={() => setSelectedEventId(null)}
          event={adaptedEvent}
        />
      )}

      {/* Delete Report Confirmation Dialog */}
      <Dialog
        open={!!reportToDelete}
        onOpenChange={(open) => {
          if (!open) setReportToDelete(null);
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader className="flex p-2 flex-col items-start">
            <DialogTitle>Remover Denúncia</DialogTitle>
            <DialogDescription>
              Tem a certeza de que deseja remover esta denúncia? Esta ação não
              pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="bg-white dark:bg-zinc-900 justify-between! border-zinc-200 dark:border-zinc-700 flex sm:justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setReportToDelete(null)}
              disabled={deleteMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() =>
                reportToDelete && deleteMutation.mutate(reportToDelete)
              }
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "A remover..." : "Sim, remover"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
