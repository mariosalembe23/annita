"use client";

import {
  RiAlarmWarningFill,
  RiCheckboxCircleFill,
  RiInformationFill,
} from "@remixicon/react";
import { motion } from "framer-motion";
import type { ToastType } from "@/hooks/use-toast";

const iconMap = {
  success: RiCheckboxCircleFill,
  error: RiAlarmWarningFill,
  info: RiInformationFill,
};

const colorMap = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
};

const iconColorMap = {
  success: "text-green-500",
  error: "text-red-500",
  info: "text-blue-500",
};

interface ToastProps {
  type: ToastType;
  message: string;
  onDismiss: () => void;
}

export function Toast({ type, message, onDismiss }: ToastProps) {
  const Icon = iconMap[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      layout
      onClick={onDismiss}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg cursor-pointer max-w-md w-full pointer-events-auto ${colorMap[type]}`}
    >
      <Icon className={`size-5 shrink-0 ${iconColorMap[type]}`} />
      <p className="text-sm font-medium leading-tight">{message}</p>
    </motion.div>
  );
}
