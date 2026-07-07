"use client";

import { RiCloseLine } from "@remixicon/react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

interface NotificationPreferenceModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export function NotificationPreferenceModal({
  open,
  onClose,
  onConfirm,
  loading,
}: NotificationPreferenceModalProps) {
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
          onClick={onClose}
        >
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-xl dark:border border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="flex-1 relative p-10">
              <button
                type="button"
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-opacity"
                onClick={onClose}
              >
                <RiCloseLine />
              </button>

              <div className="pot:mt-3 mt-7">
                <Image
                  src={"/img/notification-flork.png"}
                  alt="icon"
                  width={100}
                  height={100}
                  className="w-20 mb-4 dark:invert"
                />
              </div>

              <h2 className="text-2xl font-medium text-zinc-900 dark:text-zinc-100">
                Notificações de eventos
              </h2>
              <p className="text-[15px] text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed">
                Desejas ser notificado(a) quando houverem eventos disponíveis na
                plataforma?
              </p>
              <p className="text-[15px] text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed">
                Assim que novos eventos forem publicados, enviaremos uma
                notificação para o teu email. Podes alterar esta preferência a
                qualquer momento.
              </p>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-base transition-all hover:bg-gray-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 font-normal"
                >
                  Não, obrigado
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={loading}
                  className="text-base transition-all hover:opacity-75 disabled:opacity-50 text-white bg-design-2 border-design-2 border rounded-lg px-3 py-1.5 font-normal"
                >
                  Sim, notifica-me
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
