"use client";

import { useEffect } from "react";
import {
  RiCloseLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from "@remixicon/react";
import { AnimatePresence, motion } from "framer-motion";
import type { EventImage } from "@/data/events";

interface ImageViewerModalProps {
  open: boolean;
  onClose: () => void;
  images: EventImage[];
  currentIndex: number;
  onIndexChange?: (index: number) => void;
}

export function ImageViewerModal({
  open,
  onClose,
  images,
  currentIndex,
  onIndexChange,
}: ImageViewerModalProps) {
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && currentIndex > 0)
        onIndexChange?.(currentIndex - 1);
      if (e.key === "ArrowRight" && currentIndex < images.length - 1)
        onIndexChange?.(currentIndex + 1);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, currentIndex, images.length, onClose, onIndexChange]);

  function goPrev() {
    if (currentIndex > 0) onIndexChange?.(currentIndex - 1);
  }

  function goNext() {
    if (currentIndex < images.length - 1) onIndexChange?.(currentIndex + 1);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="image-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-70 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            key="image-modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center"
          >
            <button
              type="button"
              className="absolute -top-10 right-0 text-white/80 hover:text-white transition-colors"
              onClick={onClose}
            >
              <RiCloseLine className="size-8" />
            </button>

            {images.length > 1 && currentIndex > 0 && (
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full p-2 z-10"
              >
                <RiArrowLeftSLine className="size-8" />
              </button>
            )}

            {images.length > 1 && currentIndex < images.length - 1 && (
              <button
                type="button"
                onClick={goNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full p-2 z-10"
              >
                <RiArrowRightSLine className="size-8" />
              </button>
            )}

            <img
              src={images[currentIndex]?.src}
              alt={images[currentIndex]?.alt}
              className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />

            {images.length > 1 && (
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2">
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={`size-2 rounded-full transition-colors ${
                      i === currentIndex ? "bg-white" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
