"use client";

import { useRef, useState, useEffect } from "react";
import {
  RiMore2Fill,
  RiMouseFill,
  RiAlertLine,
  RiThumbUpLine,
  RiThumbUpFill,
  RiThumbDownLine,
  RiThumbDownFill,
} from "@remixicon/react";
import { cn } from "@/lib/utils";
import type { ApiEvent } from "@/lib/api/events";
import {
  badgeVariantFromStatus,
  badgeVariantFromType,
  badgeLabelFromStatus,
  modalityLabel,
  timeAgoFromDate,
  formatDate,
  getOptimisticVoteState,
} from "@/data/events";
import { EventDetailModal } from "./EventDetailModal";
import { EventActionsDropdown } from "./EventActionsDropdown";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import { reportEvent, voteEvent, deleteEvent } from "@/lib/api/events";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

const badgeStyles: Record<string, string> = {
  status: "bg-indigo-400/30 text-indigo-800",
  free: "bg-orange-600 text-white",
  paid: "bg-blue-600 text-white",
};

const pastBadgeStyle = "bg-red-500/10 text-red-700";

interface EventCardProps {
  event: ApiEvent;
  className?: string;
  type?: "usual" | "presentation";
}

export function EventCard({
  event,
  className,
  type = "usual",
}: EventCardProps) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dotsRef = useRef<HTMLButtonElement | null>(null);

  const { token, payload } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const isOwner = payload?.userId === event.createdById;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [localVote, setLocalVote] = useState(event.userVote);
  const [localUpvotes, setLocalUpvotes] = useState(event.upvoteCount ?? 0);
  const [localDownvotes, setLocalDownvotes] = useState(event.downvoteCount ?? 0);

  useEffect(() => {
    setLocalVote(event.userVote);
    setLocalUpvotes(event.upvoteCount ?? 0);
    setLocalDownvotes(event.downvoteCount ?? 0);
  }, [event.userVote, event.upvoteCount, event.downvoteCount]);

  const deleteMutation = useMutation({
    mutationFn: () => deleteEvent(event.id, token ?? ""),
    onSuccess: () => {
      toast("success", "Evento eliminado com sucesso!");
      setDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Erro ao eliminar o evento";
      toast("error", message);
    },
  });

  const handleCopyLink = () => {
    const linkToCopy = `${window.location.origin}/event/${event.id}`;
    navigator.clipboard.writeText(linkToCopy);
    toast("success", "Link copiado com sucesso!");
  };

  const voteMutation = useMutation({
    mutationFn: (voteType: "UPVOTE" | "DOWNVOTE") =>
      voteEvent(event.id, { type: voteType }, token ?? ""),
    onMutate: async (voteType) => {
      await queryClient.cancelQueries({ queryKey: ["events"] });
      await queryClient.cancelQueries({ queryKey: ["my-events"] });
      await queryClient.cancelQueries({ queryKey: ["event-details", event.id] });

      const previousEventsData = queryClient.getQueriesData({ queryKey: ["events"] });
      const previousMyEventsData = queryClient.getQueriesData({ queryKey: ["my-events"] });
      const previousEventDetails = queryClient.getQueryData(["event-details", event.id]);

      const nextState = getOptimisticVoteState(event, voteType);

      const updateEventsList = (oldData: any) => {
        if (!oldData || !oldData.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((e: ApiEvent) =>
            e.id === event.id ? { ...e, ...nextState } : e
          ),
        };
      };

      queryClient.setQueriesData({ queryKey: ["events"] }, updateEventsList);
      queryClient.setQueriesData({ queryKey: ["my-events"] }, updateEventsList);
      queryClient.setQueryData(["event-details", event.id], (oldData: any) => {
        if (!oldData) return oldData;
        return { ...oldData, ...nextState };
      });

      return { previousEventsData, previousMyEventsData, previousEventDetails };
    },
    onError: (error: any, voteType, context: any) => {
      if (context) {
        context.previousEventsData?.forEach(([queryKey, queryData]: any) => {
          queryClient.setQueryData(queryKey, queryData);
        });
        context.previousMyEventsData?.forEach(([queryKey, queryData]: any) => {
          queryClient.setQueryData(queryKey, queryData);
        });
        if (context.previousEventDetails) {
          queryClient.setQueryData(["event-details", event.id], context.previousEventDetails);
        }
      }

      toast(
        "error",
        error?.response?.data?.message ||
          error?.message ||
          "Erro ao registar voto",
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
      queryClient.invalidateQueries({ queryKey: ["event-details", event.id] });
    },
  });

  const handleVote = (e: React.MouseEvent, voteType: "UPVOTE" | "DOWNVOTE") => {
    e.stopPropagation();
    if (!token) {
      toast("error", "Deve iniciar sessão para votar num evento.");
      return;
    }

    const previousVote = localVote;
    const previousUpvotes = localUpvotes;
    const previousDownvotes = localDownvotes;

    const nextState = getOptimisticVoteState(
      { userVote: localVote, upvoteCount: localUpvotes, downvoteCount: localDownvotes },
      voteType
    );

    setLocalVote(nextState.userVote);
    setLocalUpvotes(nextState.upvoteCount);
    setLocalDownvotes(nextState.downvoteCount);

    voteMutation.mutate(voteType, {
      onError: () => {
        setLocalVote(previousVote);
        setLocalUpvotes(previousUpvotes);
        setLocalDownvotes(previousDownvotes);
      },
    });
  };

  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [reportReason, setReportReason] =
    useState<string>("FAKE_OR_MISLEADING");
  const [reportDescription, setReportDescription] = useState<string>("");

  const reportMutation = useMutation({
    mutationFn: () =>
      reportEvent(
        event.id,
        {
          reason: reportReason,
          description: reportDescription,
        },
        token || undefined,
      ),
    onSuccess: () => {
      toast("success", "Denúncia enviada com sucesso!");
      setConfirmDialogOpen(false);
      setReportReason("FAKE_OR_MISLEADING");
      setReportDescription("");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Erro ao enviar denúncia";
      toast("error", message);
      setConfirmDialogOpen(false);
      setReportDialogOpen(true);
    },
  });

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setReportDialogOpen(false);
    setConfirmDialogOpen(true);
  };

  // Computations to replace EventCardData properties:
  const categoryName = event.category.name;
  const timeAgo = timeAgoFromDate(event.createdAt);
  const subtitle = modalityLabel(event.modality);
  const dateFormatted = formatDate(event.startDate);
  const badges = [
    {
      label: badgeLabelFromStatus(event.status),
      variant: badgeVariantFromStatus(event.status),
    },
    {
      label: event.type === "FREE" ? "Gratuito" : "Pago",
      variant: badgeVariantFromType(event.type),
    },
  ];

  const headerBg = event.status === "REJECTED" ? "bg-red-600" : "bg-design-2";

  return (
    <>
      <div
        className={cn(
          "h-96 bg-transparent shrink-0 overflow-hidden flex flex-col justify-between border border-gray-200 shadow-2xl shadow-gray-200 z-20 rounded-3xl w-full max-w-80 mx-auto cursor-pointer transition-all hover:shadow-gray-300 hover:-translate-y-0.5",
          className,
        )}
        onClick={() => (type === "usual" ? setDetailOpen(true) : null)}
      >
        <header className={cn("font-sans rounded-t-2xl p-4 h-20", headerBg)}>
          <div className="flex w-full items-center gap-4 justify-between">
            <p className="text-white text-sm">{categoryName}</p>
            <div className="flex items-center gap-4">
              <p className="text-white text-sm">{timeAgo}</p>
              {type === "usual" && (
                <button
                  ref={dotsRef}
                  className="text-white rotate-90 opacity-50 hover:opacity-100 transition-opacity relative"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen((prev) => !prev);
                  }}
                >
                  <RiMore2Fill />
                </button>
              )}
            </div>
          </div>
        </header>
        <div className="h-full w-full flex-col flex justify-between p-5 rounded-t-2xl shadow-2xl bg-white -mt-5">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 mb-2">{subtitle}</p>
              <div className="flex items-center ">
                {event.coverImage ? (
                  <img
                    src={event.coverImage}
                    alt={event.title}
                    className="size-10 rounded-full object-cover border-2 border-white bg-gray-100"
                  />
                ) : (
                  <div className="size-10 rounded-full bg-gray-100 border-2 border-white" />
                )}
              </div>
            </div>
            <h3 className="text-xl mt-1 line-clamp-3">{event.title}</h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2 mt-2">
              {event.description}
            </p>
            {badges.length > 0 && (
              <div className="flex items-center gap-1">
                {badges.map((badge, i) => (
                  <p
                    key={i}
                    className={cn(
                      "px-2 py-0.5 mt-3 rounded inline-flex text-sm",
                      badge.label === "Evento Passado"
                        ? pastBadgeStyle
                        : badgeStyles[badge.variant],
                    )}
                  >
                    {badge.label}
                  </p>
                ))}
              </div>
            )}
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-1">Data do Evento</p>
              <p className="text-base">{dateFormatted}</p>
            </div>
          </div>
          <footer className="flex items-center justify-between w-full">
            {type === "usual" && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className={cn(
                    "flex transition-all items-center gap-1.5 cursor-pointer",
                    localVote === "UPVOTE"
                      ? "text-green-600"
                      : "text-zinc-500 hover:text-green-600",
                  )}
                  onClick={(e) => handleVote(e, "UPVOTE")}
                >
                  {localVote === "UPVOTE" ? (
                    <RiThumbUpFill className="size-5 text-green-600 shrink-0" />
                  ) : (
                    <RiThumbUpLine className="size-5 shrink-0" />
                  )}
                  <span className="text-sm font-medium">
                    {localUpvotes}
                  </span>
                </button>
                <button
                  type="button"
                  className={cn(
                    "flex transition-all items-center gap-1.5 cursor-pointer",
                    localVote === "DOWNVOTE"
                      ? "text-red-600"
                      : "text-zinc-500 hover:text-red-600",
                  )}
                  onClick={(e) => handleVote(e, "DOWNVOTE")}
                >
                  {localVote === "DOWNVOTE" ? (
                    <RiThumbDownFill className="size-5 text-red-600 shrink-0" />
                  ) : (
                    <RiThumbDownLine className="size-5 shrink-0" />
                  )}
                  <span className="text-sm font-medium">
                    {localDownvotes}
                  </span>
                </button>
              </div>
            )}
            <div>
              <Link href={event.link || "#"} target="_blank">
                {type === "usual" && (
                  <button
                    className="text-base transition-all hover:opacity-75 text-white bg-design-2 border-design-2 border rounded-lg px-3 py-1.5 font-normal flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Participar
                  </button>
                )}
              </Link>
            </div>
          </footer>
        </div>
      </div>

      <EventActionsDropdown
        open={dropdownOpen}
        onClose={() => setDropdownOpen(false)}
        onViewDetails={() => setDetailOpen(true)}
        onReport={() => setReportDialogOpen(true)}
        onCopyLink={handleCopyLink}
        onDelete={() => setDeleteDialogOpen(true)}
        isOwner={isOwner}
        triggerRef={dotsRef}
      />

      <EventDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        event={event}
      />

      {/* Report Event Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="sm:max-w-md p-6">
          <DialogHeader>
            <div className="pot:mt-3 mt-7">
              <Image
                src={"/img/feedback.png"}
                alt="icon"
                width={100}
                height={100}
                className="w-20 mb-4"
              />
            </div>
            <DialogTitle className="text-2xl">Denunciar Evento</DialogTitle>
            <DialogDescription>
              Ajude-nos a manter a comunidade segura. Por que razão deseja
              denunciar "{event.title}"?
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleOpenConfirm} className="space-y-4 py-2">
            <div className="space-y-1.5 flex flex-col">
              <label className="text-sm font-medium text-zinc-700">
                Razão da Denúncia
              </label>
              <Select
                value={reportReason}
                onValueChange={(val) => setReportReason(val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma razão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FAKE_OR_MISLEADING">
                    Informação Falsa ou Enganosa
                  </SelectItem>
                  <SelectItem value="FRAUDULENT">
                    Evento Fraudulento (Burla / Golpe)
                  </SelectItem>
                  <SelectItem value="HARASSMENT">
                    Assédio, Abuso ou Bullying
                  </SelectItem>
                  <SelectItem value="SPAM">Spam / Conteúdo Repetido</SelectItem>
                  <SelectItem value="INCORRECT_CATEGORY">
                    Categoria Incorreta
                  </SelectItem>
                  <SelectItem value="INTELLECTUAL_PROPERTY">
                    Violação de Direitos de Autor
                  </SelectItem>
                  <SelectItem value="INAPPROPRIATE_CONTENT">
                    Conteúdo Inapropriado ou Ilegal
                  </SelectItem>
                  <SelectItem value="OTHER">
                    Outra Razão (especificar abaixo)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 flex flex-col">
              <label className="text-sm font-medium text-zinc-700">
                Descrição / Detalhes
              </label>
              <textarea
                className="w-full min-h-24 p-3 border border-gray-200 rounded-lg text-sm outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400"
                placeholder="Por favor, forneça mais informações sobre a sua denúncia..."
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                required
              />
            </div>

            <DialogFooter className="mt-6 border-zinc-200">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Enviar denúncia
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Report Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader className="flex p-2  flex-col items-start ">
            <DialogTitle>Confirmar Denúncia</DialogTitle>
            <DialogDescription>
              Tem a certeza de que deseja anunciar esta denúncia? Esta ação não
              pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="bg-white justify-between! border-zinc-200 flex sm:justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setConfirmDialogOpen(false);
                setReportDialogOpen(true);
              }}
              disabled={reportMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => reportMutation.mutate()}
              disabled={reportMutation.isPending}
            >
              {reportMutation.isPending ? "A enviar..." : "Sim, denunciar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Event Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader className="flex p-2 flex-col items-start">
            <DialogTitle>Eliminar Evento</DialogTitle>
            <DialogDescription>
              Tem a certeza de que deseja eliminar o evento "{event.title}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="bg-white justify-between! border-zinc-200 flex sm:justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "A eliminar..." : "Sim, eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
