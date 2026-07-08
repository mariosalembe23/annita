"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("annita_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setShowConsent(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("annita_cookie_consent", "accepted");
    setShowConsent(false);
  };

  const handleDecline = () => {
    localStorage.setItem("annita_cookie_consent", "declined");
    setShowConsent(false);
  };

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 right-6 left-6 small:left-auto small:max-w-md z-50 p-6 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-gray-200 dark:border-zinc-800 shadow-2xl shadow-gray-200/50 dark:shadow-black/50"
        >
          <div className="flex flex-col gap-4">
            <div className="space-y-1">
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base flex items-center gap-2">
                🍪 Preferências de Cookies
              </h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Utilizamos cookies para melhorar a tua navegação, personalizar conteúdos e analisar o nosso tráfego. 
                Sabe mais lendo a nossa{" "}
                <Link href="/cookies" className="text-design-2 dark:text-design-1 hover:underline font-medium">
                  Política de Cookies
                </Link>{" "}
                e{" "}
                <Link href="/privacy" className="text-design-2 dark:text-design-1 hover:underline font-medium">
                  Política de Privacidade
                </Link>
                .
              </p>
            </div>
            <div className="flex items-center gap-3 mt-1 justify-end">
              <button
                type="button"
                onClick={handleDecline}
                className="px-3.5 py-2 text-xs font-medium rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Recusar
              </button>
              <button
                type="button"
                onClick={handleAccept}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-design-2 hover:bg-design-2/90 text-white shadow-xs transition-colors cursor-pointer"
              >
                Aceitar tudo
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
