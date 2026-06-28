"use client";

import { AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-md px-4 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            type={t.type}
            message={t.message}
            onDismiss={() => dismiss(t.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
