"use client";

import { useState } from "react";
import {
  RiCloseLine,
  RiCursorHand,
  RiMapPinLine,
  RiMouseFill,
} from "@remixicon/react";
import { AnimatePresence, motion } from "framer-motion";
import type { EventCardData } from "@/data/events";
import { cn } from "@/lib/utils";
import { ImageViewerModal } from "./ImageViewerModal";

const badgeStyles: Record<string, string> = {
  status: "bg-indigo-400/30 text-indigo-800",
  free: "bg-orange-600 text-white",
  paid: "bg-blue-600 text-white",
};

const pastBadgeStyle = "bg-red-500/10 text-red-700";

interface EventDetailModalProps {
  open: boolean;
  onClose: () => void;
  event: EventCardData;
}

export function EventDetailModal({
  open,
  onClose,
  event,
}: EventDetailModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );

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
                        event.headerBg ?? "bg-design-2",
                        "text-white",
                      )}
                    >
                      {event.category}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {event.timeAgo}
                    </span>
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

                <div className="flex items-center gap-1 mt-2 text-zinc-500 text-sm">
                  <RiMapPinLine className="size-4 shrink-0" />
                  <span>{event.location}</span>
                </div>

                {event.badges.length > 0 && (
                  <div className="flex items-center gap-1 mt-4">
                    {event.badges.map((badge, i) => (
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

                <div className="mt-6 flex items-center justify-between">
                  <div className="">
                    <p className="text-sm text-zinc-500 mb-1">Data do Evento</p>
                    <p className="text-base text-zinc-800">{event.date}</p>
                  </div>
                  <div className="flex items-center">
                    {event.images.map((img, i) => (
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
                  <p className="flex items-center text-blue-600 gap-1 text-sm">
                    <RiMouseFill className="size-5" />
                    {event.interest} interessados
                  </p>
                  <button className="text-base transition-all hover:opacity-75 text-white bg-design-2 border-design-2 border rounded-lg px-4 py-2 font-normal flex items-center gap-2">
                    <RiCursorHand className="size-4" />
                    {event.buttonLabel}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ImageViewerModal
        open={selectedImageIndex !== null}
        onClose={() => setSelectedImageIndex(null)}
        images={event.images}
        currentIndex={selectedImageIndex ?? 0}
        onIndexChange={setSelectedImageIndex}
      />
    </>
  );
}
