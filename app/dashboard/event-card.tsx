import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  RiCheckboxMultipleLine,
  RiDeleteBinLine,
  RiForbid2Line,
  RiMarkPenLine,
  RiMore2Fill,
  RiTimelineView,
} from "@remixicon/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ApiEvent, approveEvent, rejectEvent } from "@/lib/api/events";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import {
  statusColors,
  statusLabels,
  typeLabels,
  modalityLabels,
} from "./mock-data";
import { useState } from "react";

interface EventCardProps {
  event: ApiEvent;
  onSelect: (event: ApiEvent) => void;
  onEdit?: (event: ApiEvent) => void;
}

export default function EventCard({ event, onSelect, onEdit }: EventCardProps) {
  const { token } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  const approveMutation = useMutation({
    mutationFn: () => approveEvent(event.id, token ?? ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events-admin"] });
      toast("success", "Evento aprovado com sucesso.");
      setApproveOpen(false);
    },
    onError: () => {
      toast("error", "Erro ao aprovar o evento. Tente novamente.");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: () => rejectEvent(event.id, token ?? ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events-admin"] });
      toast("success", "Evento rejeitado com sucesso.");
      setRejectOpen(false);
    },
    onError: () => {
      toast("error", "Erro ao rejeitar o evento. Tente novamente.");
    },
  });

  return (
    <>
      <div className="bg-white flex flex-col justify-between dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700/50 rounded-2xl p-5">
        <header>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h4 className="text-md font-medium text-zinc-900 dark:text-zinc-100 truncate">
                {event.title}
              </h4>
            </div>
            <span
              className={`shrink-0 ps-3 py-0.5 rounded-full text-xs font-medium ${
                statusColors[event.status] || "text-zinc-800 dark:text-zinc-200"
              }`}
            >
              {statusLabels[event.status] || event.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
            {event.description}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white">
            <span className="px-2 py-0.5 rounded-md bg-design-3">
              {typeLabels[event.type] || event.type}
            </span>
            {Array.isArray(event.modality) ? (
              event.modality.map((mod) => (
                <span key={mod} className="px-2 py-0.5 rounded-md bg-design-3">
                  {modalityLabels[mod] || mod}
                </span>
              ))
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-design-3">
                {modalityLabels[event.modality as any] || event.modality}
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-md bg-design-3">
              {event.category.name}
            </span>
          </div>
        </header>
        <footer className="pt-4 border-zinc-200 dark:border-zinc-700/50 flex items-center justify-between border-t mt-4 text-sm text-zinc-800 dark:text-zinc-200">
          <p>por @{event.createdByUsername}</p>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="size-8 rounded border dark:border-zinc-700/50 border-zinc-300 flex items-center justify-center cursor-pointer">
                  <RiMore2Fill className="size-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 py-3">
                <DropdownMenuItem
                  className="cursor-pointer py-1 px-3 gap-2"
                  onClick={() => onSelect(event)}
                >
                  <RiTimelineView className="size-4" />
                  Detalhes
                </DropdownMenuItem>
                {event.status !== "APPROVED" && (
                  <DropdownMenuItem
                    className="cursor-pointer py-1 px-3 gap-2"
                    onClick={() => onEdit?.(event)}
                  >
                    <RiMarkPenLine className="size-4" />
                    Editar Evento
                  </DropdownMenuItem>
                )}
                {event.status === "PENDING" && (
                  <DropdownMenuItem
                    className="cursor-pointer py-1 px-3 gap-2"
                    onClick={() => setRejectOpen(true)}
                  >
                    <RiForbid2Line className="size-4" />
                    Rejeitar
                  </DropdownMenuItem>
                )}
                {(event.status === "PENDING" ||
                  event.status === "REJECTED") && (
                  <DropdownMenuItem
                    className="cursor-pointer py-1 px-3 gap-2"
                    onClick={() => setApproveOpen(true)}
                  >
                    <RiCheckboxMultipleLine className="size-4" />
                    Aprovar
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="cursor-pointer py-1 px-3 gap-2"
                  variant="destructive"
                >
                  <RiDeleteBinLine className="size-4" />
                  Remover
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </footer>
      </div>

      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg">Aprovar evento</DialogTitle>
            <DialogDescription className="text-zinc-700 dark:text-zinc-300">
              Tem certeza que deseja aprovar o evento &ldquo;{event.title}
              &rdquo;?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="border-zinc-200 dark:border-zinc-700">
            <DialogClose asChild>
              <Button variant="outline" disabled={approveMutation.isPending}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              onClick={() => approveMutation.mutate()}
              disabled={approveMutation.isPending}
              className="bg-design-2 hover:bg-design-2/90"
            >
              {approveMutation.isPending ? "A aprovar..." : "Sim, aprovar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg">Rejeitar evento</DialogTitle>
            <DialogDescription className="text-zinc-700 dark:text-zinc-300">
              Tem certeza que deseja rejeitar o evento &ldquo;{event.title}
              &rdquo;?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="border-zinc-200 dark:border-zinc-700">
            <DialogClose asChild>
              <Button variant="outline" disabled={rejectMutation.isPending}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              onClick={() => rejectMutation.mutate()}
              disabled={rejectMutation.isPending}
              variant="destructive"
            >
              {rejectMutation.isPending ? "A rejeitar..." : "Sim, rejeitar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
