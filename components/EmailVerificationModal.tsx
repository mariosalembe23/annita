"use client";

import { RiCloseLine, RiPhoneLockLine } from "@remixicon/react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { sendVerificationCode, verifyEmailCode } from "@/lib/api/auth";
import { useToast } from "@/hooks/use-toast";

interface EmailVerificationModalProps {
  open: boolean;
  token: string;
  email: string;
  onVerified: () => void;
  onClose: () => void;
}

export function EmailVerificationModal({
  open,
  token,
  email,
  onVerified,
  onClose,
}: EmailVerificationModalProps) {
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  function startCooldown() {
    setCooldown(30);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (!open) {
      setCode("");
      setCooldown(0);
      clearInterval(intervalRef.current);
      return;
    }
    setSending(true);
    sendVerificationCode(token)
      .then(() => {
        toast("info", "Código de verificação enviado para o teu email");
        startCooldown();
      })
      .catch((err) => {
        const msg = err?.response?.data?.message || "Erro ao enviar código";
        toast("error", msg);
      })
      .finally(() => setSending(false));
  }, [open, token, toast]);

  async function handleConfirm() {
    if (!code) return;
    setVerifying(true);
    try {
      await verifyEmailCode(token, code);
      toast("success", "Email verificado com sucesso!");
      onVerified();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Código inválido";
      toast("error", msg);
    } finally {
      setVerifying(false);
    }
  }

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
            className="flex w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="hidden md:flex w-[45%] bg-design-2/20 dark:bg-design-2/10 flex-col items-center justify-center p-10 text-white">
              <Image
                src={"img-logo/simple-logo.svg"}
                alt={"Logo"}
                width={100}
                className="w-8"
                height={100}
              />
              <p className="text-4xl text-design-3 dark:text-white mt-3">annita</p>
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
                <p className="text-3xl text-design-3 dark:text-white">annita</p>
              </div>

              <button
                type="button"
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-opacity"
                onClick={onClose}
              >
                <RiCloseLine />
              </button>

              <h2 className="text-2xl ret:pt-8 font-medium text-zinc-900 dark:text-zinc-100">
                Verifica o teu email
              </h2>
              <p className="text-[15px] text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                {sending
                  ? "A enviar código de verificação..."
                  : `Enviámos um código de confirmação para ${email}. Insere-o abaixo para continuares.`}
              </p>

              <div className="mt-8">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
                  Código de confirmação
                </label>
                <div className="flex transition-all focus-within:ring-4 focus-within:ring-blue-100 dark:focus-within:ring-blue-500/20 focus-within:border-blue-400 dark:focus-within:border-blue-500 items-center px-3 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-white/5">
                  <RiPhoneLockLine className="size-5 text-zinc-400 shrink-0" />
                  <input
                    className="w-full outline-none ps-2 text-base tracking-[0.3em] bg-transparent text-zinc-900 dark:text-zinc-100"
                    type="text"
                    inputMode="numeric"
                    placeholder="000000"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    disabled={sending || verifying}
                  />
                </div>
              </div>

              <button
                type="button"
                disabled={sending || verifying || code.length < 6}
                className="w-full mt-6 text-base transition-all hover:opacity-75 disabled:opacity-50 text-white bg-design-2 border-design-2 border rounded-lg px-3 py-2.5 font-normal"
                onClick={handleConfirm}
              >
                {verifying ? "A verificar..." : "Confirmar"}
              </button>

              <p className="text-center text-[15px] text-zinc-500 dark:text-zinc-400 mt-6">
                Não recebeste?{" "}
                <button
                  type="button"
                  disabled={sending || cooldown > 0}
                  className="text-design-2 dark:text-design-1 hover:underline font-medium disabled:opacity-50"
                  onClick={() => {
                    setSending(true);
                    sendVerificationCode(token)
                      .then(() => {
                        toast("info", "Código reenviado para o teu email");
                        startCooldown();
                      })
                      .catch((err) => {
                        const msg =
                          err?.response?.data?.message ||
                          "Erro ao reenviar código";
                        toast("error", msg);
                      })
                      .finally(() => setSending(false));
                  }}
                >
                  {sending
                    ? "A enviar..."
                    : cooldown > 0
                      ? `Reenviar (${cooldown}s)`
                      : "Reenviar código"}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
