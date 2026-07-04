"use client";

import { useRef, useState } from "react";
import { RiMore2Fill, RiMouseFill, RiAlertLine } from "@remixicon/react";
import { cn } from "@/lib/utils";
import type { EventCardData } from "@/data/events";
import { EventDetailModal } from "./EventDetailModal";
import { EventActionsDropdown } from "./EventActionsDropdown";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import { reportEvent } from "@/lib/api/events";
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
  event: EventCardData;
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

  const { token } = useUser();
  const { toast } = useToast();

  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [reportReason, setReportReason] =
    useState<string>("FAKE_OR_MISLEADING");
  const [reportDescription, setReportDescription] = useState<string>("");

  const reportMutation = useMutation({
    mutationFn: () =>
      reportEvent(
        event.realId || String(event.id),
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

  return (
    <>
      <div
        className={cn(
          "h-96 bg-transparent shrink-0 overflow-hidden flex flex-col justify-between border border-gray-200 shadow-2xl shadow-gray-200 z-20 rounded-3xl w-80 cursor-pointer transition-all hover:shadow-gray-300 hover:-translate-y-0.5",
          className,
        )}
        onClick={() => (type === "usual" ? setDetailOpen(true) : null)}
      >
        <header
          className={cn(
            "font-sans rounded-t-2xl p-4 h-20",
            event.headerBg ?? "bg-design-2",
          )}
        >
          <div className="flex w-full items-center gap-4 justify-between">
            <p className="text-white text-sm">{event.category}</p>
            <div className="flex items-center gap-4">
              <p className="text-white text-sm">{event.timeAgo}</p>
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
              <p className="text-sm text-gray-600 mb-2">{event.subtitle}</p>
              <div className="flex items-center ">
                {event.images && event.images[0] ? (
                  <img
                    src={event.images[0].src}
                    alt={event.images[0].alt || event.title}
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
            {event.badges.length > 0 && (
              <div className="flex items-center gap-1">
                {event.badges.map((badge, i) => (
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
              <p className="text-base">{event.date}</p>
            </div>
          </div>
          <footer className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <button className="flex transition-all text-black hover:text-green-600 items-center gap-1">
                <svg
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5.5 pointer-events-none btn-icon"
                  strokeWidth={2}
                >
                  <path
                    d="M9.456 4.216l-5.985 7.851c-.456.637-.583 1.402-.371 2.108l.052.155a2.384 2.384 0 002.916 1.443l2.876-.864.578 4.042a2.384 2.384 0 002.36 2.047h.234l.161-.006a2.384 2.384 0 002.2-2.041l.576-4.042 2.877.864a2.384 2.384 0 002.625-3.668L14.63 4.33a3.268 3.268 0 00-5.174-.115zm3.57.613c.16.114.298.253.411.411l5.897 7.736a.884.884 0 01-.973 1.36l-3.563-1.069a.884.884 0 00-1.129.722l-.678 4.75a.884.884 0 01-.875.759h-.234a.884.884 0 01-.875-.76l-.679-4.75a.884.884 0 00-1.128-.72l-3.563 1.068a.884.884 0 01-.973-1.36L10.56 5.24a1.767 1.767 0 012.465-.41z"
                    fill="currentcolor"
                  ></path>
                </svg>
                <p>12</p>
              </button>
              <button className="flex transition-all text-black hover:text-red-600 items-center gap-1">
                <svg
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5.5 rotate-180 pointer-events-none btn-icon"
                  strokeWidth={2}
                >
                  <path
                    d="M9.456 4.216l-5.985 7.851c-.456.637-.583 1.402-.371 2.108l.052.155a2.384 2.384 0 002.916 1.443l2.876-.864.578 4.042a2.384 2.384 0 002.36 2.047h.234l.161-.006a2.384 2.384 0 002.2-2.041l.576-4.042 2.877.864a2.384 2.384 0 002.625-3.668L14.63 4.33a3.268 3.268 0 00-5.174-.115zm3.57.613c.16.114.298.253.411.411l5.897 7.736a.884.884 0 01-.973 1.36l-3.563-1.069a.884.884 0 00-1.129.722l-.678 4.75a.884.884 0 01-.875.759h-.234a.884.884 0 01-.875-.76l-.679-4.75a.884.884 0 00-1.128-.72l-3.563 1.068a.884.884 0 01-.973-1.36L10.56 5.24a1.767 1.767 0 012.465-.41z"
                    fill="currentcolor"
                  ></path>
                </svg>
                <p>12</p>
              </button>
            </div>
            <div>
              <Link href={event.link || "#"} target="_blank">
                {type === "usual" && (
                  <button
                    className="text-base transition-all hover:opacity-75 text-white bg-design-2 border-design-2 border rounded-lg px-3 py-1.5 font-normal flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {event.buttonLabel}
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
              Tem a certeza de que deseja denunciar este evento? Esta ação não
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
    </>
  );
}
