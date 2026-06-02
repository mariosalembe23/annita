"use client";

import { RiCloseLine, RiPhoneLockLine } from "@remixicon/react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

interface EmailVerificationModalProps {
  open: boolean;
  onClose: () => void;
}

export function EmailVerificationModal({
  open,
  onClose,
}: EmailVerificationModalProps) {
  const [code, setCode] = useState("");

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
            className="flex w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="hidden md:flex w-[45%] bg-design-2/20 flex-col items-center justify-center p-10 text-white">
              <Image
                src={"img-logo/simple-logo.svg"}
                alt={"Logo"}
                width={100}
                className="w-8"
                height={100}
              />
              <p className="text-4xl text-design-3 mt-3">annita</p>
            </div>

            <div className="flex-1 relative p-10">
              <div className="flex pt-7 md:hidden items-center gap-2 mb-6">
                <Image
                  src={"img-logo/simple-logo.svg"}
                  alt={"Logo"}
                  width={100}
                  className="w-7"
                  height={100}
                />
                <p className="text-3xl text-design-3">annita</p>
              </div>

              <button
                type="button"
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 transition-opacity"
                onClick={onClose}
              >
                <RiCloseLine />
              </button>

              <h2 className="text-2xl ret:pt-8 font-medium text-zinc-900">
                Verifica o teu email
              </h2>
              <p className="text-[15px] text-zinc-500 mt-2 leading-relaxed">
                Enviámos um código de confirmação para o teu email. Insere-o
                abaixo para continuares.
              </p>

              <div className="mt-8">
                <label className="text-sm font-medium text-zinc-700 mb-2 block">
                  Código de confirmação
                </label>
                <div className="flex transition-all focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-400 items-center px-3 py-2.5 rounded-lg border border-gray-200">
                  <RiPhoneLockLine className="size-5 text-zinc-400 shrink-0" />
                  <input
                    className="w-full outline-none ps-2 text-base tracking-[0.3em]"
                    type="text"
                    inputMode="numeric"
                    placeholder="000000"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
              </div>

              <button
                type="button"
                className="w-full mt-6 text-base transition-all hover:opacity-75 text-white bg-design-2 border-design-2 border rounded-lg px-3 py-2.5 font-normal"
                onClick={() => {
                  // confirm email
                }}
              >
                Confirmar
              </button>

              <p className="text-center text-[15px] text-zinc-500 mt-6">
                Não recebeste?{" "}
                <button
                  type="button"
                  className="text-design-2 hover:underline font-medium"
                  onClick={() => {
                    // resend code
                  }}
                >
                  Reenviar código
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
