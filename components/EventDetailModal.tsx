"use client";

import { useState, useEffect } from "react";
import {
  RiCloseLine,
  RiMapPinLine,
  RiThumbUpLine,
  RiThumbUpFill,
  RiThumbDownLine,
  RiThumbDownFill,
  RiUserStarFill,
} from "@remixicon/react";
import { AnimatePresence, motion } from "framer-motion";
import type { ApiEvent } from "@/lib/api/events";
import {
  badgeVariantFromStatus,
  badgeVariantFromType,
  badgeLabelFromStatus,
  timeAgoFromDate,
  formatDate,
  getOptimisticVoteState,
} from "@/data/events";
import { cn } from "@/lib/utils";
import { ImageViewerModal } from "./ImageViewerModal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import { voteEvent } from "@/lib/api/events";

const badgeStyles: Record<string, string> = {
  status: "bg-indigo-400/30 text-indigo-800",
  free: "bg-orange-600 text-white",
  paid: "bg-blue-600 text-white",
};

const pastBadgeStyle = "bg-red-500/10 text-red-700";

interface EventDetailModalProps {
  open: boolean;
  onClose: () => void;
  event: ApiEvent;
}

export function EventDetailModal({
  open,
  onClose,
  event,
}: EventDetailModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );

  const [localVote, setLocalVote] = useState(event.userVote);
  const [localUpvotes, setLocalUpvotes] = useState(event.upvoteCount ?? 0);
  const [localDownvotes, setLocalDownvotes] = useState(
    event.downvoteCount ?? 0,
  );

  useEffect(() => {
    setLocalVote(event.userVote);
    setLocalUpvotes(event.upvoteCount ?? 0);
    setLocalDownvotes(event.downvoteCount ?? 0);
  }, [event.userVote, event.upvoteCount, event.downvoteCount]);

  const { token, payload } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const isOwner = payload?.userId === event.createdById;

  const voteMutation = useMutation({
    mutationFn: (voteType: "UPVOTE" | "DOWNVOTE") =>
      voteEvent(event.id, { type: voteType }, token ?? ""),
    onMutate: async (voteType) => {
      await queryClient.cancelQueries({ queryKey: ["events"] });
      await queryClient.cancelQueries({ queryKey: ["my-events"] });
      await queryClient.cancelQueries({
        queryKey: ["event-details", event.id],
      });

      const previousEventsData = queryClient.getQueriesData({
        queryKey: ["events"],
      });
      const previousMyEventsData = queryClient.getQueriesData({
        queryKey: ["my-events"],
      });
      const previousEventDetails = queryClient.getQueryData([
        "event-details",
        event.id,
      ]);

      const nextState = getOptimisticVoteState(event, voteType);

      const updateEventsList = (oldData: any) => {
        if (!oldData || !oldData.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((e: ApiEvent) =>
            e.id === event.id ? { ...e, ...nextState } : e,
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
          queryClient.setQueryData(
            ["event-details", event.id],
            context.previousEventDetails,
          );
        }
      }

      toast(
        "error",
        error?.response?.data?.message ||
          error?.message ||
          "Erro ao registar voto",
      );
    },
    // Não invalidar as listas após votar: o GET /events não devolve o
    // userVote, e o refetch apagaria o voto acabado de registar. A cache
    // já foi atualizada otimisticamente no onMutate.
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["event-details", event.id] });
    },
  });

  const handleVote = (e: React.MouseEvent, voteType: "UPVOTE" | "DOWNVOTE") => {
    e.stopPropagation();
    if (!token) {
      router.push("/signin");
      return;
    }

    const previousVote = localVote;
    const previousUpvotes = localUpvotes;
    const previousDownvotes = localDownvotes;

    const nextState = getOptimisticVoteState(
      {
        userVote: localVote,
        upvoteCount: localUpvotes,
        downvoteCount: localDownvotes,
      },
      voteType,
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

  // Computed properties:
  const categoryName = event.category.name;
  const timeAgo = timeAgoFromDate(event.createdAt);
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

  const images = event.coverImage
    ? [{ src: event.coverImage, alt: event.title }]
    : [];

  const headerBg = event.status === "REJECTED" ? "bg-red-600" : "bg-design-2";

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="detail-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
            onClick={onClose}
          >
            <motion.div
              key="detail-modal"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="flex w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh]"
            >
              <div className="flex-1 overflow-y-auto p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "text-xs font-medium px-3 py-1 rounded-full",
                        headerBg,
                        "text-white",
                      )}
                    >
                      {categoryName}
                    </span>
                    <span className="text-sm text-zinc-600">{timeAgo}</span>
                    {isOwner && (
                      <span
                        title="Este evento pertence-te"
                        className="inline-flex items-center text-amber-700"
                      >
                        <RiUserStarFill className="size-4" />
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="text-zinc-400 hover:text-zinc-700 transition-colors"
                    onClick={onClose}
                  >
                    <RiCloseLine className="size-6" />
                  </button>
                </div>

                <h2 className="text-2xl font-semibold text-zinc-900 leading-tight">
                  {event.title}
                </h2>

                {badges.length > 0 && (
                  <div className="flex items-center gap-1 mt-4">
                    {badges.map((badge, i) => (
                      <span
                        key={i}
                        className={cn(
                          "px-2 py-0.5 rounded inline-flex text-sm",
                          badge.label === "Evento Passado"
                            ? pastBadgeStyle
                            : badgeStyles[badge.variant],
                        )}
                      >
                        {badge.label}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-6">
                  <p className="text-sm text-zinc-500 mb-1">Sobre o evento</p>
                  <p className="text-zinc-700 text-[15px] leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {event.location && (
                  <div className="mt-6">
                    <p className="text-sm text-zinc-500 mb-1">Localização</p>
                    <p className="text-zinc-700 text-[15px] flex items-center gap-1.5">
                      <RiMapPinLine className="size-4 text-zinc-400 shrink-0" />
                      {event.location}
                    </p>
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <div>
                      <p className="text-sm text-zinc-500 mb-1">
                        Data do Evento
                      </p>
                      <p className="text-base text-zinc-800">{dateFormatted}</p>
                    </div>
                    {event.createdByUsername && (
                      <div>
                        <p className="text-sm text-zinc-500 mb-1">
                          Publicado por
                        </p>
                        <p className="text-base text-zinc-800">
                          @{event.createdByUsername}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        className="rounded-full overflow-hidden border-2 border-white hover:opacity-85 transition-opacity shrink-0"
                        style={{ marginLeft: i === 0 ? 0 : -10 }}
                        onClick={() => setSelectedImageIndex(i)}
                      >
                        <div
                          style={{
                            backgroundImage: `url("${img.src}")`,
                          }}
                          className="size-10 bg-cover bg-center rounded-full"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
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
                  <Link href={event.link || "#"} target="_blank">
                    <button
                      className="text-base transition-all hover:opacity-75 text-white bg-design-2 border-design-2 border rounded-lg px-3 py-1.5 font-normal flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Participar
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ImageViewerModal
        open={selectedImageIndex !== null}
        onClose={() => setSelectedImageIndex(null)}
        images={images}
        currentIndex={selectedImageIndex ?? 0}
        onIndexChange={setSelectedImageIndex}
      />
    </>
  );
}
