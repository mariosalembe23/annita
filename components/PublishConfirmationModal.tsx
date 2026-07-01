"use client";

import { RiCloseLine } from "@remixicon/react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

interface PublishConfirmationModalProps {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function PublishConfirmationModal({
  open,
  loading,
  onClose,
  onConfirm,
}: PublishConfirmationModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
          onClick={loading ? undefined : onClose}
        >
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="flex-1 relative p-10">
              {!loading && (
                <button
                  type="button"
                  className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 transition-opacity"
                  onClick={onClose}
                >
                  <RiCloseLine />
                </button>
              )}

              <div className="pot:mt-3 mt-7">
                <Image
                  src={"/img/fork1.png"}
                  alt="icon"
                  width={100}
                  height={100}
                  className="w-20 mb-4"
                />
              </div>

              <h2 className="text-2xl font-medium text-zinc-900">
                Compromisso de veracidade
              </h2>
              <p className="text-[15px] text-zinc-500 mt-3 leading-relaxed">
                Ao publicar este evento, assumes o compromisso de que todas as
                informações fornecidas são verdadeiras, precisas e não induzem
                os participantes em erro.
              </p>
              <p className="text-[15px] text-zinc-500 mt-3 leading-relaxed">
                A annita reserva-se ao direito de remover qualquer evento que
                contenha informações fraudulentas, enganosas, ou que viole os
                termos de uso da plataforma. Práticas de burla, falsas promessas
                ou conteúdos abusivos não serão tolerados.
              </p>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="text-base transition-all hover:bg-gray-50 text-zinc-700 border border-gray-200 rounded-lg px-3 py-1.5 font-normal disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={loading}
                  className="text-base transition-all hover:opacity-75 text-white bg-design-2 border-design-2 border rounded-lg px-3 py-1.5 font-normal inline-flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading && (
                    <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  {loading ? "A publicar..." : "Confirmar e publicar"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
