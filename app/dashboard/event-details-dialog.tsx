import { useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
import {
  RiCheckboxMultipleLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiEyeLine,
  RiForbid2Line,
} from "@remixicon/react";
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
import { ApiEvent } from "@/lib/api/events";
import {
  statusColors,
  statusLabels,
  typeLabels,
  modalityLabels,
} from "./mock-data";

interface EventDetailsDialogProps {
  event: ApiEvent | null;
  onClose: () => void;
}

export default function EventDetailsDialog({
  event,
  onClose,
}: EventDetailsDialogProps) {
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  return (
    <Dialog
      open={!!event}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          setIsImageZoomed(false);
        }
      }}
    >
      <DialogContent className="sm:max-w-[60vw] flex flex-col">
        {event && (
          <>
            <DialogHeader className="flex flex-row items-start justify-between gap-6 pr-6">
              <div className="flex-1">
                <DialogTitle className="text-xl">
                  {event.title}
                </DialogTitle>
                <DialogDescription className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  {event.description}
                </DialogDescription>
              </div>
              {event.coverImage && (
                <button
                  onClick={() => setIsImageZoomed(true)}
                  className="shrink-0 relative group focus:outline-none rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-sm"
                >
                  <Image
                    src={event.coverImage}
                    alt={event.title}
                    width={56}
                    height={56}
                    className="size-14 object-cover transition-transform duration-200 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <RiEyeLine className="size-4 text-white" />
                  </div>
                </button>
              )}
            </DialogHeader>

            <div className="flex-1 overflow-y-auto space-y-4 px-1">
              <div className="grid mt-4 grid-cols-4 gap-x-8 gap-y-6 text-sm">
                <div className="py-2 border-b border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-600 dark:text-zinc-400 text-sm">Status</span>
                  <p
                    className={`text-xs font-medium mt-0.5 ${statusColors[event.status] || "text-zinc-800 dark:text-zinc-200"}`}
                  >
                    {statusLabels[event.status] || event.status}
                  </p>
                </div>
                <div className="py-2 border-b border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-600 dark:text-zinc-400 text-sm">Tipo</span>
                  <p className="text-zinc-800 dark:text-zinc-200 text-sm mt-0.5">
                    {typeLabels[event.type] || event.type}
                  </p>
                </div>
                <div className="py-2 border-b border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-600 dark:text-zinc-400 text-sm">Modalidade</span>
                  <p className="text-zinc-800 dark:text-zinc-200 text-sm mt-0.5">
                    {Array.isArray(event.modality)
                      ? event.modality.map((m) => modalityLabels[m] || m).join(", ")
                      : (modalityLabels[event.modality as any] || event.modality)}
                  </p>
                </div>
                <div className="py-2 border-b border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-600 dark:text-zinc-400 text-sm">Categoria</span>
                  <p className="text-zinc-800 dark:text-zinc-200 text-sm mt-0.5">
                    {event.category.name}
                  </p>
                </div>
                <div className="py-2 border-b border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-600 dark:text-zinc-400 text-sm">Grupo</span>
                  <p className="text-zinc-800 dark:text-zinc-200 text-sm mt-0.5">
                    {event.category.groupName}
                  </p>
                </div>
                <div className="py-2 border-b border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-600 dark:text-zinc-400 text-sm">Link</span>
                  <p className="text-zinc-800 dark:text-zinc-200 text-sm mt-0.5 truncate">
                    {event.link}
                  </p>
                </div>
                <div className="py-2 border-b border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-600 dark:text-zinc-400 text-sm">
                    Data de Início
                  </span>
                  <p className="text-zinc-800 dark:text-zinc-200 text-sm mt-0.5">
                    {format(
                      new Date(event.startDate),
                      "dd/MM/yyyy 'às' HH:mm",
                    )}
                  </p>
                </div>
                <div className="py-2 border-b border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-600 dark:text-zinc-400 text-sm">Criado por</span>
                  <p className="text-zinc-800 dark:text-zinc-200 text-sm mt-0.5">
                    {event.createdByUsername}
                  </p>
                </div>
                <div className="py-2 border-b border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-600 dark:text-zinc-400 text-sm">Criado em</span>
                  <p className="text-zinc-800 dark:text-zinc-200 text-sm mt-0.5">
                    {format(
                      new Date(event.createdAt),
                      "dd/MM/yyyy 'às' HH:mm",
                    )}
                  </p>
                </div>
                <div className="py-2 border-b border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-600 dark:text-zinc-400 text-sm">
                    Actualizado em
                  </span>
                  <p className="text-zinc-800 dark:text-zinc-200 text-sm mt-0.5">
                    {format(
                      new Date(event.updatedAt),
                      "dd/MM/yyyy 'às' HH:mm",
                    )}
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="border-t bg-white dark:bg-zinc-900 border-white dark:border-zinc-900 pt-4 mt-4">
              <div className="flex items-center gap-2 w-full justify-end">
                <DialogClose asChild>
                  <Button variant="outline" size="sm">
                    <RiForbid2Line className="size-4" />
                    Rejeitar
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-design-2 hover:bg-design-2/90"
                  >
                    <RiCheckboxMultipleLine className="size-4" />
                    Aprovar
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="destructive" size="sm">
                    <RiDeleteBinLine className="size-4" />
                    Remover
                  </Button>
                </DialogClose>
              </div>
            </DialogFooter>

            {isImageZoomed && event.coverImage && (
              <div
                className="fixed inset-0 z-100 flex items-center justify-center bg-black/85 backdrop-blur-sm cursor-zoom-out animate-in fade-in-0 duration-200"
                onClick={() => setIsImageZoomed(false)}
              >
                <div
                  className="relative max-w-[80vw] max-h-[85vh] flex items-center justify-center cursor-default animate-in zoom-in-95 duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={event.coverImage}
                    alt={event.title}
                    width={1200}
                    height={900}
                    className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                  />
                  <button
                    onClick={() => setIsImageZoomed(false)}
                    className="absolute -top-12 right-0 bg-black/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors cursor-pointer"
                  >
                    <RiCloseLine className="size-6" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
